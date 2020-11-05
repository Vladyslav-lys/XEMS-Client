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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    private serviceConnectionClient: SignalRService,
    private authenticationService: AuthenticationService,
	//private stub:StubService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {
	  //localStorage.clear();
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
		  var auth = operationStatusInfo.attachedObject;
		  var currentDate = new Date();
		  auth[4] = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay() + 8);
        localStorage.setItem('currentAuthentication', JSON.stringify(auth));
		var authentication = JSON.parse(localStorage.currentAuthentication);
        th.authenticationService.setAuth(true);
		th.getAccessAdmin(authentication[1]);
		th.getAccessTeacher(authentication[1]);
		th.getAccessStudent(authentication[1]);
        th.router.navigate(['/']);
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
	
	enableBtn():boolean {
		if(this.f.username.value.length > 0 && this.f.password.value.length > 0)
			return true;
		return false;
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