import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_models/operationStatusInfo';
import { NotifyService } from '../_services/notify.service';
import { Message } from '../_models/message';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';

@Component({
  selector: 'app-schedule-control',
  templateUrl: './schedule-control.component.html',
  styleUrls: ['./schedule-control.component.css']
})
export class ScheduleControlComponent implements OnInit {

  user: User;
  messageText: string;
  notifyForm: FormGroup;

  users: User[];

  users2: User[];

  constructor(
    private router: Router,
    private userService: UserService,
	private stub:StubService,
	private serviceClient: SignalRService,
    private notifySerivce: NotifyService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void>{
    this.user = JSON.parse(localStorage.currentUser);
  }

  openEdit(workPlan) {
    
  }

  deleteSorkPlan(workPlan) {
  }

  openAdd() {
  }
}