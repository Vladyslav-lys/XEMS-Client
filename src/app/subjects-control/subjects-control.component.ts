import { Component, OnInit } from '@angular/core';
import { StudentService } from '../_services/student.service';
import { DisciplineService } from '../_services/discipline.service';
import { SubjectService } from '../_services/subject.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { Subject } from '../_models/subject';
import {Student} from '../_models/student';
import {Discipline} from '../_models/discipline';
import { CourseTask } from "../_enums/courseTask";
import { ReportingBySemesterType } from "../_enums/reportingBySemesterType";
import { Semester } from "../_enums/semester";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';
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

  subjects: Subject[];
  subjects2: Subject[];

  constructor(
    private router: Router,
    private studentService: StudentService,
	private disciplineService: DisciplineService,
	private subjectService: SubjectService,
	//private stub:StubService,
	private serviceClient: SignalRService,
    private notifySerivce: NotifyService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void>{
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllSubjects()
    }
    else {
      var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
		    await this.getAllSubjects();
		  }
		}, 500);
    }
  }

  async getAllSubjects() {
    var th = this;
    
	await this.subjectService.getAllSubjects()
	  .then(function (operationStatus: operationStatusInfo) {
		var subjects = operationStatus.attachedObject;
        th.subjects = subjects[0];
        sessionStorage.setItem("subjects", JSON.stringify(th.subjects));
        th.subjects2 = JSON.parse(sessionStorage.subjects).map(i => ({
          idx: i,
          id: i.id,
		  student: i.student,
		  discipline: i.discipline,
		  year: i.year,
		  semester: i.semester,
		  lectureHours: i.lectureHours,
		  practiceHours: i.practiceHours,
		  laboratoryHours: i.laboratoryHours,
		  reporting: i.reportingBySemesterType,
		  courseTask: i.courseTask,
		  semesterGrade: i.semesterGrade
        }));
      }).catch(function(err) {
		  alert(err);
        console.log("Error while fetching subjects");
      });
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
    }

    return s;
  }

  openEdit(subject) {
    this.router.navigate(['/full-profile-subject/:id']);
  }

  deleteSubject(subject) {
    var th = this;
	this.subjectService.deleteSubject(subject.id)
	  .then(function (operationStatus: operationStatusInfo) {
		console.log(operationStatus.attachedObject);
        if (!JSON.stringify(operationStatus.operationStatus))
          window.location.reload();
      }).catch(function(err) {
        console.log("Error while deleting the subject");
      });
  }

  openAdd() {
    this.router.navigate(['/register-subject']);
  }
}