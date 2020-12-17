import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../_services/teacher.service';
import { DisciplineService } from '../_services/discipline.service';
import { WorkingPlanService } from '../_services/workingPlan.service';
import { SubjectService } from '../_services/subject.service';
import { GroupService } from '../_services/group.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import {Teacher} from '../_models/teacher';
import {Group} from '../_models/group';
import {Discipline} from '../_models/discipline';
import { Semester } from "../_enums/semester";
import { TeachersRole } from "../_enums/teachersRole";
import {WorkingPlan} from '../_models/workingPlan';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo, OperationStatus } from '../_helpers/operationStatusInfo';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';

@Component({
  selector: 'app-filter-working-plan',
  templateUrl: './filter-working-plan.component.html',
  styleUrls: ['./filter-working-plan.component.css']
})
export class FilterWorkingPlansComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  
  groups: Group[];
  groups2: Group[];
	
  constructor(
    private router: Router,
    private teacherService: TeacherService,
	private disciplineService: DisciplineService,
	private workingPlanService: WorkingPlanService,
	private subjectService: SubjectService,
	private groupService: GroupService,
	//private stub:StubService,
	private serviceClient: SignalRService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void> {
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllGroups();
    }
    else {
		var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
			  await this.getAllGroups();
		  }
		}, 500);
    }
	
    this.registerForm = this.formBuilder.group({
	  year: ["", Validators.required],
	  semester: ["", Validators.required],
      group: ["", Validators.required]
    });
  }
  
  async getAllGroups() {
    var th = this;
    
	await this.groupService.getAllGroups()
	  .then(function (operationStatus: operationStatusInfo) {
		var groups = operationStatus.attachedObject;
        th.groups = groups[0];
        sessionStorage.setItem("groups", JSON.stringify(th.groups));
        th.groups2 = JSON.parse(sessionStorage.groups).map(i => ({
          idx: i,
          id: i.id,
		  name: i.name,
		  curator: i.curator,
		  learningStartDate: i.learningStartDate,
		  learningEndDate: i.learningEndDate,
		  qualificationLevel: i.qualificationLevel
        }));
      }).catch(function(err) {
        console.log("Error while fetching groups");
        alert(err);
      });
  }
  
  getSemester(semester) {
    var s = "";

    switch (semester) {
      case Semester.FirstWithWinterSession:
        s = "First with winter session";
        break;
      case Semester.SecondWithSummerSession:
        s = "Second with summer session";
        break;
    }

    return s;
  }

  ConfirmFilter() {
	this.submitted = true;
    this.loading = true;
	
	var filterData: any;
    filterData = {};
	
	if (this.registerForm.controls.year.value != null && this.registerForm.controls.year.value > 0)
		filterData.year = +this.registerForm.controls.year.value;
	if (this.registerForm.controls.semester.value != null && this.registerForm.controls.semester.value.length > 0)
		filterData.semester = +this.registerForm.controls.semester.value;
	if (this.registerForm.controls.group.value != null && this.registerForm.controls.group.value.length > 0)
	{
	  var id = this.registerForm.controls.group.value;
	  filterData.group = +id;
	}
	
	sessionStorage.setItem("workingPlanFilterData", JSON.stringify(filterData));
	this.router.navigate(['/journal']);
  }

  enableBtn(): boolean {
	if (!this.registerForm.invalid)
      return true;
    return false;
  }
}