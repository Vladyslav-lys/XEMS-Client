import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import {ReportingBySubject} from '../_models/reportingBySubject';
import {ReportingBySubjectAdditionalMaterials} from '../_models/reportingBySubjectAdditionalMaterials';
import {Teacher} from '../_models/teacher';
import {Student} from '../_models/student';
import {Discipline} from '../_models/discipline';
import {ReportingBySubjectType} from '../_enums/reportingBySubjectType';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';

@Component({
  selector: 'app-sign-up-reporting-by-subject',
  templateUrl: './sign-up-reporting-by-subject.component.html',
  styleUrls: ['./sign-up-reporting-by-subject.component.css']
})
export class SignUpReportingBySubjectComponent implements OnInit {
  
  fileInBase64: any;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  
  teachers: Teacher[];
  teachers2: Teacher[];
  
  students: Student[];
  students2: Student[];
  
  disciplines: Discipline[];
  disciplines2: Discipline[];

  constructor(
    private router: Router,
    private userService: UserService,
	private stub:StubService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void> {
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllTeachers();
	  await this.getAllStudents();
	  await this.getAllDisciplines();
    }
    else {
      setTimeout(async () => {
		  await this.getAllTeachers();
		  await this.getAllStudents();
		  await this.getAllDisciplines()
		}, 500);
    }
	
    this.registerForm = this.formBuilder.group({
		student: [1],
		teacher: [1],
		discipline: [1],
		title: ["", Validators.required],
		description: ["", Validators.required],
		reporting: [1],
		dueDate: ["", Validators.required],
		realDueDate: ["", Validators.required],
		isCompleted: [false],
		grade: ["0", Validators.required],
		material: ["", Validators.required]
    });
  }
  
  async getAllTeachers() {
    var th = this;
    
	await this.stub.getAllTeachers()
	  .then(function (operationStatus: operationStatusInfo) {
		var teachers = operationStatus.attachedObject;
        th.teachers = teachers;
        sessionStorage.setItem("teachers", JSON.stringify(teachers));
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
  
  onFileChanged(event) {
    var registerComponent = this;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      var fr = new FileReader();
      fr.onload = function () {
        var split1 = fr.result.toString().split(":", 2);
        var split2 = split1[1].split(";", 2);
		
        registerComponent.fileInBase64 = fr.result.toString();
      }
      fr.readAsDataURL(file);
    }
  }

  AddReporting() {

    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    var newReporting: ReportingBySubject;
    newReporting = new ReportingBySubject();
	var newReportingAdditional: ReportingBySubjectAdditionalMaterials;
    newReportingAdditional = new ReportingBySubjectAdditionalMaterials();

    if (this.registerForm.controls.student.value != null && this.registerForm.controls.student.value.length > 0)
      newReporting.student = this.registerForm.controls.student.value;
	if (this.registerForm.controls.teacher.value != null)
      newReporting.teacher = this.registerForm.controls.teacher.value;
	if (this.registerForm.controls.discipline.value != null)
      newReporting.discipline = this.registerForm.controls.discipline.value;
	if (this.registerForm.controls.title.value != null)
      newReporting.title = this.registerForm.controls.title.value;
	if (this.registerForm.controls.description.value != null)
      newReporting.description = this.registerForm.controls.description.value;
	if (this.registerForm.controls.reporting.value != null)
      newReporting.reporting = this.registerForm.controls.reporting.value;
	if (this.registerForm.controls.dueDate.value != null)
      newReporting.dueDate = this.registerForm.controls.dueDate.value;
	if (this.registerForm.controls.realDueDate.value != null)
      newReporting.realDueDate = this.registerForm.controls.realDueDate.value;
	newReporting.isCompleted = this.registerForm.controls.isCompleted.value;
	if (this.registerForm.controls.grade.value != null)
      newReporting.grade = this.registerForm.controls.grade.value;
	if (this.fileInBase64 != null) {
      var splitted = this.fileInBase64.split(",", 2);
      newReportingAdditional.material = splitted[1];
    }
	newReportingAdditional.reportingBySubject = newReporting;

    var th = this;
	this.stub.addReportingBySubjectAdditionalMaterials(newReportingAdditional)
		.then(function (operationStatus: operationStatusInfo) {
			var message = "Reporting added successfully";
			console.log(message);
			alert(message);
			th.router.navigate(['/reporting-by-subject-control']);
		}).catch(function(err) {
			console.log("Error while adding new reporting");
			alert(err);
			th.loading = false;
		});
	
  }

  enableBtn(): boolean {
    if (this.registerForm.controls.student.value.length > 0 && this.registerForm.controls.teacher.value.length > 0
		&& this.registerForm.controls.discipline.value.length > 0 && this.registerForm.controls.title.value.length > 0 
		&& this.registerForm.controls.description.value.length > 0 && this.registerForm.controls.reporting.value.length > 0 
		&& this.registerForm.controls.dueDate.value.length > 0 && this.registerForm.controls.realDueDate.value.length > 0 
		&& this.registerForm.controls.grade.value.length > 0)
      return true;
    return false;
  }
}