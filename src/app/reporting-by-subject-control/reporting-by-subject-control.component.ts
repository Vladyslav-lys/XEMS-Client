import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {operationStatusInfo} from '../_models/operationStatusInfo';
import {ReportingBySubject} from '../_models/reportingBySubject';
import {ReportingBySubjectAdditionalMaterials} from '../_models/reportingBySubjectAdditionalMaterials';
import {SignalRService} from '../_services/signalR.service';
import { StubService } from '../_services/stub.service';
import {HubConnectionState} from '@microsoft/signalr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reporting-by-subject-control',
  templateUrl: './reporting-by-subject-control.component.html',
  styleUrls: ['./reporting-by-subject-control.component.css']
})
export class ReportingBySubjectControlComponent implements OnInit {

  items:ReportingBySubjectAdditionalMaterials[];
  items2:ReportingBySubjectAdditionalMaterials[];
  
	constructor(
    private serviceClient: SignalRService,
    private authenticateService: AuthenticationService,
	private stub:StubService,
    private router: Router
	) {
  }

  async ngOnInit(): Promise<void> {
    if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getReporting();
    }
    else {
      setTimeout(async () => {
		  await this.getReporting()
		}, 500);
    }
  }
  
  getReportingBySubjectType(reportingBySubjectType)
  {
	switch(reportingBySubjectType)
	{
		case reportingBySubjectType.Module:
			return "Module";
			break;
		case reportingBySubjectType.CourseTask:
			return "Course Task";
			break;
		case reportingBySubjectType.Exam:
			return "Exam";
			break;
		case reportingBySubjectType.Credit:
			return "Credit";
			break;
		case reportingBySubjectType.DifferentialCredit:
			return "Differential Credit";
			break;
	}		
  }
  
  getIsCompleted(isCompleted)
  {
	switch(isCompleted)
	{
		case true:
			return "Completed";
			break;
		case false:
			return "Not completed";
			break;
	}		
  }

  async getReporting() {
    var th = this;
    
    await this.stub.getAllReportingBySubjectAdditionalMaterialss()
	 .then(function (operationStatus: operationStatusInfo){
      if (operationStatus.operationStatus == operationStatus.Done) {
        var reportings = operationStatus.attachedObject;
        th.items = reportings;
        sessionStorage.setItem("reportingBySubjectAdditionalMaterials", JSON.stringify(reportings));
		th.items2 = JSON.parse(sessionStorage.reportingBySubjectAdditionalMaterials).map(i => ({ 
			idx: i, 
			id: i.id, 
			teacher: i.teacher, 
			student: i.student, 
			discipline: i.discipline, 
			title: i.title,
			description: i.description, 
			reporting: i.reporting, 
			dueDate: i.dueDate, 
			realDueDate: i.realDueDate, 
			isCompleted: i.isCompleted, 
			grade: i.grade, 
			material: i.material}));
        }
        else {
          console.log(operationStatus.attachedInfo);
          sessionStorage.setItem("reportingBySubjectAdditionalMaterials", JSON.stringify(""));
          alert(operationStatus.attachedInfo);
        }
      }).catch(function(err) {
        console.log("Error loading reportingBySubjectAdditionalMaterials");
        alert(err);
      });
  }
}