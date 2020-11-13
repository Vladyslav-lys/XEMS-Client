import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../_services/teacher.service';
import { AuthenticationService } from '../_services/authentication.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo, OperationStatus } from '../_helpers/operationStatusInfo';
import { Teacher } from '../_models/teacher';
import { Group } from '../_models/group';
import { AccessLevel } from '../_enums/accessLevel';

@Component({
  selector: 'app-sign-up-teacher',
  templateUrl: './sign-up-teacher.component.html',
  styleUrls: ['./sign-up-teacher.component.css']
})
export class SignUpTeacherComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private router: Router,
    private teacherService: TeacherService,
	private authenticationService: AuthenticationService,
	//private stub:StubService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    //this.user.account.birthday = new Date(this.user.account.birthday);

    this.registerForm = this.formBuilder.group({
      login: ["", Validators.required],
      password: ["", Validators.required],
      lastName: ["", Validators.required],
      firstName: ["", Validators.required],
      birthday: ["", Validators.required],
	  phone: ["", Validators.required],
	  address: ["", Validators.required],
      active: [true]
    });
  }

  AddProfile() {

    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
	
	var newAuthorization: Authorization;
	newAuthorization = new Authorization();
    //var newTeacher: Teacher;
    //newTeacher = new Teacher();
	var newTeacher: any;
    newTeacher = {};
	
    if (this.registerForm.controls.login.value != null)
      //newAuthorization.login = this.registerForm.controls.login.value;
		newTeacher.login = this.registerForm.controls.login.value;
    if (this.registerForm.controls.password.value != null)
      //newAuthorization.password = this.registerForm.controls.password.value;
		newTeacher.password = this.registerForm.controls.password.value;
	//if (this.registerForm.controls.active.value != null)
      //newAuthorization.isActive = this.registerForm.controls.active.value;
    //newAuthorization.accessLevel = AccessLevel.Teacher;
	
	//newTeacher.authorization = newAuthorization;
    if (this.registerForm.controls.lastName.value != null)
      newTeacher.lastName = this.registerForm.controls.lastName.value;
    if (this.registerForm.controls.firstName.value != null)
      newTeacher.firstName = this.registerForm.controls.firstName.value;
    if (this.registerForm.controls.birthday.value != null)
      newTeacher.birthday = this.registerForm.controls.birthday.value;
    if (this.registerForm.controls.phone.value != null)
      newTeacher.phone = this.registerForm.controls.phone.value;
    if (this.registerForm.controls.address.value != null)
      newTeacher.address = this.registerForm.controls.address.value;
	//newTeacher.createTime = new Date();
    //newTeacher.modifyTime = new Date();

    var th = this;
	this.teacherService.addTeacher(newTeacher)
	  .then(function (operationStatus: operationStatusInfo) {
		if(operationStatus.operationStatus == OperationStatus.Done)
		{
			var message = "Teacher added successfully";
			console.log(message);
			alert(message);
			th.router.navigate(['/teachers-control']);
		}
		else
		{
			console.log(operationStatus.attachedInfo);
			alert(operationStatus.attachedInfo);
			th.loading = false;
		}
      }).catch(function(err) {
        console.log("Error while adding new teacher");
		alert(err);
	    th.loading = false;
      });
  }

  enableBtn(): boolean {
    if (this.registerForm.controls.login.value.length > 0 && this.registerForm.controls.password.value.length > 0
      && this.registerForm.controls.lastName.value.length > 0 && this.registerForm.controls.firstName.value.length > 0
      && this.registerForm.controls.phone.value.length > 0 && this.registerForm.controls.birthday.value != null 
	  && this.registerForm.controls.address.value.length > 0)
      return true;
    return false;
  }
}