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
import { operationStatusInfo, OperationStatus } from '../_helpers/operationStatusInfo';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';

@Component({
  selector: 'app-sign-up-subject-for-multiple-students',
  templateUrl: './sign-up-subject-for-multiple-students.component.html',
  styleUrls: ['./sign-up-subject-for-multiple-students.component.css']
})
export class SignUpSubjectForMultipleStudentsComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  
  disciplines: Discipline[];
  disciplines2: Discipline[];
  
  students: any;
  students2: any;
  
  checkedStudents: boolean[];

  constructor(
    private router: Router,
    private studentService: StudentService,
	private disciplineService: DisciplineService,
	private subjectService: SubjectService,
	//private stub:StubService,
	private serviceClient: SignalRService,
    private formBuilder: FormBuilder
  ) {
	  
  }

  async ngOnInit(): Promise<void> {
	 //this.checkedStudents = []; 
	  this.students = [];
	  this.students2 = [];
	  
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllStudents();
	  await this.getAllDisciplines();
    }
    else {
		var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
		    await this.getAllStudents();
			await this.getAllDisciplines()
		  }
		}, 500);
    }
	
    this.registerForm = this.formBuilder.group({
	  discipline: ["", Validators.required],
	  year: ["", Validators.required],
	  semester: ["", Validators.required],
	  lectureHours: ["", Validators.required],
	  practiceHours: ["", Validators.required],
	  laboratoryHours: ["", Validators.required],
	  reporting: ["", Validators.required],
	  courseTask: [0]
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
  
  async getAllStudents() {
    var th = this;
    
	await this.studentService.getAllStudents()
	  .then(function (operationStatus: operationStatusInfo) {
		var students = operationStatus.attachedObject;
        th.students = students[0];
        sessionStorage.setItem("students", JSON.stringify(th.students));
        th.students2 = JSON.parse(sessionStorage.students).map(i => ({
          idx: i,
          id: i.id,
          firstName: i.firstName,
		  lastName: i.lastName,
		  birthday: i.birthday,
		  phone: i.phone,
		  address: i.address,
		  group: i.group,
		  checked:false
        }));
      }).catch(function(err) {
        console.log("Error while fetching students");
        alert(err);
      });
  }

  AddSubject() {

    this.submitted = true;

    if (this.registerForm.invalid /*|| this.checkedStudents.length <= 0*/) {
      return;
    }

    this.loading = true;

    //var newSubject: Subject;
    //newSubject = new Subject();
	var newSubject: any;
    newSubject = {};
	
	/*if (this.checkedStudents.length > 0)
	{
	  for(var checkedStudentIndex in this.checkedStudents)
	  {
		if(this.checkedStudents[checkedStudentIndex])
		  newSubject.studentsId.push(this.students2[checkedStudentIndex].id);
	  }
	}*/
	newSubject.studentsId = [];
	for(var studentIndex in this.students2)
	  {
		if(this.students2[studentIndex].checked)
		  newSubject.studentsId.push(this.students2[studentIndex].id);
	  }
	if(newSubject.studentsId.length == 0)
	{
		alert("Please, choose one or more students!");
		return;
	}
	if (this.registerForm.controls.discipline.value != null)
	{
	  var id = this.registerForm.controls.discipline.value;
	  //newSubject.discipline = this.getDisciplineById(id);
	  newSubject.disciplineId = +id;
	}
    if (this.registerForm.controls.year.value != null && this.registerForm.controls.year.value > 0)
      newSubject.year = +this.registerForm.controls.year.value;
	if (this.registerForm.controls.semester.value != null && this.registerForm.controls.semester.value.length > 0)
      newSubject.semester = +this.registerForm.controls.semester.value;
	if (this.registerForm.controls.lectureHours.value != null && this.registerForm.controls.lectureHours.value > 0)
      newSubject.lectureHours = +this.registerForm.controls.lectureHours.value;
	if (this.registerForm.controls.practiceHours.value != null && this.registerForm.controls.practiceHours.value > 0)
      newSubject.practiceHours = +this.registerForm.controls.practiceHours.value;
	if (this.registerForm.controls.laboratoryHours.value != null && this.registerForm.controls.laboratoryHours.value > 0)
      newSubject.laboratoryHours = +this.registerForm.controls.laboratoryHours.value;
	if (this.registerForm.controls.reporting.value != null && this.registerForm.controls.reporting.value.length > 0)
      newSubject.reporting = +this.registerForm.controls.reporting.value;
	if (this.registerForm.controls.courseTask.value != null && this.registerForm.controls.courseTask.value.length > 0)
      newSubject.courseTask = +this.registerForm.controls.courseTask.value;
  
    var th = this;
	this.subjectService.addSubjectForMultipleStudents(newSubject)
	  .then(function (operationStatus: operationStatusInfo) {
		if(operationStatus.operationStatus == OperationStatus.Done)
		{
			var message = "Subject added successfully";
			console.log(message);
			alert(message);
			th.router.navigate(['/subjects-control']);
		}
		else
		{
			console.log(operationStatus.attachedInfo);
			alert(operationStatus.attachedInfo);
			th.loading = false;
		}
		
      }).catch(function(err) {
        console.log("Error while adding new subject");
		alert(err);
	    th.loading = false;
      });
  }
  
  getDisciplineById(id)
  {
	for(let discipline of this.disciplines2)
	{
		if(discipline.id == id)
			return discipline;
	}
  }
  
  getStudentById(id)
  {
	for(let student of this.students2)
	{
		if(student.id == id)
			return student;
	}
  }
  
  /*addCheckedStudent(index)
  {
	this.checkedStudentIndexes.push(index);
  }
  
  removeUncheckedStudent(index)
  {
	if(this.checkedStudentIndexes[index])
	  this.checkedStudentIndexes.splice(index,1);  
  }*/

  enableBtn(): boolean {
    if (!this.registerForm.invalid /*&& this.checkedStudents.length > 0*/)
      return true;
    return false;
  }
}