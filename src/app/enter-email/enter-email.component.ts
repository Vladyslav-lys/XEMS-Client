import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo, OperationStatus } from '../_helpers/operationStatusInfo';
import { AccessLevel } from '../_enums/accessLevel';

@Component({
  selector: 'app-enter-email',
  templateUrl: './enter-email.component.html',
  styleUrls: ['./enter-email.component.css']
})
export class EnterEmailComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private router: Router,
	private authenticationService: AuthenticationService,
	//private stub:StubService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    //this.user.account.birthday = new Date(this.user.account.birthday);

    this.registerForm = this.formBuilder.group({
      email: ["", Validators.required]
    });
  }

  SendEMail() {

    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
	
	var email: any;
	email = {};
	
	email.id = id;
    if (this.registerForm.controls.email.value != null)
		email.text = this.registerForm.controls.email.value;

    var th = this;
	this.authenticationService.sendEmail(email)
	  .then(function (operationStatus: operationStatusInfo) {
		if(operationStatus.operationStatus == OperationStatus.Done)
		{
			var message = "We send a temporary password to your e-mail";
			console.log(message);
			alert(message);
			th.router.navigate(['/login']);
		}
		else
		{
			console.log(operationStatus.attachedInfo);
			alert(operationStatus.attachedInfo);
			th.loading = false;
		}
      }).catch(function(err) {
        console.log("Error while adding email");
		alert(err);
	    th.loading = false;
      });
  }

  enableBtn(): boolean {
    if (this.registerForm.controls.email.value.length > 0)
      return true;
    return false;
  }
}