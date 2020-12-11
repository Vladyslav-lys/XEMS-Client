import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../_services/teacher.service';
import { DisciplineService } from '../_services/discipline.service';
import { WorkingPlanService } from '../_services/workingPlan.service';
import { SubjectService } from '../_services/subject.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import {Teacher} from '../_models/teacher';
import {Subject} from '../_models/subject';
import {Discipline} from '../_models/discipline';
import { Semester } from "../_enums/semester";
import { TeachersRole } from "../_enums/teachersRole";
import { ReportingBySemesterType } from '../_enums/reportingBySemesterType';
import { CourseTask } from '../_enums/courseTask';
import {WorkingPlan} from '../_models/workingPlan';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo, OperationStatus } from '../_helpers/operationStatusInfo';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';

@Component({
  selector: 'app-sign-up-working-plan',
  templateUrl: './sign-up-working-plan.component.html',
  styleUrls: ['./sign-up-working-plan.component.css']
})
export class SignUpWorkingPlansComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
	
  disciplines: Discipline[];
  disciplines2: Discipline[];
  
  teachers: Teacher[];
  teachers2: Teacher[];
  
  subjects: any;
  subjects2: any;
  
  //checkedSubjects: boolean[];
	
  constructor(
    private router: Router,
    private teacherService: TeacherService,
	private disciplineService: DisciplineService,
	private workingPlanService: WorkingPlanService,
	private subjectService: SubjectService,
	//private stub:StubService,
	private serviceClient: SignalRService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void> {
	  this.subjects = [];
	  this.subjects2 = [];
	  
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllTeachers();
	  await this.getAllDisciplines();
	  await this.getAllSubjects();
    }
    else {
		var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
		    await this.getAllTeachers();
			await this.getAllDisciplines();
			await this.getAllSubjects();
		  }
		}, 500);
    }
	
    this.registerForm = this.formBuilder.group({
      teacher: ["", Validators.required],
	  discipline: ["", Validators.required],
	  hours: ["", Validators.required],
	  role: ["", Validators.required],
	  year: ["", Validators.required],
	  semester: ["", Validators.required]
    });
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
        alert(err);
      });
  }
  
  async getAllTeachers() {
    var th = this;
    
	await this.teacherService.getAllTeachers()
	  .then(function (operationStatus: operationStatusInfo) {
		var teachers = operationStatus.attachedObject;
        th.teachers = teachers[0];
        sessionStorage.setItem("teachers", JSON.stringify(th.teachers));
        th.teachers2 = JSON.parse(sessionStorage.teachers).map(i => ({
          idx: i,
          id: i.id,
		  firstName: i.firstName,
		  lastName: i.lastName,
		  birthday: i.birthday,
		  phone: i.phone,
		  address: i.address,
		  createTime: i.createTime,
		  modifyTime: i.modifyTime
        }));
      }).catch(function(err) {
        console.log("Error while fetching teachers");
        alert(err);
      });
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
		  semesterGrade: i.semesterGrade,
		  checked:false
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

  AddWorkingPlan() {
	this.submitted = true;

    if (this.registerForm.invalid /*|| this.checkedSubjects.length <= 0*/) {
      return;
    }

    this.loading = true;
	
	//var newWorkingPlan: WorkingPlan;
    //newWorkingPlan = new WorkingPlan();
	var newWorkingPlan: any;
    newWorkingPlan = {};
	var subjects: number[];
    subjects = [];
	
	if (this.registerForm.controls.teacher.value != null)
	{
	  var id = this.registerForm.controls.teacher.value;
	  //newWorkingPlan.teacher = this.stub.getTeacherById(id);
	  newWorkingPlan.teacherId = +id;
	}
	if (this.registerForm.controls.discipline.value != null)
	{
	  var id = this.registerForm.controls.discipline.value;
	  //newWorkingPlan.discipline = this.stub.getDisciplineById(id);
	  newWorkingPlan.disciplineId = +id;
	}
	if (this.registerForm.controls.hours.value != null && this.registerForm.controls.hours.value > 0)
      newWorkingPlan.hours = +this.registerForm.controls.hours.value;
    if (this.registerForm.controls.role.value != null && this.registerForm.controls.role.value.length > 0)
      newWorkingPlan.role = +this.registerForm.controls.role.value;
    if (this.registerForm.controls.year.value != null && this.registerForm.controls.year.value > 0)
      newWorkingPlan.year = +this.registerForm.controls.year.value;
	if (this.registerForm.controls.semester.value != null && this.registerForm.controls.semester.value.length > 0)
      newWorkingPlan.semester = +this.registerForm.controls.semester.value;
	for(var subjectIndex in this.subjects2)
	{
	  if(this.subjects2[subjectIndex].checked)
		subjects.push(this.subjects2[subjectIndex].id);
	}
	if(subjects.length == 0)
	{
		alert("Please, choose one or more subjects!");
		return;
	}
	/*if (this.checkedSubjects.length > 0)
	{
	  for(var checkedSubjectIndex in this.checkedSubjects)
	  {
		if(this.checkedSubjects[checkedSubjectIndex])
		  subjectIds.push(this.subjects2[checkedSubjectIndex].id);
	  }
	}*/
	
	var th = this;
	this.workingPlanService.addWorkingPlan(newWorkingPlan)
	  .then(function (operationStatus: operationStatusInfo) {
		if(operationStatus.operationStatus == OperationStatus.Done)
		{
			var result = operationStatus.attachedObject;
			var workingPlans: number[];
			workingPlans = [];
			workingPlans.push(result[0]);
			var setTeachersToSubjects:any;
			setTeachersToSubjects = {};
			setTeachersToSubjects.subjects = subjects;
			setTeachersToSubjects.workingPlans = workingPlans;
			th.workingPlanService.setTeachersToSubjects(setTeachersToSubjects)
			.then(function (operationStatus: operationStatusInfo) {
			  if(operationStatus.operationStatus == OperationStatus.Done)
			  {
				var message = "Working plan added successfully";
				console.log(message);
				alert(message);
				th.router.navigate(['/working-plans-control']);
			  }
			  else
			  {
				console.log(operationStatus.attachedInfo);
				alert(operationStatus.attachedInfo);
				th.loading = false;
			  }
			}).catch(function(err) {
			  console.log("Error while adding new working plan");
			  alert(err);
			  th.loading = false;
			});
		}
		else
		{
			console.log(operationStatus.attachedInfo);
			alert(operationStatus.attachedInfo);
			th.loading = false;
		}
      }).catch(function(err) {
        console.log("Error while adding new working plan");
        alert(err);
	    th.loading = false;
      });
  }

  enableBtn(): boolean {
	if (!this.registerForm.invalid /*&& this.checkedSubjects.length > 0*/)
      return true;
    return false;
  }
}