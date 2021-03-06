import { Component, OnInit } from '@angular/core';
import { DisciplineService } from '../_services/discipline.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { Discipline } from '../_models/discipline';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';
import { NotifyService } from '../_services/notify.service';
import { Message } from '../_models/message';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';

@Component({
  selector: 'app-disciplines-control',
  templateUrl: './disciplines-control.component.html',
  styleUrls: ['./disciplines-control.component.css']
})
export class DisciplinesControlComponent implements OnInit {

  disciplines: Discipline[];
  disciplines2: Discipline[];

  constructor(
    private router: Router,
    private disciplineService: DisciplineService,
	//private stub:StubService,
	private serviceClient: SignalRService,
    private notifySerivce: NotifyService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void>{
	  
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllDisciplines()
    }
    else {
      var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
		    await this.getAllDisciplines();
		  }
		}, 500);
    }
  }

  async getAllDisciplines() {
    var th = this;
    
	await this.disciplineService.getAllDisciplines()
	  .then(function (operationStatus: operationStatusInfo) {
		var disciplines = operationStatus.attachedObject;
        th.disciplines = disciplines[0];
        sessionStorage.setItem("disciplines", JSON.stringify(th.disciplines));
        th.disciplines2 = JSON.parse(sessionStorage.disciplines).map(i => ({
          idx: i,
          id: i.id,
		  title: i.title
        }));
      }).catch(function(err) {
        console.log("Error while fetching disciplines");
      });
  }

  deleteDiscipline(discipline) {
    var th = this;
	this.disciplineService.deleteDiscipline(discipline.id)
	  .then(function (operationStatus: operationStatusInfo) {
		console.log(operationStatus.attachedObject);
        if (!JSON.stringify(operationStatus.operationStatus))
          window.location.reload();
      }).catch(function(err) {
        console.log("Error while deleting the discipline");
      });
  }

  openAdd() {
    this.router.navigate(['/register-discipline']);
  }
}