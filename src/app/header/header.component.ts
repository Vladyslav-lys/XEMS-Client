import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service';
import { StubService } from '../_services/stub.service';
import {Router} from '@angular/router';
import {SignalRService} from '../_services/signalR.service';
import {User} from '../_models/user';
import { operationStatusInfo } from '../_models/operationStatusInfo';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnChanges, DoCheck {
  
  user:User;
  
  constructor(
	private serviceClient: SignalRService,
    private authenticateService: AuthenticationService,
	private stub:StubService,
    private router: Router
  ) { }
  
  ngOnChanges() {
  }

  ngOnInit(): void {
  }
  
  ngDoCheck(): void {
	  if(localStorage.currentUser != null)
		this.user = JSON.parse(localStorage.currentUser);
  }
  
  logout() {
	  var th = this;
	  if(JSON.parse(localStorage.currentUser)!= null)
	  {
		var user = JSON.parse(localStorage.currentUser);
		
		this.stub.logout(user.id)
	    .then(function (operationStatus: operationStatusInfo){
		  user = null;
        }).catch(function(err) {
          console.log("Error loading notes");
          alert(err);
        }); 
	  }
  }
}
