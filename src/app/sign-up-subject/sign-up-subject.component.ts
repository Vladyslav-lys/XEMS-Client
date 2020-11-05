import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { Subject } from '../_models/subject';
import {Student} from './student';
import {Discipline} from './discipline';
import { CourseTask } from "../_enums/courseTask";
import { ReportingBySemesterType } from "../_enums/reportingBySemesterType";
import { Semester } from "../_enums/semester";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';

@Component({
  selector: 'app-sign-up-subject',
  templateUrl: './sign-up-subject.component.html',
  styleUrls: ['./sign-up-subject.component.css']
})
export class SignUpSubjectComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  
  disciplines: Discipline[];
  disciplines2: Discipline[];
  
  students: Student[];
  students2: Student[];

  constructor(
    private router: Router,
    private userService: UserService,
	private stub:StubService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void> {
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllStudents();
	  await this.getAllDisciplines();
    }
    else {
      setTimeout(async () => {
		  await this.getAllStudents();
		  await this.getAllDisciplines()
		}, 500);
    }
	
    this.registerForm = this.formBuilder.group({
      student: [1],
	  discipline: [1],
	  year: ["2020", Validators.required],
	  semester: [1],
	  lectureHours: ["0", Validators.required],
	  practiceHours: ["0", Validators.required],
	  laboratoryHours: ["0", Validators.required],
	  reporting: [1],
	  courseTask: [1],
	  semesterGrade: ["1", Validators.required],
    });
  }
  
  async getAllDisciplines() {
    var th = this;
    
	await this.stub.getAllDisciplines()
	  .then(function (operationStatus: operationStatusInfo) {
		var disciplines = operationStatus.attachedObject;
        th.disciplines = disciplines;
        sessionStorage.setItem("disciplines", JSON.stringify(disciplines));
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
    
	await this.stub.getAllStudents()
	  .then(function (operationStatus: operationStatusInfo) {
		var students = operationStatus.attachedObject;
        th.students = students;
        sessionStorage.setItem("students", JSON.stringify(students));
        th.students2 = JSON.parse(sessionStorage.students).map(i => ({
          idx: i,
          id: i.id,
          firstName: i.firstName,
		  lastName: i.lastName,
		  birthday: i.birthday,
		  phone: i.phone,
		  address: i.address,
		  group: i.group
        }));
      }).catch(function(err) {
        console.log("Error while fetching students");
        alert(err);
      });
  }

  AddSubject() {

    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    var newSubject: Subject;
    newSubject = new Subject();
	
	if (this.registerForm.controls.student.value != null)
	{
	  var id = this.registerForm.controls.student.value;
	  newSubject.student = this.stub.getstudentById(id);
	}
	if (this.registerForm.controls.discipline.value != null)
	{
	  var id = this.registerForm.controls.discipline.value;
	  newSubject.discipline = this.stub.getDisciplineById(id);
	}
    if (this.registerForm.controls.year.value != null && this.registerForm.controls.year.value > 0)
      newSubject.year = this.registerForm.controls.year.value;
	if (this.registerForm.controls.semester.value != null && this.registerForm.controls.semester.value.length > 0)
      newSubject.semester = this.registerForm.controls.semester.value;
	if (this.registerForm.controls.lectureHours.value != null && this.registerForm.controls.lectureHours.value > 0)
      newSubject.lectureHours = this.registerForm.controls.lectureHours.value;
	if (this.registerForm.controls.practiceHours.value != null && this.registerForm.controls.practiceHours.value > 0)
      newSubject.practiceHours = this.registerForm.controls.practiceHours.value;
	if (this.registerForm.controls.laboratoryHours.value != null && this.registerForm.controls.laboratoryHours.value > 0)
      newSubject.laboratoryHours = this.registerForm.controls.laboratoryHours.value;
	if (this.registerForm.controls.reporting.value != null && this.registerForm.controls.reporting.value.length > 0)
      newSubject.reporting = this.registerForm.controls.reporting.value;
	if (this.registerForm.controls.courseTask.value != null && this.registerForm.controls.courseTask.value.length > 0)
      newSubject.courseTask = this.registerForm.controls.courseTask.value;
	if (this.registerForm.controls.semesterGrade.value != null && this.registerForm.controls.semesterGrade.value > 0)
      newSubject.semesterGrade = this.registerForm.controls.semesterGrade.value;

    var th = this;
	this.stub.addSubject(newSubject)
	  .then(function (operationStatus: operationStatusInfo) {
		var message = "Subject added successfully";
        console.log(message);
        alert(message);
        th.router.navigate(['/subjects-control']);
      }).catch(function(err) {
        console.log("Error while adding new subject");
        alert(err);
	    th.loading = false;
      });
  }

  enableBtn(): boolean {
    if (this.registerForm.controls.year.value.length > 0 && this.registerForm.controls.year.value > 0
		&& this.registerForm.controls.lectureHours.value.length > 0 && this.registerForm.controls.lectureHours.value > 0
		&& this.registerForm.controls.practiceHours.value.length > 0 && this.registerForm.controls.practiceHours.value > 0
		&& this.registerForm.controls.laboratoryHours.value.length > 0 && this.registerForm.controls.laboratoryHours.value > 0
		&& this.registerForm.controls.semesterGrade.length > 0 && this.registerForm.controls.semesterGrade.value > 0
		&& this.registerForm.controls.discipline.value.length > 0 && this.registerForm.controls.student.value.length > 0
		&& this.registerForm.controls.semester.value.length > 0 && this.registerForm.controls.reporting.value.length > 0
		&& this.registerForm.controls.courseTask.value.length > 0)
      return true;
    return false;
  }
}