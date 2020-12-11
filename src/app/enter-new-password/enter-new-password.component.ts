import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo, OperationStatus } from '../_helpers/operationStatusInfo';
import { AccessLevel } from '../_enums/accessLevel';
import { AlertService } from '../_services/alert.service';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-enter-new-password',
  templateUrl: './enter-new-password.component.html',
  styleUrls: ['./enter-new-password.component.css']
})
export class EnterNewPasswordComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private router: Router,
	private authenticationService: AuthenticationService,
	private serviceClient: SignalRService,
	private alertService: AlertService,
	//private stub:StubService,
    private formBuilder: FormBuilder
  ) {
  }
  
  async ngOnInit(): Promise<void> {
    this.registerForm = this.formBuilder.group({
      password: ["", Validators.required],
	  confirmPassword: ["", Validators.required]
    });
  }

  SendNewPassword() {

    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
	
	var newPassword: any;
	newPassword = {};
	
	newPassword.id = id;
    if (this.registerForm.controls.password.value != null)
		newPassword.password = this.registerForm.controls.password.value;
	
	if(this.registerForm.controls.password.value != this.registerForm.controls.confirmPassword.value)
	{
		th.loading = false;
		return;
	}
	
    var th = this;
	this.authenticationService.sendNewPassword(newPassword)
	  .then(function (operationStatus: operationStatusInfo) {
		if(operationStatus.operationStatus == OperationStatus.Done)
		{
			var message = "Password updated successfully";
			console.log(message);
			
			var auth = operationStatus.attachedObject;
			var currentDate = new Date();
			auth[4] = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay() + 8);
			localStorage.setItem('currentAuthentication', JSON.stringify(auth));
			var authentication = JSON.parse(localStorage.currentAuthentication);
			th.serviceClient.makeFullConnection(authentication);
			th.authenticationService.setAuth(true);
			th.getAccessAdmin(authentication);
			th.getAccessTeacher(authentication);
			th.getAccessStudent(authentication);
			th.router.navigate(['/']); 
		}
		else
		{
			console.log(operationStatus.attachedInfo);
			th.alertService.error(operationStatusInfo.attachedInfo);
			th.loading = false;
		}
      }).catch(function(err) {
        console.log("Error while adding new user");
		alert(err);
	    th.loading = false;
      });
  }

  enableBtn(): boolean {
    if (this.registerForm.controls.password.value.length > 0 && this.registerForm.controls.confirmPassword.value.length > 0
	  && this.registerForm.controls.confirmPassword.value == this.registerForm.controls.password.value)
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