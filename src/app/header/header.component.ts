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
export class HeaderComponent implements OnInit {
  
  constructor(
	private serviceClient: SignalRService,
    public authenticateService: AuthenticationService,
	//private stub:StubService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  
  logout() {
	  var th = this;
	  if(this.authenticateService.getAuth())
	  {
		this.authenticateService.logout()
	    .then(function (operationStatus: operationStatusInfo){
		  th.authenticateService.removeAuth();
		  th.authenticateService.removeAccessAdmin();
		  th.authenticateService.removeAccessTeacher();
		  th.authenticateService.removeAccessStudent();
		  localStorage.removeItem('currentAuthentication');
		  th.router.navigate(['/login']);
        }).catch(function(err) {
          console.log("Error logging out");
        }); 
	  }
  }
}
