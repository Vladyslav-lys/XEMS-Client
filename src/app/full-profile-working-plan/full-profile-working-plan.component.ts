import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {Teacher} from '../_models/teacher';
import {Discipline} from '../_models/discipline';
import { Semester } from "../_enums/semester";
import { TeachersRole } from "../_enums/teachersRole";
import {WorkingPlan} from '../_models/workingPlan';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';

@Component({
  selector: 'app-full-profile-working-plans',
  templateUrl: './full-profile-working-plans.component.html',
  styleUrls: ['./full-profile-working-plans.component.css']
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
      setTimeout(async () => {
		  await this.getAllTeachers();
		  await this.getAllDisciplines()
		}, 500);
    }
	
    this.profileForm = this.formBuilder.group({
      teacher: [this.currentWorkingPlan.teacher],
	  discipline: [this.currentWorkingPlan.discipline],
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

  EditWorkingPlan() {

    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
	
	var newWorkingPlan: WorkingPlan;
    newWorkingPlan = this.currentWorkingPlan;
	
	if (this.profileForm.controls.teacher.value != null)
	{
	  var id = this.profileForm.controls.teacher.value;
	  newWorkingPlan.teacher = this.stub.getTeacherById(id);
	}
	if (this.profileForm.controls.discipline.value != null)
	{
	  var id = this.profileForm.controls.discipline.value;
	  newWorkingPlan.discipline = this.stub.getDisciplineById(id);
	}
	if (this.profileForm.controls.hours.value != null && this.profileForm.controls.hours.value > 0)
      newWorkingPlan.hours = this.profileForm.controls.hours.value;
    if (this.profileForm.controls.role.value != null && this.profileForm.controls.semester.role.length > 0)
      newWorkingPlan.role = this.profileForm.controls.role.value;
    if (this.profileForm.controls.year.value != null && this.profileForm.controls.year.value > 0)
      newWorkingPlan.year = this.profileForm.controls.year.value;
	if (this.profileForm.controls.semester.value != null && this.profileForm.controls.semester.value.length > 0)
      newWorkingPlan.semester = this.profileForm.controls.semester.value;
  
	this.stub.invokeUpdateWorkingPlanInfo(newWorkingPlan)
      .then(function (operationStatusInfo: operationStatusInfo) {
        if (operationStatusInfo.operationStatus == operationStatus.Done) {
          var message = "Working plan info updated successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/working-plans-control']);
        }
        else {
          alert(operationStatusInfo.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while updating working plan info");
        alert(err);
      });
  }

  enableBtn(): boolean {
	if (this.profileForm.controls.teacher.value.length > 0 && this.profileForm.controls.discipline.value.length > 0  
		&& this.profileForm.controls.year.value.length > 0 && this.profileForm.controls.year.value > 0
		&& this.profileForm.controls.hours.value.length > 0 && this.profileForm.controls.hours.value > 0
		&& this.profileForm.controls.role.value.length > 0 && this.profileForm.controls.semester.value.length > 0)
      return true;
    return false;
  }
}