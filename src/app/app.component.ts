import { Component, HostListener, OnDestroy } from '@angular/core';
import {AuthenticationService} from './_services/authentication.service';
import {User} from './_models/user';
import {Router} from '@angular/router';
import {SignalRService} from './_services/signalR.service';
import { operationStatusInfo } from './_models/operationStatusInfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';
  currentUser: User;

  constructor(private serviceClient: SignalRService,
  ) {
  }
}
