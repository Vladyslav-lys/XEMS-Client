import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import {Teacher} from '../_models/teacher';
import {Discipline} from '../_models/discipline';
import { Semester } from "../_enums/semester";
import { TeachersRole } from "../_enums/teachersRole";
import {WorkingPlan} from '../_models/workingPlan';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';

@Component({
  selector: 'app-sign-up-working-plans',
  templateUrl: './sign-up-working-plans.component.html',
  styleUrls: ['./sign-up-working-plans.component.css']
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
    private userService: UserService,
	private stub:StubService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): <void> {
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllTeachers();
	  await this.getAllDisciplines();
    }
    else {
      setTimeout(async () => {
		  await this.getAllTeachers();
		  await this.getAllDisciplines()
		}, 500);
    }
	
    this.registerForm = this.formBuilder.group({
      teacher: [1],
	  discipline: [1],
	  hours: ["0", Validators.required],
	  role: [1],
	  year: ["2020", Validators.required],
	  semester: [1]
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

  AddWorkingPlan() {
	this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
	
	var newWorkingPlan: WorkingPlan;
    newWorkingPlan = this.currentWorkingPlan;
	
	if (this.registerForm.controls.teacher.value != null)
	{
	  var id = this.registerForm.controls.teacher.value;
	  newWorkingPlan.teacher = this.stub.getTeacherById(id);
	}
	if (this.registerForm.controls.discipline.value != null)
	{
	  var id = this.registerForm.controls.discipline.value;
	  newWorkingPlan.discipline = this.stub.getDisciplineById(id);
	}
	if (this.registerForm.controls.hours.value != null && this.registerForm.controls.hours.value > 0)
      newWorkingPlan.hours = this.registerForm.controls.hours.value;
    if (this.registerForm.controls.role.value != null && this.registerForm.controls.role.length > 0)
      newWorkingPlan.role = this.registerForm.controls.role.value;
    if (this.registerForm.controls.year.value != null && this.registerForm.controls.year.value > 0)
      newWorkingPlan.year = this.registerForm.controls.year.value;
	if (this.registerForm.controls.semester.value != null && this.registerForm.controls.semester.value.length > 0)
      newWorkingPlan.semester = this.registerForm.controls.semester.value;
  
	var th = this;
	this.stub.addWorkingPlan(newWorkingPlan)
	  .then(function (operationStatus: operationStatusInfo) {
		var message = "Working plan added successfully";
        console.log(message);
        alert(message);
        th.router.navigate(['/working-plans-control']);
      }).catch(function(err) {
        console.log("Error while adding new working plan");
        alert(err);
	    th.loading = false;
      });
  }

  enableBtn(): boolean {
	if (this.registerForm.controls.teacher.value.length > 0 && this.registerForm.controls.discipline.value.length > 0  
		&& this.registerForm.controls.year.value.length > 0 && this.registerForm.controls.year.value > 0
		&& this.registerForm.controls.hours.value.length > 0 && this.registerForm.controls.hours.value > 0
		&& this.registerForm.controls.role.value.length > 0 && this.registerForm.controls.semester.value.length > 0)
      return true;
    return false;
  }
}