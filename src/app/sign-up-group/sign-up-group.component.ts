import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { SignalRService } from '../_services/signalR.service';
import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';
import { Teacher } from '../_models/teacher';
import { Group } from '../_models/group';
import { Degree } from '../_enums/degree';

@Component({
  selector: 'app-sign-up-group',
  templateUrl: './sign-up-group.component.html',
  styleUrls: ['./sign-up-group.component.css']
})
export class SignUpGroupComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  
  teachers: Teachers[];
  teachers2: Teachers[];

  constructor(
    private router: Router,
    private userService: UserService,
	private stub:StubService,
    private formBuilder: FormBuilder,
	private serviceClient: SignalRService
  ) {
  }

  async ngOnInit(): Promise<void> {
	this.registerForm = this.formBuilder.group({
      name: ["", Validators.required],
      curator: [1],
      learningStartDate: ["", Validators.required],
      learningEndDate: ["", Validators.required],
	  degree: [1],
    });
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllTeachers()
    }
    else {
      setTimeout(async () => {
		  await this.getAllTeachers()
		}, 500);
    }
  }

  AddGroup() {
	this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    var newGroup: Group;
    newGroup = new Group();
    newGroup.curator = new Teacher();

    if (this.registerForm.controls.name.value != null)
      newGroup.name = this.registerForm.controls.name.value;
	if (this.registerForm.controls.curator.value != null && this.registerForm.controls.curator.value.length > 0)
	{
	  var id = this.registerForm.controls.curator.value;
	  newGroup.curator = this.stub.getTeacherById(id);
	}
	if (this.registerForm.controls.learningStartDate.value != null)
      newGroup.learningStartDate = this.registerForm.controls.learningStartDate.value;
    if (this.registerForm.controls.learningEndDate.value != null)
      newGroup.learningEndDate = this.registerForm.controls.birthday.value;
    if (this.registerForm.controls.degree.value != null)
      newGroup.degree = this.registerForm.controls.degree.value;

    var th = this;
	  
	this.stub.addGroup(newGroup)
	  .then(function (operationStatus: operationStatusInfo) {
		var message = "Group added successfully";
        console.log(message);
        alert(message);
        th.router.navigate(['/groups-control']);
      }).catch(function(err) {
        console.log("Error while adding new group");
        alert(err);
	    th.loading = false;
      });
  }
  
  async getAllTeachers() {
    var th = this;
    
	await this.stub.getAllTeachers()
	  .then(function (operationStatus: operationStatusInfo) {
		var teachers = operationStatus.attachedObject;
        th.teachers = teachers;
        sessionStorage.setItem("teachers", JSON.stringify(teachers));
        th.teachers2 = JSON.parse(sessionStorage.teachers).map(i => ({
          idx: i,
          id: i.id,
		  firstName: i.firstName,
		  lastName: i.lastName,
		  birthday: i.birthday,
		  phone: i.phone,
		  address: i.address,
		  createTime: i.createTime,
		  modifyTime: i.modifyTime
        }));
      }).catch(function(err) {
        console.log("Error while fetching teachers");
        alert(err);
      });
  }

  enableBtn(): boolean {
	if (this.registerForm.controls.name.value.length > 0 && this.registerForm.controls.learningStartDate.value != null 
	  && this.registerForm.controls.learningEndDate.value != null && this.registerForm.controls.curator.value.length > 0)
      return true;
    return false;
  }
}