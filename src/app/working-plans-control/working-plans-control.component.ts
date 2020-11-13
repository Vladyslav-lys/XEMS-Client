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
import { operationStatusInfo } from '../_helpers/operationStatusInfo';
import { NotifyService } from '../_services/notify.service';
import { Message } from '../_models/message';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';

@Component({
  selector: 'app-working-plans-control',
  templateUrl: './working-plans-control.component.html',
  styleUrls: ['./working-plans-control.component.css']
})
export class WorkingPlansControlComponent implements OnInit {

  messageText: string;
  notifyForm: FormGroup;

  workingPlans: WorkingPlan[];
  workingPlans2: WorkingPlan[];

  constructor(
    private router: Router,
    private teacherService: TeacherService,
	private disciplineService: DisciplineService,
	private workingPlanService: WorkingPlanService,
	//private stub:StubService,
	private serviceClient: SignalRService,
    private notifySerivce: NotifyService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void>{
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllWorkingPlans();
    }
    else {
      var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
		    await this.getAllWorkingPlans();
		  }
		}, 500);
    }
  }
  
  async getAllWorkingPlans() {
    var th = this;
    
	await this.workingPlanService.getAllWorkingPlans()
	  .then(function (operationStatus: operationStatusInfo) {
		var workingPlans = operationStatus.attachedObject;
        th.workingPlans = workingPlans[0];
        sessionStorage.setItem("workingPlans", JSON.stringify(th.workingPlans));
        th.workingPlans2 = JSON.parse(sessionStorage.workingPlans).map(i => ({
          idx: i,
          id: i.id,
		  teacher: i.teacher,
		  discipline: i.discipline,
		  hours: i.hours,
		  role: i.role,
		  year: i.year,
		  semester: i.semester
        }));
      }).catch(function(err) {
        console.log("Error while fetching working plans");
        alert(err);
      });
  }
  
  getRole(role) {
    var s = "";

    switch (role) {
      case TeachersRole.Lection:
        s = "Lection";
        break;
      case TeachersRole.Practice:
        s = "Practice";
        break;
	  case TeachersRole.Laboratory:
        s = "Laboratory";
        break;
    }

    return s;
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

  openEdit(workingPlan) {
    this.router.navigate(['/full-profile-working-plan/:id']);
  }

  deleteWorkingPlan(workingPlan) {
	var th = this;
	this.workingPlanService.deleteWorkingPlan(workingPlan.id)
	  .then(function (operationStatus: operationStatusInfo) {
		console.log(operationStatus.attachedObject);
        if (!JSON.stringify(operationStatus.operationStatus))
          window.location.reload();
      }).catch(function(err) {
        console.log("Error while deleting the working plan");
        alert(err);
      });
  }

  openAdd() {
	this.router.navigate(['/register-working-plans']);
  }
}