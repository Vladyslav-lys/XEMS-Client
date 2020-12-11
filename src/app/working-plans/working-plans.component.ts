import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../_services/teacher.service';
import { WorkingPlanService } from '../_services/workingPlan.service';
import { GroupService } from '../_services/group.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { WorkingPlan } from '../_models/workingPlan';
import { Teacher } from '../_models/teacher';
import { ReportingPlanByTeachers } from '../_models/reportingPlanByTeachers';
import { Semester } from '../_enums/semester';
import { TeachersRole } from '../_enums/teachersRole';
import { ReportingBySemesterType } from '../_enums/reportingBySemesterType';
import { CourseTask } from '../_enums/courseTask';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo, OperationStatus } from '../_helpers/operationStatusInfo';
import { NotifyService } from '../_services/notify.service';
import { Message } from '../_models/message';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';

@Component({
  selector: 'app-working-plans',
  templateUrl: './working-plans.component.html',
  styleUrls: ['./working-plans.component.css']
})
export class WorkingPlansComponent implements OnInit {

  //workingPlans: WorkingPlan[];
  //workingPlans2: WorkingPlan[];
  workingPlans: ReportingPlanByTeachers[];
  workingPlans2: ReportingPlanByTeachers[];
  
  teacher:Teacher;
  
  constructor(
    private router: Router,
	private teacherService: TeacherService,
    private workingPlanService: WorkingPlanService,
	//private stub:StubService,
	private serviceClient: SignalRService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void>  {
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllWorkingPlans();
    }
    else {
      var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
		      await this.getAllWorkingPlans();
		  }
		}, 500);
    };
  }
  
  async getAllWorkingPlans() {
    var th = this;
	var auth = JSON.parse(localStorage.currentAuthentication);
    await this.teacherService.getTeacherByAuthId(auth[0])
	  .then(function (operationStatus: operationStatusInfo) {
		var teacher1 = operationStatus.attachedObject;
		th.teacher = teacher1[0];
      }).catch(function(err) {
        console.log("Error while fetching working plans");
        alert(err);
      });
	  
	  var filterData = JSON.parse(sessionStorage.getItem("workingPlanFilterData"));
	  var workingPlans2:ReportingPlanByTeachers[];
	await this.workingPlanService.getReportingPlansByTeacher(this.teacher.id,filterData.year,filterData.semester,filterData.group)
	  .then(function (operationStatus: operationStatusInfo) {
		var workingPlans = operationStatus.attachedObject;
        th.workingPlans = workingPlans[0];
        sessionStorage.setItem("workingPlans", JSON.stringify(th.workingPlans));
		workingPlans2 = th.getReportingPlanForGroups(JSON.parse(sessionStorage.workingPlans));
        th.workingPlans2 = workingPlans2.map(i => ({
          idx: i,
          id: i.workingPlan.id,
		  workingPlan: i.workingPlan,
		  subject: i.subject
        }));
      }).catch(function(err) {
        console.log("Error while fetching working plans");
        alert(err);
      });
	/*await this.workingPlanService.getAllWorkingPlansByTeacherId(teacher.id)
	  .then(function (operationStatus: operationStatusInfo) {
		var workingPlans = operationStatus.attachedObject;
        th.workingPlans = workingPlans[0];
        sessionStorage.setItem("workingPlans", JSON.stringify(th.workingPlans));
        th.workingPlans2 = JSON.parse(sessionStorage.workingPlans).map(i => ({
          idx: i,
          id: i.id,
		  discipline: i.discipline,
		  hours: i.hours,
		  role: i.role,
		  year: i.year,
		  semester: i.semester
        }));
      }).catch(function(err) {
        console.log("Error while fetching working plans");
        alert(err);
      });*/
  }
  
  getReportingPlanForGroups(workingPlans)
  {
	var workingPlans2:ReportingPlanByTeachers[];
	workingPlans2 = [];
	workingPlans2.push(workingPlans[0]);
	for(var workingPlanIndex in workingPlans)
	{
		if(!this.findReportingPlan(workingPlans[workingPlanIndex], workingPlans2))
		  workingPlans2.push(workingPlans[workingPlanIndex]);
	}
	return workingPlans2;
  }
  
  findReportingPlan(workingPlan, workingPlans)
  {
	for(var workingPlanIndex in workingPlans)
	{
		if(workingPlans[workingPlanIndex].workingPlan.discipline.title == workingPlan.workingPlan.discipline.title
		  && workingPlans[workingPlanIndex].subject.student.group.name == workingPlan.subject.student.group.name
		  && workingPlans[workingPlanIndex].workingPlan.role == workingPlan.workingPlan.role
		  && workingPlans[workingPlanIndex].workingPlan.year == workingPlan.workingPlan.year
		  && workingPlans[workingPlanIndex].subject.semester == workingPlan.subject.semester)
		  return true;
	}
	return false;
  }
  
  getRole(role) {
    var s = "";

    switch (role) {
      case TeachersRole.Lection:
        s = "Lection";
        break;
      case TeachersRole.Practice:
        s = "Practice";
        break;
	  case TeachersRole.Laboratory:
        s = "Laboratory";
        break;
    }

    return s;
  }
  
  getSemester(semester) {
    var s = "";

    switch (semester) {
      case Semester.FirstWithWinterSession:
        s = "First with winter session";
        break;
      case Semester.SecondWithSummerSession:
        s = "Second with summer session";
        break;
    }

    return s;
  }
  
  getReportingBySemesterType(reportingBySemesterType) {
    var s = "";

    switch (reportingBySemesterType) {
	  case ReportingBySemesterType.None:
        s = "None";
        break;
      case ReportingBySemesterType.Credit:
        s = "Credit";
        break;
      case ReportingBySemesterType.DifferentialCredit:
        s = "Differential credit";
        break;
	  case ReportingBySemesterType.Exam:
        s = "Exam";
        break;
	  default:
		return "None";
    }

    return s;
  }
  
  getCourseTask(courseTask) {
    var s = "";

    switch (courseTask) {
      case CourseTask.None:
        s = "None";
        break;
      case CourseTask.CourseWork:
        s = "Course work";
        break;
      case CourseTask.CourseProject:
        s = "Course project";
        break;
    }

    return s;
  }
}