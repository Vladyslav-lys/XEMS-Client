import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
//import { StubService } from '../_services/stub.service';
import {Router} from '@angular/router';
import {SignalRService} from '../_services/signalR.service';
import {Authorization} from '../_models/authorization';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnChanges, DoCheck {
  
  authorization:any;
  
  constructor(
	private serviceClient: SignalRService,
    private authenticateService: AuthenticationService,
	//private stub:StubService,
    private router: Router
  ) { }
  
  ngOnChanges() {
  }

  ngOnInit(): void {
  }
  
  ngDoCheck(): void {
	if(localStorage.currentAuthorization != null)
	{
		this.authorization = JSON.parse(localStorage.currentAuthorization);
		return;
	}
	this.authorization = null;
  }
  
  logout() {
	  var th = this;
	  if(JSON.parse(localStorage.currentAuthorization)!= null)
	  {
		var authorization = JSON.parse(localStorage.currentAuthorization);
		
		this.authenticateService.logout(authorization[0])
	    .then(function (operationStatus: operationStatusInfo){
		  authorization = null;
        }).catch(function(err) {
          console.log("Error logging out");
          alert(err);
        }); 
	  }
  }
}
