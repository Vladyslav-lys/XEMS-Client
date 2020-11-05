import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { Group } from '../_models/group';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';
import { NotifyService } from '../_services/notify.service';
import { Message } from '../_models/message';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';
import { Degree } from '../_enums/degree';

@Component({
  selector: 'app-groups-control',
  templateUrl: './groups-control.component.html',
  styleUrls: ['./groups-control.component.css']
})
export class GroupsControlComponent implements OnInit {

  authorization: Authorization;

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
    this.authorization = JSON.parse(localStorage.currentAuthorization);
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllGroups()
    }
    else {
      setTimeout(async () => {
		  await this.getAllGroups()
		}, 500);
    }
  }

  async getAllGroups() {
    var th = this;
    
	await this.stub.getAllGroups()
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
  
  getDegree(degree) {
    var s = "";

    switch (degree) {
      case Degree.Specialist:
        s = "Specialist";
        break;
      case Degree.Bachelor:
        s = "Bachelor";
        break;
      case Degree.Master:
        s = "Master";
        break;
      case Degree.DoctorOfPhilosophy:
        s = "DoctorOfPhilosophy";
        break;
	  case Degree.DoctorOfScience:
        s = "DoctorOfScience";
        break;
    }

    return s;
  }

  openEdit(group) {
    this.router.navigate(['/full-profile-group/:id']);
  }

  deleteGroup(group) {
    var th = this;
	this.stub.deleteGroup(group.id)
	  .then(function (operationStatus: operationStatusInfo) {
		console.log(operationStatus.attachedObject);
        if (!JSON.stringify(operationStatus.operationStatus))
          window.location.reload();
      }).catch(function(err) {
        console.log("Error while deleting the group");
        alert(err);
      });
  }

  openAdd() {
    this.router.navigate(['/register-group']);
  }
}