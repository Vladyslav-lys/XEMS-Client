import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../_services/teacher.service';
import { AuthenticationService } from '../_services/authentication.service';
import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { Teacher } from '../_models/teacher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';

@Component({
  selector: 'app-profile-teacher',
  templateUrl: './profile-teacher.component.html',
  styleUrls: ['./profile-teacher.component.css']
})
export class FullProfileTeacherComponent implements OnInit {
  profileForm: FormGroup;
  currentTeacher: Teacher;
  loading = false;
  submitted = false;
  
  currentAuth: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
	private stub:StubService,
    private teacherService: TeacherService,
	private authenticationService: AuthorizationService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void> {
    var currentAuth = JSON.parse(localStorage.currentAuthentication);
	
	var th = this;
	this.authenticationService.getAuthorizationById(currentAuth[0])
	  .then(function (operationStatus : operationStatusInfo){
		if (operationStatus.operationStatus == operationStatus.Done) {
			th.currentAuth = operationStatus.attachedObject;
			
			var th1 = th;
			th.teacherService.getTeacherByAuthId(th.currentAuth.id])
				.then(function (operationStatus : operationStatusInfo){
					if (operationStatus.operationStatus == operationStatus.Done) {
						th1.currentTeacher = operationStatus.attachedObject;
		
						th1.currentTeacher.birthday = new Date(th1.currentTeacher.birthday);
	
						th1.profileForm = th1.formBuilder.group({
							login: [th1.currentAuth.login, Validators.required],
							password: [th1.currentAuth.password, Validators.required],
							lastName: [th1.currentTeacher.lastName, Validators.required],
							firstName: [th1.currentTeacher.firstName, Validators.required],
							birthday: [th1.currentTeacher.birthday, Validators.required],
							phone: [th1.currentTeacher.phone, Validators.required],
							address: [th1.currentTeacher.address, Validators.required]
						});
					}
				}).catch(err => {
					console.log(err);
					th.alertService.error(err.toString());
					th.loading = false;
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
    var newTeacher: Teacher;
    newTeacher = this.currentTeacher;
	
	if (this.profileForm.controls.login.value != null)
      newAuthorization.login = this.profileForm.controls.login.value;
    if (this.profileForm.controls.password.value != null)
      newAuthorization.password = this.profileForm.controls.password.value;
    
    if (this.profileForm.controls.lastName.value != null)
      newTeacher.lastName = this.profileForm.controls.lastName.value;
    if (this.profileForm.controls.firstName.value != null)
      newTeacher.firstName = this.profileForm.controls.firstName.value;
    if (this.profileForm.controls.birthday.value != null)
      newTeacher.birthday = this.profileForm.controls.birthday.value;
    if (this.profileForm.controls.phone.value != null)
      newTeacher.phone = this.profileForm.controls.phone.value;
    if (this.profileForm.controls.address.value != null)
      newTeacher.address = this.profileForm.controls.address.value;
    newTeacher.modifyTime = new Date();

    var th = this;
	this.authenticationService.invokeUpdateAuthorizationInfo(newAuthorization)
      .then(function (operationStatus: operationStatusInfo) {
        if (operationStatus.operationStatus == operationStatus.Done) {
          var message = "Admin info updated successfully";
          console.log(message);
          alert(message);
        }
      }).catch(function (err) {
        console.log("Error while updating admin info");
        alert(err);
      });
    this.teacherService.invokeUpdateTeacherInfo(newTeacher)
      .then(function (operationStatus: operationStatusInfo) {
        if (operationStatus.operationStatus == operationStatus.Done) {
          var message = "Teacher info updated successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/home']);
        }
        else {
          alert(operationStatus.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while updating teacher info");
        alert(err);
      });
  }

  enableBtn(): boolean {
    if (this.profileForm.controls.login.value.length > 0 && this.profileForm.controls.password.value.length > 0 
	  && this.profileForm.controls.lastName.value.length > 0 && this.profileForm.controls.firstName.value.length > 0
	  && this.profileForm.controls.phone.value.length > 0 && this.profileForm.controls.birthday.value != null 
	  && this.profileForm.controls.address.value.length > 0)
      return true;
    return false;
  }
}