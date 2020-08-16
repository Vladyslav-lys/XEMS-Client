import { OnInit, Component, ViewChild, TemplateRef } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { NotifyService } from "../_services/notify.service";
import { Message } from "../_models/message";
import { StubService } from '../_services/stub.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(private toastrService: ToastrService,
    private notifySerivce: NotifyService,
	private stub:StubService,
  ) {
  }

  ngOnInit(){
	this.callNotificationEnteredText();
	this.callNotificationUnicastText();
  }

  callNotificationEnteredText() {
    this.stub.getNotifyEnteredText(this.toastrService);
  }
  
  callNotificationConnectedText() {
    this.stub.getNotifyConnectedText(this.toastrService);
  }
  
  callNotificationUnicastText() {
    this.stub.getNotifyUnicastText(this.toastrService);
  }
}
