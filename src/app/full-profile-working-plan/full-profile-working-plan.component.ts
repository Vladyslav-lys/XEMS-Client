import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../_services/teacher.service';
import { DisciplineService } from '../_services/discipline.service';
import { AuthenticationService } from '../_services/authentication.service';
import {WorkingPlanService} from '../_services/workingPlan.service';
//import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
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
  selector: 'app-full-profile-working-plan',
  templateUrl: './full-profile-working-plan.component.html',
  styleUrls: ['./full-profile-working-plan.component.css']
})
export class FullProfileWorkingPlansComponent implements OnInit {
  profileForm: FormGroup;
  currentWorkingPlanId: number;
  currentWorkingPlan: WorkingPlan;
  loading = false;
  submitted = false;
  
  disciplines: Discipline[];
  disciplines2: Discipline[];
  
  teachers: Teacher[];
  teachers2: Teacher[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
	//private stub:StubService,
    private authenticationService: AuthenticationService,
	private teacherService: TeacherService,
	private workingPlanService: WorkingPlanService,
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
              this.currentWorkingPlanId = +this.route.snapshot.paramMap.get('id');
              this.LoadWorkingPlanInfo(this.currentWorkingPlanId);
            });
        }
      });
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
	
    this.profileForm = this.formBuilder.group({
      teacher: [this.currentWorkingPlan.teacher.id, Validators.required],
	  discipline: [this.currentWorkingPlan.discipline.id, Validators.required],
	  hours: [this.currentWorkingPlan.hours, Validators.required],
	  role: [this.currentWorkingPlan.role],
	  year: [this.currentWorkingPlan.year, Validators.required],
	  semester: [this.currentWorkingPlan.semester]
    });
  }

  LoadWorkingPlanInfo(currentWorkingPlanId: number) {
	var th = this;
    var workingPlans = JSON.parse(sessionStorage.workingPlans);
    workingPlans.forEach(function (workingPlan: WorkingPlan) {
      if (workingPlan.id == currentWorkingPlanId) {
        th.currentWorkingPlan = workingPlan;
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

  EditWorkingPlan() {

    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
	
	//var newWorkingPlan: WorkingPlan;
    //newWorkingPlan = this.currentWorkingPlan;
	var newWorkingPlan: any;
    newWorkingPlan = {};
	
	newWorkingPlan.id = this.currentWorkingPlan.id;
	if (this.profileForm.controls.discipline.value != null && this.profileForm.controls.discipline.value != this.currentWorkingPlan.discipline.id)
	{
	  var id = this.profileForm.controls.discipline.value;
	  //newWorkingPlan.discipline = this.stub.getDisciplineById(id);
	  newWorkingPlan.disciplineId = +id;
	}
	if (this.profileForm.controls.hours.value != null && this.profileForm.controls.hours.value > 0 && this.profileForm.controls.hours.value != this.currentWorkingPlan.hours)
      newWorkingPlan.hours = +this.profileForm.controls.hours.value;
    if (this.profileForm.controls.role.value != null && this.profileForm.controls.role.value.length > 0 && this.profileForm.controls.role.value != this.currentWorkingPlan.role)
      newWorkingPlan.role = +this.profileForm.controls.role.value;
    if (this.profileForm.controls.year.value != null && this.profileForm.controls.year.value > 0 && this.profileForm.controls.year.value != this.currentWorkingPlan.year)
      newWorkingPlan.year = +this.profileForm.controls.year.value;
	if (this.profileForm.controls.semester.value != null && this.profileForm.controls.semester.value.length > 0 && this.profileForm.controls.semester.value != this.currentWorkingPlan.semester)
      newWorkingPlan.semester = +this.profileForm.controls.semester.value;
	
	var th = this;
	if(Object.keys(newWorkingPlan).length < 2)
	{
		alert("Please, change any field");
        th.loading = false;
		return;
	}
	
	this.workingPlanService.invokeUpdateWorkingPlanInfo(newWorkingPlan, Object.keys(newWorkingPlan))
      .then(function (operationStatusInfo: operationStatusInfo) {
        if (operationStatusInfo.operationStatus == OperationStatus.Done) {
          var message = "Working plan info updated successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/working-plans-control']);
        }
        else {
		  console.log(operationStatusInfo.attachedInfo);
          alert(operationStatusInfo.attachedInfo);
		  th.loading = false;
        }
      }).catch(function (err) {
        console.log("Error while updating working plan info");
        alert(err);
		th.loading = false;
      });
  }

  enableBtn(): boolean {
	if (!this.profileForm.invalid && (this.profileForm.controls.discipline.value != this.currentWorkingPlan.discipline.id
	|| this.profileForm.controls.year.value != this.currentWorkingPlan.year
	|| this.profileForm.controls.hours.value != this.currentWorkingPlan.hours
	|| this.profileForm.controls.role.value != this.currentWorkingPlan.role
	|| this.profileForm.controls.semester.value != this.currentWorkingPlan.semester))
      return true;
    return false;
  }
}