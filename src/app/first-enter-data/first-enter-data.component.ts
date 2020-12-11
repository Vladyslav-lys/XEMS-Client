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
  selector: 'app-first-enter-data',
  templateUrl: './first-enter-data.component.html',
  styleUrls: ['./first-enter-data.component.css']
})
export class FirstEnterDataComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  tempUser;

  constructor(
    private router: Router,
	private authenticationService: AuthenticationService,
	private serviceClient: SignalRService,
	private alertService: AlertService,
	//private stub:StubService,
    private formBuilder: FormBuilder
  ) {
  }
  
  ngOnInit(): void {
	this.tempUser = JSON.parse(sessionStorage.getItem("tempUser"));
	this.tempUser = this.tempUser;
    this.tempUser.birthday = new Date(this.tempUser.birthday);
	
    this.registerForm = this.formBuilder.group({
      login: [this.tempUser.login, Validators.required],
      password: ["", Validators.required],
	  confirmPassword: ["", Validators.required],
      lastName: [this.tempUser.lastName, Validators.required],
      firstName: [this.tempUser.firstName, Validators.required],
	  fatherName: [this.tempUser.fatherName, Validators.required],
      birthday: [this.tempUser.birthday, Validators.required],
	  phone: [this.tempUser.phone, Validators.required],
	  address: [this.tempUser.address, Validators.required],
	  department: [this.tempUser.department, Validators.required]
    });
  }

  AddUser() {

    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
	
	var newUser: any;
	newUser = {};
	
	newUser.guid = this.tempUser.guid;
	if (this.registerForm.controls.login.value != null)
		newUser.login = this.registerForm.controls.login.value;
    if (this.registerForm.controls.password.value != null)
		newUser.password = this.registerForm.controls.password.value;
    if (this.registerForm.controls.lastName.value != null)
		newUser.lastName = this.registerForm.controls.lastName.value;
    if (this.registerForm.controls.firstName.value != null)
		newUser.firstName = this.registerForm.controls.firstName.value;
	if (this.registerForm.controls.fatherName.value != null)
		newUser.fatherName = this.registerForm.controls.fatherName.value;
	if (this.registerForm.controls.department.value != null)
		newUser.department = this.registerForm.controls.department.value;
	if (this.registerForm.controls.phone.value != null)
		newUser.phone = this.registerForm.controls.phone.value;
	if (this.registerForm.controls.address.value != null)
		newUser.address = this.registerForm.controls.address.value;
    if (this.registerForm.controls.birthday.value != null)
		newUser.birthday = this.registerForm.controls.birthday.value;
	newUser.accessLevel = this.tempUser.accessLevel;
	
	if(this.registerForm.controls.password.value != this.registerForm.controls.confirmPassword.value)
	{
		this.loading = false;
		return;
	}
	
    var th = this;
	this.authenticationService.registerAzureUser(newUser)
	  .then(function (operationStatus: operationStatusInfo) {
		if(operationStatus.operationStatus == OperationStatus.Done)
		{
			var message = "User added successfully";
			console.log(message);
			console.log(operationStatus.attachedObject);
			var th1 = th;
			th.authenticationService.loginViaTeams(newUser.guid)
			.then(function (operationStatusInfo : operationStatusInfo){
				if (operationStatusInfo.operationStatus == OperationStatus.Done) {
					var auth = operationStatus.attachedObject;
					var currentDate = new Date();
					auth[4] = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDay() + 8);
					localStorage.setItem('currentAuthentication', JSON.stringify(auth));
					var authentication = JSON.parse(localStorage.currentAuthentication);
					th1.serviceClient.makeFullConnection(authentication);
					th1.authenticationService.setAuth(true);
					th1.getAccessAdmin(authentication);
					th1.getAccessTeacher(authentication);
					th1.getAccessStudent(authentication);
					th1.router.navigate(['/']); 
				}
				else {
					th1.alertService.error(operationStatusInfo.attachedInfo);
					th1.loading = false;
				}
			}).catch(err => {
				console.log(err);
				th.alertService.error(err.toString());
				th.loading = false;
			});  
		}
		else
		{
			console.log(operationStatus.attachedInfo);
			alert(operationStatus.attachedInfo);
			th.loading = false;
		}
      }).catch(function(err) {
        console.log("Error while adding new user");
		alert(err);
	    th.loading = false;
      });
  }
  
  enableText(text)
  {
	if(text.length > 0)
		return false;
	return true;
  }

  enableBtn(): boolean {
    if (this.registerForm.controls.login.value.length > 0 && this.registerForm.controls.password.value.length > 0
	  && this.registerForm.controls.confirmPassword.value.length > 0 && this.registerForm.controls.lastName.value.length > 0
	  && this.registerForm.controls.confirmPassword.value == this.registerForm.controls.password.value
	  && this.registerForm.controls.firstName.value.length > 0 && this.registerForm.controls.fatherName.value.length > 0 
	  && this.registerForm.controls.phone.value.length > 0 && this.registerForm.controls.birthday.value != null 
	  && this.registerForm.controls.address.value.length > 0 && this.registerForm.controls.department.value.length > 0)
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