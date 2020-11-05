import { Component, HostListener, OnDestroy } from '@angular/core';
import {AuthenticationService} from './_services/authentication.service';
import {Authorization} from './_models/authorization';
import {Router} from '@angular/router';
import {SignalRService} from './_services/signalR.service';
import { operationStatusInfo } from './_helpers/operationStatusInfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';
  currentAuthorization: Authorization;

  constructor(private serviceClient: SignalRService,
  ) {
  }
}
