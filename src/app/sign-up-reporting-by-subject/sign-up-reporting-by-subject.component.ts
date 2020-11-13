import { Component, OnInit } from '@angular/core';
import {ReportingBySubjectService} from '../_services/reportingBySubject.service';
import {TeacherService} from '../_services/teacher.service';
import {DisciplineService} from '../_services/discipline.service';
import {StudentService} from '../_services/student.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import {ReportingBySubject} from '../_models/reportingBySubject';
import {ReportingBySubjectAdditionalMaterials} from '../_models/reportingBySubjectAdditionalMaterials';
import {Teacher} from '../_models/teacher';
import {Student} from '../_models/student';
import {Discipline} from '../_models/discipline';
import {ReportingBySubjectType} from '../_enums/reportingBySubjectType';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo, OperationStatus } from '../_helpers/operationStatusInfo';
import {SignalRService} from '../_services/signalR.service';
import {HubConnectionState} from '@microsoft/signalr';

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
  
  teacher: Teacher;
  
  students: Student[];
  students2: Student[];
  
  disciplines: Discipline[];
  disciplines2: Discipline[];

  constructor(
    private router: Router,
    private reportingBySubjectService: ReportingBySubjectService,
	private teacherService: TeacherService,
	private studentService: StudentService,
	private disciplineService: DisciplineService,
	private serviceClient: SignalRService,
	//private stub:StubService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void> {
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getTeacher();
	  await this.getAllStudents();
	  await this.getAllDisciplines();
    }
    else {
		var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
		    await this.getTeacher();
			await this.getAllStudents();
			await this.getAllDisciplines()
		  }
		}, 500);
    }
	
    this.registerForm = this.formBuilder.group({
		//student: ["", Validators.required],
		//teacher: ["", Validators.required],
		discipline: ["", Validators.required],
		title: ["", Validators.required],
		description: ["", Validators.required],
		reporting: ["", Validators.required],
		dueDate: ["", Validators.required],
		//realDueDate: ["", Validators.required],
		//isCompleted: [false],
		//grade: ["", Validators.required],
		//material: ["", Validators.required]
    });
  }
  
  async getTeacher() {
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
  
  onFileChanged(event) {
    var registerComponent = this;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      var fr = new FileReader();
      fr.onload = function () {
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

    //var newReporting: ReportingBySubject;
    //newReporting = new ReportingBySubject();
	//var newReportingAdditional: ReportingBySubjectAdditionalMaterials;
    //newReportingAdditional = new ReportingBySubjectAdditionalMaterials();
	var newReporting: any;
    newReporting = {};

    //if (this.registerForm.controls.student.value != null && this.registerForm.controls.student.value.length > 0)
    //  newReporting.studentId = +this.registerForm.controls.student.value;
	//if (this.registerForm.controls.teacher.value != null && this.registerForm.controls.student.value.length > 0)
    newReporting.teacherId = this.teacher.id;
	if (this.registerForm.controls.discipline.value != null && this.registerForm.controls.discipline.value.length > 0)
      newReporting.disciplineId = +this.registerForm.controls.discipline.value;
	if (this.registerForm.controls.title.value != null && this.registerForm.controls.title.value.length > 0)
      newReporting.title = this.registerForm.controls.title.value;
	if (this.registerForm.controls.description.value != null && this.registerForm.controls.description.value.length > 0)
      newReporting.description = this.registerForm.controls.description.value;
	if (this.registerForm.controls.reporting.value != null && this.registerForm.controls.reporting.value.length > 0)
      newReporting.reporting = +this.registerForm.controls.reporting.value;
	if (this.registerForm.controls.dueDate.value != null && this.registerForm.controls.dueDate.value.length > 0)
      newReporting.dueDate = this.registerForm.controls.dueDate.value;
	//if (this.registerForm.controls.realDueDate.value != null && this.registerForm.controls.student.value.length > 0)
    //  newReporting.realDueDate = this.registerForm.controls.realDueDate.value;
	//newReporting.isCompleted = this.registerForm.controls.isCompleted.value;
	//if (this.registerForm.controls.grade.value != null && this.registerForm.controls.student.value.length > 0)
    //  newReporting.grade = this.registerForm.controls.grade.value;
	/*if (this.fileInBase64 != null) {
      var splitted = this.fileInBase64.split(",", 2);
      newReportingAdditional.material = splitted[1];
    }*/
	//newReportingAdditional.reportingBySubject = newReporting;
	
    var th = this;
	this.reportingBySubjectService.addReportingBySubject(newReporting)
		.then(function (operationStatus: operationStatusInfo) {
			if(operationStatus.operationStatus == OperationStatus.Done)
			{
				var message = "Reporting added successfully";
				console.log(message);
				alert(message);
				th.router.navigate(['/reporting-by-subject-control']);
			}
			else
			{
				console.log(operationStatus.attachedObject);
				alert(operationStatus.attachedObject);
				th.loading = false;
			}
		}).catch(function(err) {
			console.log("Error while adding new reporting");
			alert(err);
			th.loading = false;
		});
	
  }

  enableBtn(): boolean {
    if (!this.registerForm.invalid)
      return true;
    return false;
  }
}