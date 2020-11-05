import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subject } from '../_models/subject';
import {Student} from './student';
import {Discipline} from './discipline';
import { CourseTask } from "../_enums/courseTask";
import { ReportingBySemesterType } from "../_enums/reportingBySemesterType";
import { Semester } from "../_enums/semester";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';

@Component({
  selector: 'app-full-profile-subject',
  templateUrl: './full-profile-subject.component.html',
  styleUrls: ['./full-profile-subject.component.css']
})
export class FullProfileScheduleComponent implements OnInit {
  profileForm: FormGroup;
  currentSubjectId: number;
  currentSubject: Subject;
  loading = false;
  submitted = false;
  
  disciplines: Discipline[];
  disciplines2: Discipline[];
  
  students: Student[];
  students2: Student[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
	private stub:StubService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.route
            .queryParams
            .subscribe(params => {
              // Defaults to 0 if no query param provided.
              this.currentSubjectId = +this.route.snapshot.paramMap.get('id');
			  this.LoadSubjectInfo(this.currentSubjectId);
            });
        }
      });
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
	
    this.profileForm = this.formBuilder.group({
      student: [this.currentSubject.student],
	  discipline: [this.currentSubject.discipline],
	  year: [this.currentSubject.year, Validators.required],
	  semester: [this.currentSubject.semester],
	  lectureHours: [this.currentSubject.lectureHours, Validators.required],
	  practiceHours: [this.currentSubject.practiceHours, Validators.required],
	  laboratoryHours: [this.currentSubject.laboratoryHours, Validators.required],
	  reporting: [this.currentSubject.reporting],
	  courseTask: [this.currentSubject.courseTask],
	  semesterGrade: [this.currentSubject.semesterGrade, Validators.required],
    });
  }

  LoadSubjectInfo(currentSubjectId: number) {
	var th = this;
    var subjects = JSON.parse(sessionStorage.subjects);
    subjects.forEach(function (subject: Subject) {
      if (subject.id == currentSubjectId) {
        th.currentSubject = subject;
      }
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

  EditSubject() {

    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
	
	var newSubject: Subject;
    newSubject = this.currentSubject;
	
	if (this.profileForm.controls.student.value != null)
	{
	  var id = this.profileForm.controls.student.value;
	  newSubject.student = this.stub.getStudentById(id);
	}
	if (this.profileForm.controls.discipline.value != null)
	{
	  var id = this.profileForm.controls.discipline.value;
	  newSubject.discipline = this.stub.getDisciplineById(id);
	}
    if (this.profileForm.controls.year.value != null && this.profileForm.controls.year.value > 0)
      newSubject.year = this.profileForm.controls.year.value;
	if (this.profileForm.controls.semester.value != null && this.profileForm.controls.semester.value.length > 0)
      newSubject.semester = this.profileForm.controls.semester.value;
	if (this.profileForm.controls.lectureHours.value != null && this.profileForm.controls.lectureHours.value > 0)
      newSubject.lectureHours = this.profileForm.controls.lectureHours.value;
	if (this.profileForm.controls.practiceHours.value != null && this.profileForm.controls.practiceHours.value > 0)
      newSubject.practiceHours = this.profileForm.controls.practiceHours.value;
	if (this.profileForm.controls.laboratoryHours.value != null && this.profileForm.controls.laboratoryHours.value > 0)
      newSubject.laboratoryHours = this.profileForm.controls.laboratoryHours.value;
	if (this.profileForm.controls.reporting.value != null && this.profileForm.controls.reporting.value.length > 0)
      newSubject.reporting = this.profileForm.controls.reporting.value;
	if (this.profileForm.controls.courseTask.value != null && this.profileForm.controls.courseTask.value.length > 0)
      newSubject.courseTask = this.profileForm.controls.courseTask.value;
	if (this.profileForm.controls.semesterGrade.value != null && this.profileForm.controls.semesterGrade.value > 0)
      newSubject.semesterGrade = this.profileForm.controls.semesterGrade.value;
  
	this.stub.invokeUpdateSubjectInfo(newSubject)
      .then(function (operationStatusInfo: operationStatusInfo) {
        if (operationStatusInfo.operationStatus == operationStatus.Done) {
          var message = "Subject info updated successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/subjects-control']);
        }
        else {
          alert(operationStatusInfo.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while updating subject info");
        alert(err);
      });
  }

  enableBtn(): boolean {
	if (this.profileForm.controls.year.value.length > 0 && this.profileForm.controls.year.value > 0
		&& this.profileForm.controls.lectureHours.value.length > 0 && this.profileForm.controls.lectureHours.value > 0
		&& this.profileForm.controls.practiceHours.value.length > 0 && this.profileForm.controls.practiceHours.value > 0
		&& this.profileForm.controls.laboratoryHours.value.length > 0 && this.profileForm.controls.laboratoryHours.value > 0
		&& this.profileForm.controls.semesterGrade.length > 0 && this.profileForm.controls.semesterGrade.value > 0
		&& this.profileForm.controls.discipline.value.length > 0 && this.profileForm.controls.student.value.length > 0
		&& this.profileForm.controls.semester.value.length > 0 && this.profileForm.controls.reporting.value.length > 0
		&& this.profileForm.controls.courseTask.value.length > 0)
      return true;
    return false;
  }
}