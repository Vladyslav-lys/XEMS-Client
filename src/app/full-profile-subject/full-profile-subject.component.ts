import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../_services/subject.service';
import { StudentService } from '../_services/student.service';
import { DisciplineService } from '../_services/discipline.service';
import { AuthenticationService } from '../_services/authentication.service';
//import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
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
  selector: 'app-full-profile-subject',
  templateUrl: './full-profile-subject.component.html',
  styleUrls: ['./full-profile-subject.component.css']
})
export class FullProfileSubjectComponent implements OnInit {
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
	//private stub:StubService,
    private authenticationService: AuthenticationService,
	private studentService: StudentService,
	private subjectService: SubjectService,
	private disciplineService: DisciplineService,
	private serviceClient: SignalRService,
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
		var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
		    await this.getAllStudents();
			await this.getAllDisciplines();
		  }
		}, 500);
    }
	
    this.profileForm = this.formBuilder.group({
      student: [this.currentSubject.student.id, Validators.required],
	  discipline: [this.currentSubject.discipline.id, Validators.required],
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
	
	//var newSubject: Subject;
    //newSubject = this.currentSubject;
	var newSubject: any;
    newSubject = {};
	
	newSubject.id = this.currentSubject.id;
	if (this.profileForm.controls.student.value != null && this.profileForm.controls.student.value != this.currentSubject.student.id)
	{
	  var id = this.profileForm.controls.student.value;
	  //newSubject.student = this.stub.getStudentById(id);
	  newSubject.studentId = +id;
	}
	if (this.profileForm.controls.discipline.value != null && this.profileForm.controls.discipline.value != this.currentSubject.discipline.id)
	{
	  var id = this.profileForm.controls.discipline.value;
	  //newSubject.discipline = this.stub.getDisciplineById(id);
	  newSubject.disciplineId = +id;
	}
    if (this.profileForm.controls.year.value != null && this.profileForm.controls.year.value > 0 && this.profileForm.controls.year.value != this.currentSubject.year)
      newSubject.year = +this.profileForm.controls.year.value;
	if (this.profileForm.controls.semester.value != null && this.profileForm.controls.semester.value.length > 0 && this.profileForm.controls.semester.value != this.currentSubject.semester)
      newSubject.semester = +this.profileForm.controls.semester.value;
	if (this.profileForm.controls.lectureHours.value != null && this.profileForm.controls.lectureHours.value > 0 && this.profileForm.controls.lectureHours.value != this.currentSubject.lectureHours)
      newSubject.lectureHours = +this.profileForm.controls.lectureHours.value;
	if (this.profileForm.controls.practiceHours.value != null && this.profileForm.controls.practiceHours.value > 0 && this.profileForm.controls.practiceHours.value != this.currentSubject.practiceHours)
      newSubject.practiceHours = +this.profileForm.controls.practiceHours.value;
	if (this.profileForm.controls.laboratoryHours.value != null && this.profileForm.controls.laboratoryHours.value > 0 && this.profileForm.controls.laboratoryHours.value != this.currentSubject.laboratoryHours)
      newSubject.laboratoryHours = +this.profileForm.controls.laboratoryHours.value;
	if (this.profileForm.controls.reporting.value != null && this.profileForm.controls.reporting.value.length > 0 && this.profileForm.controls.reporting.value != this.currentSubject.reporting)
      newSubject.reporting = +this.profileForm.controls.reporting.value;
	if (this.profileForm.controls.courseTask.value != null && this.profileForm.controls.courseTask.value.length > 0 && this.profileForm.controls.courseTask.value != this.currentSubject.courseTask)
      newSubject.courseTask = +this.profileForm.controls.courseTask.value;
	
	var th = this;
	if(Object.keys(newSubject).length < 2)
	{
		alert("Please, change any field");
        th.loading = false;
		return;
	}
	
	this.subjectService.invokeUpdateSubjectInfo(newSubject, Object.keys(newSubject))
      .then(function (operationStatusInfo: operationStatusInfo) {
        if (operationStatusInfo.operationStatus == OperationStatus.Done) {
          var message = "Subject info updated successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/subjects-control']);
        }
        else {
          console.log(operationStatusInfo.attachedInfo);
          alert(operationStatusInfo.attachedInfo);
		  th.loading = false;
        }
      }).catch(function (err) {
        console.log("Error while updating subject info");
        alert(err);
		th.loading = false;
      });
  }

  enableBtn(): boolean {
	if (!this.profileForm.invalid && (this.profileForm.controls.student.value != this.currentSubject.student.id
	|| this.profileForm.controls.discipline.value != this.currentSubject.discipline.id
	|| this.profileForm.controls.year.value != this.currentSubject.year
	|| this.profileForm.controls.semester.value != this.currentSubject.semester
	|| this.profileForm.controls.lectureHours.value != this.currentSubject.lectureHours
	|| this.profileForm.controls.practiceHours.value != this.currentSubject.practiceHours
	|| this.profileForm.controls.laboratoryHours.value != this.currentSubject.laboratoryHours
	|| this.profileForm.controls.reporting.value != this.currentSubject.reporting
	|| this.profileForm.controls.courseTask.value != this.currentSubject.courseTask))
      return true;
    return false;
  }
}