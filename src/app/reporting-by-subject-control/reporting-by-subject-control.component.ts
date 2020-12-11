import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {ReportingBySubjectService} from '../_services/reportingBySubject.service';
import {TeacherService} from '../_services/teacher.service';
import {WorkingPlanService} from '../_services/workingPlan.service';
import {operationStatusInfo, OperationStatus} from '../_helpers/operationStatusInfo';
import {ReportingBySubject} from '../_models/reportingBySubject';
import {ReportingBySubjectAdditionalMaterials} from '../_models/reportingBySubjectAdditionalMaterials';
import {ReportingPlanByModules} from '../_models/reportingPlanByModules';
import {Teacher} from '../_models/teacher';
import {SignalRService} from '../_services/signalR.service';
//import { StubService } from '../_services/stub.service';
import {HubConnectionState} from '@microsoft/signalr';
import {Router} from '@angular/router';
import {Chart} from 'node_modules/chart.js';

@Component({
  selector: 'app-reporting-by-subject-control',
  templateUrl: './reporting-by-subject-control.component.html',
  styleUrls: ['./reporting-by-subject-control.component.css']
})
export class ReportingBySubjectControlComponent implements OnInit {

  //items:ReportingBySubjectAdditionalMaterials[];
  //items2:ReportingBySubjectAdditionalMaterials[];
  items:ReportingPlanByModules[];
  items2:ReportingPlanByModules[];
  teacher:Teacher;
  
	constructor(
    private serviceClient: SignalRService,
    private authenticateService: AuthenticationService,
	private reportingBySubjectService: ReportingBySubjectService,
	private teacherService: TeacherService,
	private workingPlanService: WorkingPlanService,
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
  
  showCharts(dueDate, realDueDate)
  {
	var myChart = new Chart("dateComparison", {
		type: 'bar',
		data: {
			labels: ['Due date', 'Real due date'],
			datasets: [{
				label: 'Due date comparison',
				data: [
					{t:new Date(dueDate),y:1}, 
					{t:realDueDate == '0001-01-01T00:00:00' ? new Date() : new Date(realDueDate),y:20}
				],
				backgroundColor: [
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 99, 132, 0.2)'
				],
				borderColor: [
					'rgba(54, 162, 235, 1)',
					'rgba(255, 99, 132, 1)'
				],
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					},
					type: 'time',
					distribution: 'series',
					time: {
						unit: 'day'
					}
				}]
			}
		}
	});  
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
  
  getSemester(semester) {
    var s = "";

    switch (semester) {
      case semester.FirstWithWinterSession:
        s = "First with winter session";
        break;
      case semester.SecondWithSummerSession:
        s = "Second with summer session";
        break;
    }

    return s;
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
    await this.teacherService.getTeacherByAuthId(auth[0])
	  .then(function (operationStatus: operationStatusInfo) {
		var teacher1 = operationStatus.attachedObject;
		th.teacher = teacher1[0];
      }).catch(function(err) {
        console.log("Error while fetching teacher");
        alert(err);
      });
	  
	await this.reportingBySubjectService.getReportingPlanByModulesByTeacherId(this.teacher.id)
	 .then(function (operationStatus: operationStatusInfo){
      if (operationStatus.operationStatus == OperationStatus.Done) {
        var reportings = operationStatus.attachedObject;
        th.items = reportings[0];
        sessionStorage.setItem("reportingBySubject", JSON.stringify(th.items));
		th.items2 = JSON.parse(sessionStorage.reportingBySubject).map(i => ({ 
			idx: i, 
			id: i.id, 
			//teacher: i.teacher, 
			subject: i.subject,
			reportingBySubject: i.reportingBySubject, 
			realDueDate: i.realDueDate, 
			//isCompleted: i.isCompleted, 
			grade: i.grade, 
			/*material: i.material*/}));
        }
        else {
          console.log(operationStatus.attachedInfo);
          //sessionStorage.setItem("reportingBySubject", JSON.stringify(""));
          alert(operationStatus.attachedInfo);
        }
      }).catch(function(err) {
        console.log("Error loading reportingBySubjectAdditionalMaterials");
		console.log(err);
        alert(err);
      });
	  
    /*await this.reportingBySubjectService.getReportingBySubjectsByTeacherId(this.teacher.id)
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
			//material: i.material
			}));
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
      });*/
  }
  
  completeReport(item, grade)
  {
	var gradeNum = +grade;
	if(gradeNum  == 0 || gradeNum == null || gradeNum > 100)
		return;
	
	var newGrade: any;
	newGrade = {};
	newGrade.teacherId = this.teacher.id;
	newGrade.reportingId = item.reportingBySubject.id;
	newGrade.subjectId = item.subject.id;
	newGrade.grade = gradeNum;
	
	this.reportingBySubjectService.completeReport(newGrade)
	  .then(function (operationStatus: operationStatusInfo) {
		  if(operationStatus.operationStatus == OperationStatus.Done)
		  {
			item.grade = gradeNum;
			item.realDueDate = (new Date()).toString();
			alert("Grade set successfully!");
		  }
		  else
		  {
			console.log(operationStatus.attachedInfo);
            alert(operationStatus.attachedInfo);  
		  }
		
      }).catch(function(err) {
        console.log("Error while fetching working plans");
        alert(err);
      }); 
  }
}