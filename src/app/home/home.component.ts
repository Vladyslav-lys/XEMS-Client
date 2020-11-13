import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {operationStatusInfo} from '../_helpers/operationStatusInfo';
import { Authorization } from '../_models/authorization';
import {SignalRService} from '../_services/signalR.service';
import {AccessLevel} from '../_enums/accessLevel';
import {HubConnectionState} from '@microsoft/signalr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authorization:any;
  
	constructor(
    private serviceClient: SignalRService,
    private router: Router
	) {
	  
  }

  ngOnInit() {
	this.authorization = JSON.parse(localStorage.currentAuthentication);
	
	switch(this.authorization[1])
	{
		case AccessLevel.Student:
			this.router.navigate(['/reporting-by-subject']);
			break;
		case AccessLevel.Teacher:
			this.router.navigate(['/students']);
			break;
		case AccessLevel.Admin:
			this.router.navigate(['/students-control']);
			break;
		default:
			this.router.navigate(['/login']);
			break;
	}
  }
}