import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {ReportingBySubjectService} from '../_services/reportingBySubject.service';
import {TeacherService} from '../_services/teacher.service';
import {operationStatusInfo, OperationStatus} from '../_helpers/operationStatusInfo';
import {ReportingBySubject} from '../_models/reportingBySubject';
import {ReportingBySubjectAdditionalMaterials} from '../_models/reportingBySubjectAdditionalMaterials';
import {Teacher} from '../_models/teacher';
import {SignalRService} from '../_services/signalR.service';
//import { StubService } from '../_services/stub.service';
import {HubConnectionState} from '@microsoft/signalr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-reporting-by-subject-control',
  templateUrl: './reporting-by-subject-control.component.html',
  styleUrls: ['./reporting-by-subject-control.component.css']
})
export class ReportingBySubjectControlComponent implements OnInit {

  //items:ReportingBySubjectAdditionalMaterials[];
  //items2:ReportingBySubjectAdditionalMaterials[];
  items:ReportingBySubject[];
  items2:ReportingBySubject[];
  
	constructor(
    private serviceClient: SignalRService,
    private authenticateService: AuthenticationService,
	private reportingBySubjectService: ReportingBySubjectService,
	private teacherService: TeacherService,
	//private stub:StubService,
    private router: Router
	) {
  }

  async ngOnInit(): Promise<void> {
    if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
		await this.getReporting();
    }
    else {
		var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
		    await this.getReporting();
		  }
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
		default:
			return "None";
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
    var auth = JSON.parse(localStorage.currentAuthentication);
	var teacher;
    await this.teacherService.getTeacherByAuthId(auth[0])
	  .then(function (operationStatus: operationStatusInfo) {
		var teacher1 = operationStatus.attachedObject;
		teacher = teacher1[0];
      }).catch(function(err) {
        console.log("Error while fetching teacher");
        alert(err);
      });
	  
    await this.reportingBySubjectService.getReportingBySubjectsByTeacherId(teacher.id)
	 .then(function (operationStatus: operationStatusInfo){
      if (operationStatus.operationStatus == OperationStatus.Done) {
        var reportings = operationStatus.attachedObject;
        th.items = reportings[0];
        sessionStorage.setItem("reportingBySubject", JSON.stringify(th.items));
		th.items2 = JSON.parse(sessionStorage.reportingBySubject).map(i => ({ 
			idx: i, 
			id: i.id, 
			//teacher: i.teacher, 
			//student: i.student, 
			discipline: i.discipline, 
			title: i.title,
			description: i.description, 
			reporting: i.reporting, 
			dueDate: i.dueDate, 
			//realDueDate: i.realDueDate, 
			//isCompleted: i.isCompleted, 
			//grade: i.grade, 
			/*material: i.material*/}));
        }
        else {
          console.log(operationStatus.attachedInfo);
          sessionStorage.setItem("reportingBySubject", JSON.stringify(""));
          alert(operationStatus.attachedInfo);
        }
      }).catch(function(err) {
        console.log("Error loading reportingBySubjectAdditionalMaterials");
		console.log(err);
        alert(err);
      });
  }
}