import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_models/operationStatusInfo';
import { NotifyService } from '../_services/notify.service';
import { Message } from '../_models/message';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  user: User;
  messageText: string;
  notifyForm: FormGroup;

  users: User[];

  users2: User[];

  constructor(
    private router: Router,
    private userService: UserService,
	private stub:StubService,
	private serviceClient: SignalRService,
    private notifySerivce: NotifyService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void>  {
	this.user = JSON.parse(localStorage.currentUser);
	  
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllUsers();
    }
    else {
      setTimeout(async () => {
		  await this.getAllUsers();
		}, 500);
    };
	
    this.notifyForm = this.formBuilder.group({
      messageText: [this.messageText],
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

  async getAllUsers() {
    var th = this;
    
	await this.stub.getAllStudents()
	  .then(function (operationStatus: operationStatusInfo) {
		var users = operationStatus.attachedObject;
        for (let user of users) {
			var fileInBase64 = user.account.photo;
			var splitted = fileInBase64.split(",", 2);
			if(splitted[0] != 'data:image/png;base64')
				user.account.photo = 'data:image/png;base64,' + user.account.photo;
        }
        th.users = users;
        console.log(th.users);
        sessionStorage.setItem("students", JSON.stringify(users));
        th.users2 = JSON.parse(sessionStorage.students).map(i => ({
          idx: i,
          id: i.id,
          account: i.account
        }));
      }).catch(function(err) {
        console.log("Error while adding new user");
        alert(err);
      });
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
  
  sendNotifyOneText(user, txt) {
    var th = this;

    var message: Message;
    message = new Message();
    message.senderName = this.getAccessLevel(this.user.accessLevel);
    message.text = txt;
	
	this.notifySerivce.sendNotifyOneText(user.id, message)
	  .then(function (operationStatus: operationStatusInfo) {
		console.log("Message is sent:" + txt);
        th.messageText = "";
        th.notifyForm.controls.messageText.reset();
      }).catch(function(err) {
        console.log(err);
        alert(err);
      });
  }
}