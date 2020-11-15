import { OnInit, Component, ViewChild, TemplateRef } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { NotifyService } from "../_services/notify.service";
import {AuthenticationService} from '../_services/authentication.service';
import { Message } from "../_models/message";
//import { StubService } from '../_services/stub.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(private toastrService: ToastrService,
	private authenticationService: AuthenticationService,
    private notifySerivce: NotifyService,
	//private stub:StubService,
  ) {
  }

  ngOnInit(){
	this.callNotificationUnicastText();
	this.callNotificationEnteredText();
	this.callNotificationEnteredStudentsText();
  }

  callNotificationEnteredText() {
    this.notifySerivce.getNotifyEnteredText(this.toastrService);
  }
  
  callNotificationEnteredStudentsText() {
    this.notifySerivce.getNotifyEnteredStudentsText(this.toastrService);
  }
  
  callNotificationConnectedText() {
    this.notifySerivce.getNotifyConnectedText(this.toastrService);
  }
  
  callNotificationUnicastText() {
    this.notifySerivce.getNotifyUnicastText(this.toastrService);
  }
}
