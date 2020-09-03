import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_models/operationStatusInfo';
import { NotifyService } from '../_services/notify.service';
import { Message } from '../_models/message';
import { Group } from '../_models/group';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';

@Component({
  selector: 'app-students-control',
  templateUrl: './students-control.component.html',
  styleUrls: ['./students-control.component.css']
})
export class StudentsControlComponent implements OnInit {

  user: User;
  messageText: string;
  notifyForm: FormGroup;

  students: User[];
  students2: User[];
  
  groups: Group[];
  groups2: Group[];

  constructor(
    private router: Router,
    private userService: UserService,
	private stub:StubService,
	private serviceClient: SignalRService,
    private notifySerivce: NotifyService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void>{
    this.user = JSON.parse(localStorage.currentUser);
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllGroups();
	  await this.getAllStudents();
    }
    else {
      setTimeout(async () => {
		  await this.getAllGroups();
		  await this.getAllStudents();
		}, 500);
    }
	
	this.notifyForm = this.formBuilder.group({
      messageText: [this.messageText],
    });
  }
  
  async getAllGroups()
  {
	var th = this;
	await this.stub.getAllGroups()
	  .then(function (operationStatus: operationStatusInfo) {
		var groups = operationStatus.attachedObject;
        th.groups = groups;
        sessionStorage.setItem("groups", JSON.stringify(groups));
        th.groups2 = JSON.parse(sessionStorage.groups).map(i => ({
          idx: i,
          id: i.id,
          name: i.name
        }));
      }).catch(function(err) {
        console.log("Error while fetching groups");
        alert(err);
      });  
  }

  async getAllStudents() {
    var th = this;
    
	await this.stub.getAllStudents()
	  .then(function (operationStatus: operationStatusInfo) {
		var students = operationStatus.attachedObject;
        for (let student of students) {
			var fileInBase64 = student.account.photo;
			if(fileInBase64 != null)
			{
				var splitted = fileInBase64.split(",", 2);
				if(splitted[0] != 'data:image/png;base64')
					student.account.photo = 'data:image/png;base64,' + student.account.photo;
			}
        }
        th.students = students;
        sessionStorage.setItem("students", JSON.stringify(students));
        th.students2 = JSON.parse(sessionStorage.students).map(i => ({
          idx: i,
          id: i.id,
          account: i.account,
          login: i.login,
          password: i.password,
          isActive: i.isActive,
          accessLevel:i.accessLevel
        }));
      }).catch(function(err) {
        console.log("Error while fetching students");
        alert(err);
      });
  }

  getAccessLevel(accessLevel) {
    var s = "";

    switch (accessLevel) {
      case 1:
        s = "Analitic";
        break;
      case 2:
        s = "Student";
        break;
      case 3:
        s = "Teacher";
        break;
      case 4:
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

  openEdit(student) {
    this.router.navigate(['/full-profile-student/:id']);
  }

  deleteStudent(student) {
    var th = this;
	this.stub.deleteStudent(student.id)
	  .then(function (operationStatus: operationStatusInfo) {
		console.log(operationStatus.attachedObject);
        if (!JSON.stringify(operationStatus.operationStatus))
          window.location.reload();
      }).catch(function(err) {
        console.log("Error while deleting the student");
        alert(err);
      });
  }

  openAdd() {
    this.router.navigate(['/register-student']);
  }
  
  sendNotifyAllText() {
    var th = this;

    var message: Message;
    message = new Message();
    message.senderName = this.getAccessLevel(this.user.accessLevel);
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