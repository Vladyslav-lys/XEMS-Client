import {Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';
import { StubService } from '../_services/stub.service';
import { SignalRService } from '../_services/signalR.service';
import { ActivatedRoute, Router } from '@angular/router';
import { operationStatusInfo } from '../_models/operationStatusInfo';
import { AlertService } from '../_services/alert.service';
import { User } from '../_models/user';

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
	private stub:StubService,
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

    this.stub.login(this.f.username.value, this.f.password.value)
	  .then(function (operationStatus : operationStatusInfo){
      if (operationStatus.operationStatus == 1) {
        localStorage.setItem('currentUser', JSON.stringify(operationStatus.attachedObject));
		var user = JSON.parse(localStorage.currentUser);
        th.authenticationService.setAuth(true);
		th.getAccessPrifle(user);
		th.getAccessTeacher(user);
		th.getAccessStudent(user);
        th.router.navigate(['/']);
      }
      else {
        th.alertService.error(operationStatus.attachedInfo);
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
	
  getAccessPrifle(user:User)
  {
	  if(user.accessLevel == 4)
	  {
		  this.authenticationService.setAccessProfile(true);
	  }
  }
  
  getAccessTeacher(user:User)
  {
	if(user.accessLevel == 3)
	{
		this.authenticationService.setAccessTeacher(true);
	}  
  }
  
  getAccessStudent(user:User)
  {
	if(user.accessLevel == 2)
	{
		this.authenticationService.setAccessStudent(true);
	}  
  }
}