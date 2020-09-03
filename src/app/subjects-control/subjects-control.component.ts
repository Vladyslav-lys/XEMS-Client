import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { Subject } from '../_models/subject';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_models/operationStatusInfo';
import { NotifyService } from '../_services/notify.service';
import { Message } from '../_models/message';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';

@Component({
  selector: 'app-subjects-control',
  templateUrl: './subjects-control.component.html',
  styleUrls: ['./subjects-control.component.css']
})
export class SubjectsControlComponent implements OnInit {

  user: User;

  subjects: Subject[];

  subjects2: Subject[];

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
	  await this.getAllSubjects()
    }
    else {
      setTimeout(async () => {
		  await this.getAllSubjects()
		}, 500);
    }
  }

  async getAllSubjects() {
    var th = this;
    
	await this.stub.getAllSubjects()
	  .then(function (operationStatus: operationStatusInfo) {
		var subjects = operationStatus.attachedObject;
        th.subjects = subjects;
        sessionStorage.setItem("subjects", JSON.stringify(subjects));
        th.subjects2 = JSON.parse(sessionStorage.subjects).map(i => ({
          idx: i,
          id: i.id,
		  name: i.name
        }));
      }).catch(function(err) {
        console.log("Error while fetching subjects");
        alert(err);
      });
  }

  openEdit(subject) {
    this.router.navigate(['/full-profile-subject/:id']);
  }

  deleteSubject(subject) {
    var th = this;
	this.stub.deleteSubject(subject.id)
	  .then(function (operationStatus: operationStatusInfo) {
		console.log(operationStatus.attachedObject);
        if (!JSON.stringify(operationStatus.operationStatus))
          window.location.reload();
      }).catch(function(err) {
        console.log("Error while deleting the subject");
        alert(err);
      });
  }

  openAdd() {
    this.router.navigate(['/register-subject']);
  }
}