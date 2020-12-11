import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
//import { StubService } from '../_services/stub.service';
import { SignalRService } from '../_services/signalR.service';
import { ActivatedRoute, Router } from '@angular/router';
import {operationStatusInfo, OperationStatus} from '../_helpers/operationStatusInfo';
import { AlertService } from '../_services/alert.service';
import { Authorization } from '../_models/authorization';
import { AccessLevel } from "../_enums/accessLevel";
import { Subscription } from 'rxjs';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { Logger, CryptoUtils, InteractionRequiredAuthError, AuthError } from 'msal';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  subscriptions: Subscription[] = [];
  
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private broadcastService: BroadcastService,
    private msalService: MsalService,
    private serviceConnectionClient: SignalRService,
    private authenticationService: AuthenticationService,
	//private stub:StubService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
	private http: HttpClient
  ) {
	  //localStorage.clear();
  }

  ngOnInit() {
	  
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	
	let loginSuccessSubscription: Subscription;
    let loginFailureSubscription: Subscription;

    loginSuccessSubscription = this.broadcastService.subscribe('msal:loginSuccess', () => {
      this.loginViaTeams();
    });

    loginFailureSubscription = this.broadcastService.subscribe('msal:loginFailure', (error) => {
      console.log('Login Fails:', error);
    });

    this.subscriptions.push(loginSuccessSubscription);
    this.subscriptions.push(loginFailureSubscription);

    this.msalService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }

      console.log('Redirect Success: ', response.accessToken);
    });

    this.msalService.setLogger(new Logger((logLevel, message, piiEnabled) => {
      console.log('MSAL Logging: ', message);
    }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false
    }));
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    var th = this;
	
    this.authenticationService.login(this.f.username.value, this.f.password.value)
	  .then(function (operationStatusInfo : operationStatusInfo){
		if (operationStatusInfo.operationStatus == OperationStatus.Done) {
		  th.login(operationStatusInfo);  
		}
		else {
          th.alertService.error(operationStatusInfo.attachedInfo);
          th.loading = false;
		}
      }).catch(err => {
		console.log(err);
		this.alertService.error(err.toString());
		this.loading = false;
      });
  }
  
  loginViaTeams()
  {
	var guid;
	var th = this;
	const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me?$select=id';
	this.http.get(GRAPH_ENDPOINT)
		 .subscribe({
		  next: (id) => {
           guid = id;
		   th.authenticationService.loginViaTeams(guid.id)
			.then(function (operationStatusInfo : operationStatusInfo){
				if (operationStatusInfo.operationStatus == OperationStatus.Done) {
					th.login(operationStatusInfo);
				}
				else {
					th.alertService.error(operationStatusInfo.attachedInfo);
					th.loading = false;
					th.authenticationService.teamsGetUserFirstLogin(guid.id)
					  .then(function (operationStatusInfo : operationStatusInfo){
						if (operationStatusInfo.operationStatus == OperationStatus.Done) {
							var tempUser = operationStatusInfo.attachedObject;
							tempUser[0].guid = guid.id;
							sessionStorage.setItem('tempUser', JSON.stringify(tempUser[0]));
							th.router.navigate(['/first-enter-data']);
						}
						else {
							th.alertService.error(operationStatusInfo.attachedInfo);
							th.loading = false;
						}
					  }).catch(err => {
							console.log(err);
							this.alertService.error(err.toString());
							this.loading = false;
					  });
				}
			}).catch(err => {
				console.log(err);
				this.alertService.error(err.toString());
				this.loading = false;
			});  
          },
		  error: (err: AuthError) => {
            // If there is an interaction required error,
            // call one of the interactive methods and then make the request again.
            if (InteractionRequiredAuthError.isInteractionRequiredError(err.errorCode)) {
				th.msalService.acquireTokenPopup({
                 scopes: th.msalService.getScopesForEndpoint(GRAPH_ENDPOINT)
			    })
				.then(() => {
				  this.http.get(GRAPH_ENDPOINT)
				   .toPromise()
				    .then(id => {
					  guid = id;
					});
				});
			}
           }
		});
  }
  
  login(operationStatusInfo)
  {
	var auth = operationStatusInfo.attachedObject;
	var currentDate = new Date();
	auth[4] = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay() + 8);
    localStorage.setItem('currentAuthentication', JSON.stringify(auth));
	var authentication = JSON.parse(localStorage.currentAuthentication);
	this.serviceConnectionClient.makeFullConnection(authentication);
    this.authenticationService.setAuth(true);
	this.getAccessAdmin(authentication);
	this.getAccessTeacher(authentication);
	this.getAccessStudent(authentication);
    this.router.navigate(['/']);  
  }
	
	enableBtn():boolean {
		if(this.f.username.value.length > 0 && this.f.password.value.length > 0)
			return true;
		return false;
	}
	
	setTeams()
	{
		const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

		if (isIE) {
			this.msalService.loginRedirect();
		} else {
			this.msalService.loginPopup();
		}
	}
	
  getAccessAdmin(authentication)
  {
	  if(authentication[1] == AccessLevel.Admin)
	  {
		  this.authenticationService.setAccessAdmin(true);
	  }
  }
  
  getAccessTeacher(authentication)
  {
	if(authentication[1] == AccessLevel.Teacher)
	{
		this.authenticationService.setAccessTeacher(true);
	}  
  }
  
  getAccessStudent(authentication)
  {
	if(authentication[1] == AccessLevel.Student)
	{
		this.authenticationService.setAccessStudent(true);
	}  
  }
}