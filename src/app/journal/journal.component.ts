import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../_services/teacher.service';
import { WorkingPlanService } from '../_services/workingPlan.service';
import { GroupService } from '../_services/group.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { WorkingPlan } from '../_models/workingPlan';
import { StudentService } from '../_services/student.service';
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
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.css']
})
export class JournalComponent implements OnInit {

  //workingPlans: WorkingPlan[];
  //workingPlans2: WorkingPlan[];
  workingPlans: ReportingPlanByTeachers[];
  workingPlans2: ReportingPlanByTeachers[];
  
  teacher:Teacher;
  
  constructor(
    private router: Router,
	private teacherService: TeacherService,
    private workingPlanService: WorkingPlanService,
	private studentService: StudentService,
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
	await this.workingPlanService.getReportingPlansByTeacher(this.teacher.id,filterData.year,filterData.semester,filterData.group)
	  .then(function (operationStatus: operationStatusInfo) {
		var workingPlans = operationStatus.attachedObject;
        th.workingPlans = workingPlans[0];
        sessionStorage.setItem("workingPlans", JSON.stringify(th.workingPlans));
        th.workingPlans2 = JSON.parse(sessionStorage.workingPlans).map(i => ({
          idx: i,
          id: i.id,
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
  
  completeSubject(subject, grade)
  {
	var gradeNum = +grade;
	if(gradeNum == 0 || gradeNum == null || gradeNum > 100)
	{
		alert("Set the grade between 0 and 100");
		return;
	}
	
	this.workingPlanService.completeSubject(subject.id, this.teacher.id, gradeNum)
	  .then(function (operationStatus: operationStatusInfo) {
		if (operationStatus.operationStatus == OperationStatus.Done) {
		  subject.semesterGrade = gradeNum;
          var message = "Grade set successfully";
          console.log(message);
          alert(message);
        }
        else {
		  console.log(operationStatus.attachedInfo);
          alert(operationStatus.attachedInfo);
        }
		
      }).catch(function(err) {
        console.log("Error while fetching working plans");
        alert(err);
      }); 
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
		s = "None";
		break;
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