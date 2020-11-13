import { Component, OnInit } from '@angular/core';
import { GroupService } from '../_services/group.service';
import { TeacherService } from '../_services/teacher.service';
import { SignalRService } from '../_services/signalR.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo, OperationStatus } from '../_helpers/operationStatusInfo';
import { Teacher } from '../_models/teacher';
import { Group } from '../_models/group';
import { Degree } from '../_enums/degree';
import {HubConnectionState} from '@microsoft/signalr';

@Component({
  selector: 'app-sign-up-group',
  templateUrl: './sign-up-group.component.html',
  styleUrls: ['./sign-up-group.component.css']
})
export class SignUpGroupComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  
  teachers: Teacher[];
  teachers2: Teacher[];

  constructor(
    private router: Router,
    private groupService: GroupService,
	private teacherService: TeacherService,
	//private stub:StubService,
    private formBuilder: FormBuilder,
	private serviceClient: SignalRService
  ) {
  }

  async ngOnInit(): Promise<void> {
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllTeachers()
    }
    else {
      var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
		    await this.getAllTeachers();
		  }
		}, 500);
    }
	
	this.registerForm = this.formBuilder.group({
      name: ["", Validators.required],
      curator: ["", Validators.required],
      learningStartDate: ["", Validators.required],
      learningEndDate: ["", Validators.required],
	  degree: [1],
    });
  }

  AddGroup() {
	this.submitted = true;

    if (this.registerForm.invalid && this.registerForm.controls.curator.value.length <= 0) {
      return;
    }

    this.loading = true;

    //var newGroup: Group;
    //newGroup = new Group();
    //newGroup.curator = new Teacher();
	var newGroup: any;
	newGroup = {};

    if (this.registerForm.controls.name.value != null)
      newGroup.name = this.registerForm.controls.name.value;
	if (this.registerForm.controls.curator.value != null && this.registerForm.controls.curator.value.length > 0)
	{
	  var id = this.registerForm.controls.curator.value;
	  //newGroup.curator = this.getTeacherById(id);
	  newGroup.curatorId = +id;
	}
	if (this.registerForm.controls.learningStartDate.value != null)
      newGroup.learningStartDate = this.registerForm.controls.learningStartDate.value;
    if (this.registerForm.controls.learningEndDate.value != null)
      newGroup.learningEndDate = this.registerForm.controls.learningEndDate.value;
    if (this.registerForm.controls.degree.value != null)
      newGroup.qualificationLevel = +this.registerForm.controls.degree.value;
	
    var th = this;
	this.groupService.addGroup(newGroup)
	  .then(function (operationStatus: operationStatusInfo) {
		if(operationStatus.operationStatus == OperationStatus.Done)
		{
			var message = "Group added successfully";
			console.log(message);
			console.log(operationStatus);
			alert(message);
			th.router.navigate(['/groups-control']);
		}
		else
		{
			console.log(operationStatus.attachedInfo);
			alert(operationStatus.attachedInfo);
			th.loading = false;
		}
      }).catch(function(err) {
        console.log("Error while adding new group");
	    th.loading = false;
      });
  }
  
  async getAllTeachers() {
    var th = this;
    
	await this.teacherService.getAllTeachers()
	  .then(function (operationStatus: operationStatusInfo) {
		var teachers = operationStatus.attachedObject;
        th.teachers = teachers[0];
        sessionStorage.setItem("teachers", JSON.stringify(th.teachers));
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
      });
  }
  
  getTeacherById(id)
  {
	for(let teacher of this.teachers2)
	{
		if(teacher.id == id)
			return teacher;
	}
  }

  enableBtn(): boolean {
	if (this.registerForm.controls.name.value.length > 0 && this.registerForm.controls.learningStartDate.value != null 
	  && this.registerForm.controls.learningEndDate.value != null && this.registerForm.controls.curator.value.length > 0)
      return true;
    return false;
  }
}