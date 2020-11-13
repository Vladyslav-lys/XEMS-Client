import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../_services/teacher.service';
import { DisciplineService } from '../_services/discipline.service';
import { WorkingPlanService } from '../_services/workingPlan.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import {Teacher} from '../_models/teacher';
import {Discipline} from '../_models/discipline';
import { Semester } from "../_enums/semester";
import { TeachersRole } from "../_enums/teachersRole";
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
	
  constructor(
    private router: Router,
    private teacherService: TeacherService,
	private disciplineService: DisciplineService,
	private workingPlanService: WorkingPlanService,
	//private stub:StubService,
	private serviceClient: SignalRService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void> {
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllTeachers();
	  await this.getAllDisciplines();
    }
    else {
		var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
		    await this.getAllTeachers();
			await this.getAllDisciplines();
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

  AddWorkingPlan() {
	this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
	
	//var newWorkingPlan: WorkingPlan;
    //newWorkingPlan = new WorkingPlan();
	var newWorkingPlan: any;
    newWorkingPlan = {};
	
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
  
	var th = this;
	this.workingPlanService.addWorkingPlan(newWorkingPlan)
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

  enableBtn(): boolean {
	if (!this.registerForm.invalid)
      return true;
    return false;
  }
}