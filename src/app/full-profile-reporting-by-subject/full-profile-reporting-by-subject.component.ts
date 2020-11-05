import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {ReportingBySubject} from '../_models/reportingBySubject';
import {ReportingBySubjectAdditionalMaterials} from '../_models/reportingBySubjectAdditionalMaterials';
import {Teacher} from '../_models/teacher';
import {Student} from '../_models/student';
import {ReportingBySubjectType} from '../_enums/reportingBySubjectType';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';

@Component({
  selector: 'app-full-profile-reporting-by-subject',
  templateUrl: './full-profile-reporting-by-subject.component.html',
  styleUrls: ['./full-profile-reporting-by-subject.component.css']
})
export class FullProfileReportingBySubjectComponent implements OnInit {
  profileForm: FormGroup;
  currentReportingId: number;
  currentReporting: ReportingBySubjectAdditionalMaterials;
  currentMaterial: any;
  loading = false;
  submitted = false;
  
  teachers: Teacher[];
  teachers2: Teacher[];
  
  students: Student[];
  students2: Student[];
  
  disciplines: Discipline[];
  disciplines2: Discipline[];

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
              this.currentReportingId = +this.route.snapshot.paramMap.get('id');
			  this.LoadReportingInfo(currentReportingId);
            });
        }
      });
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
	
	this.currentMaterial = this.currentReporting.material;
	
	this.profileForm = this.formBuilder.group({
		student: [this.currentReporting.reportingBySubject.student.id],
		teacher: [this.currentReporting.reportingBySubject.teacher.id],
		discipline: [this.currentReporting.reportingBySubject.discipline],
		title: [this.currentReporting.reportingBySubject.title, Validators.required],
		description: [this.currentReporting.reportingBySubject.description, Validators.required],
		reporting: [this.currentReporting.reportingBySubject.reporting],
		dueDate: [this.currentReporting.reportingBySubject.dueDate, Validators.required],
		realDueDate: [this.currentReporting.reportingBySubject.realDueDate, Validators.required],
		isCompleted: [this.currentReporting.reportingBySubject.isCompleted],
		grade: [this.currentReporting.reportingBySubject.grade, Validators.required]
    });
  }

  LoadReportingInfo(currentReportingId: number) {
	var th = this;
    var reporting = JSON.parse(localStorage.reportingBySubjectAdditionalMaterialss);
    reporting.forEach(function (reportingBySubjectAdditionalMaterialss: ReportingBySubjectAdditionalMaterialss) {
      if (reportingBySubjectAdditionalMaterialss.id == currentReportingId) {
        th.currentReporting = reporting;
        th.currentMaterial = reporting.material;
        console.log(reporting);
      }
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
		
        registerComponent.currentMaterial = fr.result.toString();
      }
      fr.readAsDataURL(file);
    }
  }

  EditReporting() {

    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
	
	var newReportingAdditional: ReportingBySubjectAdditionalMaterials;
    newReportingAdditional = this.currentReporting;
	var newReporting: ReportingBySubject;
    newReporting = newReportingAdditional.reportingBySubject;

    if (this.profileForm.controls.student.value != null && this.profileForm.controls.student.value.length > 0)
      newReporting.student = this.profileForm.controls.student.value;
	if (this.profileForm.controls.teacher.value != null)
      newReporting.teacher = this.profileForm.controls.teacher.value;
	if (this.profileForm.controls.discipline.value != null)
      newReporting.discipline = this.profileForm.controls.discipline.value;
	if (this.profileForm.controls.title.value != null)
      newReporting.title = this.profileForm.controls.title.value;
	if (this.profileForm.controls.description.value != null)
      newReporting.description = this.profileForm.controls.description.value;
	if (this.profileForm.controls.reporting.value != null)
      newReporting.reporting = this.profileForm.controls.reporting.value;
	if (this.profileForm.controls.dueDate.value != null)
      newReporting.dueDate = this.profileForm.controls.dueDate.value;
	if (this.profileForm.controls.realDueDate.value != null)
      newReporting.realDueDate = this.profileForm.controls.realDueDate.value;
	newReporting.isCompleted = this.profileForm.controls.isCompleted.value;
	if (this.profileForm.controls.grade.value != null)
      newReporting.grade = this.profileForm.controls.grade.value;
	if (this.currentMaterial != null) {
      var splitted = this.currentMaterial.split(",", 2);
      newReportingAdditional.material = splitted[1];
    }
	newReportingAdditional.reportingBySubject = newReporting;

    var th = this;
	this.stub.invokeUpdateReportingBySubjectAdditionalMaterialsInfo(newReportingAdditional)
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
	if (this.profileForm.controls.student.value.length > 0 && this.profileForm.controls.teacher.value.length > 0
		&& this.profileForm.controls.discipline.value.length > 0 && this.profileForm.controls.title.value.length > 0 
		&& this.profileForm.controls.description.value.length > 0 && this.profileForm.controls.reporting.value.length > 0 
		&& this.profileForm.controls.dueDate.value.length > 0 && this.profileForm.controls.realDueDate.value.length > 0 
		&& this.profileForm.controls.grade.value.length > 0)
      return true;
    return false;
  }
}