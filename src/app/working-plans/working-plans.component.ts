import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { WorkingPlan } from '../_models/workingPlan';
import { Semester } from '../_enums/semester';
import { TeacherRole } from '../_enums/teacherRole';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';
import { NotifyService } from '../_services/notify.service';
import { Message } from '../_models/message';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';

@Component({
  selector: 'app-working-plans',
  templateUrl: './working-plans.component.html',
  styleUrls: ['./working-plans.component.css']
})
export class WorkingPlansComponent implements OnInit {

  workingPlans: WorkingPlan[];
  workingPlans2: WorkingPlan[];
  
  constructor(
    private router: Router,
    private userService: UserService,
	private stub:StubService,
	private serviceClient: SignalRService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void>  {
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllWorkingPlans();
    }
    else {
      setTimeout(async () => {
		  await this.getAllWorkingPlans();
		}, 500);
    };
  }
  
  async getAllWorkingPlans() {
    var th = this;
    
	await this.stub.getAllWorkingPlans()
	  .then(function (operationStatus: operationStatusInfo) {
		var workingPlans = operationStatus.attachedObject;
        th.workingPlans = workingPlans;
        sessionStorage.setItem("workingPlans", JSON.stringify(workingPlans));
        th.workingPlans2 = JSON.parse(sessionStorage.workingPlans).map(i => ({
          idx: i,
          id: i.id,
		  teacher: i.teacher;
		  discipline: i.discipline;
		  hours: i.hours;
		  role: i.role;
		  year: i.year;
		  semester: i.semester;
        }));
      }).catch(function(err) {
        console.log("Error while fetching working plans");
        alert(err);
      });
  }
  
  getRole(role) {
    var s = "";

    switch (role) {
      case TeacherRole.Lection:
        s = "Lection";
        break;
      case TeacherRole.Practice:
        s = "Practice";
        break;
	  case TeacherRole.Laboratory:
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
}