import { Component, OnInit } from '@angular/core';
import { StudentService } from '../_services/student.service';
import { AuthenticationService } from '../_services/authentication.service';
import { GroupService } from '../_services/group.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';
import { Student } from '../_models/student';
import { Group } from '../_models/group';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';

@Component({
  selector: 'app-sign-up-student',
  templateUrl: './sign-up-student.component.html',
  styleUrls: ['./sign-up-student.component.css']
})
export class SignUpStudentComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  
  groups: Group[];
  groups2: Group[];

  constructor(
    private router: Router,
    private studentService: StudentService,
	private groupService: GroupService,
	private authenticationService: AuthenticationService,
	private serviceClient: SignalRService,
	//private stub:StubService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void> {
    //this.user.account.birthday = new Date(this.user.account.birthday);
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllGroups();
    }
    else {
      setTimeout(async () => {
		  await this.getAllGroups();
		}, 500);
    }
	
    this.registerForm = this.formBuilder.group({
      login: ["", Validators.required],
      password: ["", Validators.required],
      lastName: ["", Validators.required],
      firstName: ["", Validators.required],
      birthday: ["", Validators.required],
	  phone: ["", Validators.required],
	  address: ["", Validators.required],
	  group: [1],
      accessLevel: [1],
      active: [true]
    });
  }
  
  async getAllGroups() {
    var th = this;
    
	await this.groupService.getAllGroups()
	  .then(function (operationStatus: operationStatusInfo) {
		var groups = operationStatus.attachedObject;
        th.groups = groups;
        sessionStorage.setItem("groups", JSON.stringify(groups));
        th.groups2 = JSON.parse(sessionStorage.groups).map(i => ({
          idx: i,
          id: i.id,
		  name: i.name,
		  curator: i.curator,
		  learningStartDate: i.learningStartDate,
		  learningEndDate: i.learningEndDate,
		  degree: i.degree
        }));
      }).catch(function(err) {
        console.log("Error while fetching groups");
        alert(err);
      });
  }

  AddStudent() {

    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

	var newAuthorization: Authorization;
	newAuthorization = new Authorization();
	
    var newStudent: Student;
    newStudent = new Student();
	
	if (this.registerForm.controls.login.value != null)
      newAuthorization.login = this.registerForm.controls.login.value;
    if (this.registerForm.controls.password.value != null)
      newAuthorization.password = this.registerForm.controls.password.value;
	if (this.registerForm.controls.accessLevel.value != null)
      newAuthorization.accessLevel = this.registerForm.controls.accessLevel.value;
    if (this.registerForm.controls.active.value != null)
      newAuthorization.isActive = this.registerForm.controls.active.value;

    if (this.registerForm.controls.lastName.value != null)
      newStudent.lastName = this.registerForm.controls.lastName.value;
    if (this.registerForm.controls.firstName.value != null)
      newStudent.firstName = this.registerForm.controls.firstName.value;
    if (this.registerForm.controls.birthday.value != null)
      newStudent.birthday = this.registerForm.controls.birthday.value;
    if (this.registerForm.controls.phone.value != null)
      newStudent.phone = this.registerForm.controls.phone.value;
    if (this.registerForm.controls.address.value != null)
      newStudent.address = this.registerForm.controls.address.value;
    if (this.registerForm.controls.group.value != null)
	{
	  var id = this.registerForm.controls.group.value;
	  newStudent.group = this.getGroupById(id);
	}
    newStudent.createTime = new Date();
    newStudent.modifyTime = new Date();

    var th = this;
	this.authenticationService.addAuthorization(newAuthorization)
	  .then(function (operationStatus: operationStatusInfo) {
		var message = "Authorization added successfully";
        console.log(message);
        alert(message);
      }).catch(function(err) {
        console.log("Error while adding new authorization");
        alert(err);
	    th.loading = false;
      });
	this.studentService.addStudent(newStudent)
	  .then(function (operationStatus: operationStatusInfo) {
		var message = "Student added successfully";
        console.log(message);
        alert(message);
        th.router.navigate(['/students-control']);
      }).catch(function(err) {
        console.log("Error while adding new student");
        alert(err);
	    th.loading = false;
      });
  }
  
  getGroupById(id)
  {
	for(let group of this.groups2)
	{
		if(group.id == id)
			return group;
	}
  }

  enableBtn(): boolean {
    if (this.registerForm.controls.login.value.length > 0 && this.registerForm.controls.password.value.length > 0
      && this.registerForm.controls.lastName.value.length > 0 && this.registerForm.controls.firstName.value.length > 0
      && this.registerForm.controls.phone.value.length > 0 && this.registerForm.controls.birthday.value != null 
	  && this.registerForm.controls.address.value.length > 0 && this.registerForm.controls.group.value.length > 0)
      return true;
    return false;
  }
}