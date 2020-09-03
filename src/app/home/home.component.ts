import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import {operationStatusInfo} from '../_models/operationStatusInfo';
import {User} from '../_models/user';
import {SignalRService} from '../_services/signalR.service';
import {HubConnectionState} from '@microsoft/signalr';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
	constructor(
    private serviceClient: SignalRService,
    private router: Router
	) {
	  
  }

  ngOnInit() {
	var user = JSON.parse(localStorage.currentUser);
	switch(user.accessLevel)
	{
		case 1:
			break;
		case 2:
			this.router.navigate(['/schedule']);
			break;
		case 3:
			this.router.navigate(['/modules']);
			break;
		case 4:
			this.router.navigate(['/students-control']);
			break;
		default:
			this.router.navigate(['/login']);
			break;
	}
  }
}