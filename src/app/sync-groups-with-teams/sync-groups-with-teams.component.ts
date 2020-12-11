import { Component, OnInit } from '@angular/core';
import { GroupService } from '../_services/group.service';
import { TeacherService } from '../_services/teacher.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { Group } from '../_models/group';
import { Teacher } from '../_models/teacher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo, OperationStatus } from '../_helpers/operationStatusInfo';
import { NotifyService } from '../_services/notify.service';
import { Message } from '../_models/message';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';
import { Degree } from '../_enums/degree';

@Component({
  selector: 'app-sync-groups-with-teams',
  templateUrl: './sync-groups-with-teams.component.html',
  styleUrls: ['./sync-groups-with-teams.component.css']
})
export class SyncGroupsWithTeamsComponent implements OnInit {

  authorization: Authorization;
  groups: any;
  curGroups: any;
  teachers: Teacher[];
  teachers2: Teacher[];
  curPage: number;
  maxPage: number;
  minPage: number;
  selectedCount:number;
  
  loading = false;

  constructor(
    private router: Router,
    private groupService: GroupService,
	private teacherService: TeacherService,
	//private stub:StubService,
	private serviceClient: SignalRService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void>{
	this.groups = [];
	this.curGroups = [];
	this.minPage = 1;
	this.curPage = this.minPage;
	this.selectedCount = 5;
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
		await this.getAllGroups();
		await this.getAllTeachers();
    }
    else {
      var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			clearInterval(interval);
		    await this.getAllGroups();
			await this.getAllTeachers();
		  }
		}, 500);
    }
  }
  
  async getAllGroups() {
    var th = this;
	await this.groupService.syncGroupsWithTeams()
	  .then(function (operationStatus: operationStatusInfo) {
		var groups = operationStatus.attachedObject;
		th.groups = groups[0];
		th.maxPage = Math.ceil(th.groups.length/th.selectedCount);
		th.setCurGroups();
      }).catch(function(err) {
        console.log("Error while fetching groups");
        alert(err);
      });
  }
  
  async getAllTeachers() {
    var th = this;
    
	await this.teacherService.getAllTeachers()
	  .then(function (operationStatus: operationStatusInfo) {
		var teachers = operationStatus.attachedObject;
        th.teachers = teachers[0];
      }).catch(function(err) {
        console.log("Error while fetching teachers");
      });
  }
  
  getDegree(degree) {
    var s = "";

    switch (degree) {
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
  
  setCurGroups()
  {
	var curCount = this.curPage == this.maxPage ? this.groups.length-(this.maxPage-1)*this.selectedCount : this.selectedCount;
	this.curGroups = [];
	
	for(var i=0; i<curCount; i++)
	{
		this.curGroups[i] = this.groups[i+(this.curPage-1)*curCount];
	}
  }

  sync() {
	  
	var groupsData:any;
	groupsData = [];
	
	for(var i=0; i<this.curGroups.length; i++)
	{
		if(this.curGroups[i].name.length != 0 && this.curGroups[i].curatorId != null
			&& this.curGroups[i].learningStartDate != null && this.curGroups[i].learningEndDate != null
			&& this.curGroups[i].qualificationLevel != null)
		{
			var curGroup = this.curGroups[i];
			curGroup.qualificationLevel = +this.curGroups[i].qualificationLevel;
			groupsData.push(curGroup);
		}
	}
	
	if(groupsData.length == 0)
	{
		alert("Please, fill almost one group!");
		return;
	}
	
	this.loading = true;
	console.log(groupsData);
	
    var th = this;
	this.groupService.createGroupsList(groupsData)
	  .then(async function (operationStatus: operationStatusInfo) {
		if(operationStatus.operationStatus == OperationStatus.Done)
		{
			alert("Groups synchronized successfully");
			th.removeElements();
			th.loading = false;
		}
		else
		{
			console.log(operationStatus.attachedInfo);
			alert(operationStatus.attachedInfo);
			th.loading = false;
		}
      }).catch(function(err) {
        console.log("Error while fetching groups");
        alert(err);
		th.loading = false;
      });
  }
  
  removeElements()
  {
	for(var i=0; i<this.curGroups.length; i++)
	{
		if(this.curGroups[i].name.length != 0 && this.curGroups[i].curatorId != null
			&& this.curGroups[i].learningStartDate != null && this.curGroups[i].learningEndDate != null
			&& this.curGroups[i].qualificationLevel != null)
		{
			this.groups.splice(i+(this.curPage-1)*this.curGroups.length,1);
			this.setCurGroups();
		}
	}  
  }
  
  next() {
	if(this.curPage < this.maxPage)
	{
		this.curPage++;
		this.setCurGroups();
	}
  }
  
  prev() {
	if(this.curPage > this.minPage)
	{
		this.curPage--;
		this.setCurGroups();
	}
  }
}