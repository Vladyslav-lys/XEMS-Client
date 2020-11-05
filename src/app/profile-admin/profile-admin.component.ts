import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { Teacher } from '../_models/teacher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';

@Component({
  selector: 'app-profile-admin',
  templateUrl: './profile-admin.component.html',
  styleUrls: ['./profile-admin.component.css']
})
export class ProfileAdminComponent implements OnInit {
  profileForm: FormGroup;
  currentAuth: any;
  loading = false;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
	private stub:StubService,
    private authenticationService: AuthorizationService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
	var currentAuth = JSON.parse(localStorage.currentAuthentication);
	
	var th = this;
	this.authenticationService.getAuthorizationById(currentAuth[0])
	  .then(function (operationStatus : operationStatusInfo){
		if (operationStatus.operationStatus == operationStatus.Done) {
			th.currentAuth = operationStatus.attachedObject;
		
			th.profileForm = th.formBuilder.group({
				login: [th.currentAuth.login, Validators.required],
				password: [th.currentAuth.password, Validators.required]
			});
		}
    }).catch(err => {
      console.log(err);
      this.alertService.error(err.toString());
      this.loading = false;
    }); 
  }

  EditProfile() {

    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
	
    var newAuthorization: Authorization;
    newAuthorization = this.currentAuth;
	
	if (this.profileForm.controls.login.value != null)
      newAuthorization.login = this.profileForm.controls.login.value;
    if (this.profileForm.controls.password.value != null)
      newAuthorization.password = this.profileForm.controls.password.value;

    var th = this;
    this.authenticationService.invokeUpdateAuthorizationInfo(newAuthorization)
      .then(function (operationStatus: operationStatusInfo) {
        if (operationStatus.operationStatus == operationStatus.Done) {
          var message = "Admin info updated successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/home']);
        }
        else {
          alert(operationStatus.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while updating admin info");
        alert(err);
      });
  }

  enableBtn(): boolean {
    if (this.profileForm.controls.login.value.length > 0 && this.profileForm.controls.password.value.length > 0)
      return true;
    return false;
  }
}