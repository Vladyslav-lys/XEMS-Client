import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../_services/teacher.service';
import { AuthenticationService } from '../_services/authentication.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { Teacher } from '../_models/teacher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';
import { NotifyService } from '../_services/notify.service';
import { Message } from '../_models/message';
import { Group } from '../_models/group';
import { AccessLevel } from '../_enums/accessLevel';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';

@Component({
  selector: 'app-teachers-control',
  templateUrl: './teachers-control.component.html',
  styleUrls: ['./teachers-control.component.css']
})
export class TeachersControlComponent implements OnInit {

  authorization: Authorization;
  messageText: string;
  notifyForm: FormGroup;

  teachers: Teacher[];
  teachers2: Teacher[];

  constructor(
    private router: Router,
    private teacherService: TeacherService,
	private authenticationService: AuthenticationService,
	//private stub:StubService,
	private serviceClient: SignalRService,
    private notifySerivce: NotifyService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void>{
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllTeachers();
    }
    else {
       var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
		    await this.getAllTeachers();
		  }
		}, 500);
    }

    this.notifyForm = this.formBuilder.group({
      messageText: [this.messageText],
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
		  authorization: i.authorization,
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

  getAccessLevel(accessLevel) {
    var s = "";

    switch (accessLevel) {
      case AccessLevel.Student:
        s = "Student";
        break;
      case AccessLevel.Teacher:
        s = "Teacher";
        break;
      case AccessLevel.Admin:
        s = "Administrator";
        break;
    }

    return s;
  }

  getActive(isActive) {
    var s = "";

    switch (isActive) {
      case true:
        s = "Active";
        break;
      case false:
        s = "Banned";
        break;
    }

    return s;
  }

  openEdit(teacher) {
    this.router.navigate(['/full-profile-teacher/:id']);
  }

  deleteTeacher(teacher) {
    var th = this;
	this.teacherService.deleteTeacher(teacher.id)
	  .then(function (operationStatus: operationStatusInfo) {
		console.log(operationStatus.attachedObject);
        if (!JSON.stringify(operationStatus.operationStatus))
          window.location.reload();
      }).catch(function(err) {
        console.log("Error while deleting the teacher");
        alert(err);
      });
  }

  openAdd() {
    this.router.navigate(['/register-teacher']);
  }

  sendNotifyAllText() {
    var th = this;

    var message: Message;
    message = new Message();
    message.senderName = this.getAccessLevel(AccessLevel.Admin);
    message.text = this.notifyForm.controls.messageText.value;
	
	this.notifySerivce.sendNotifyAllEnteredText(message)
	  .then(function (operationStatus: operationStatusInfo) {
		console.log("Message is sent:" + th.notifyForm.controls.messageText.value);
        th.messageText = "";
        th.notifyForm.controls.messageText.reset();
      }).catch(function(err) {
        console.log(err);
        alert(err);
      });
  }
}