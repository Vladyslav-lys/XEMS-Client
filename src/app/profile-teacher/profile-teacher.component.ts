import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../_services/teacher.service';
import { AuthenticationService } from '../_services/authentication.service';
import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { Teacher } from '../_models/teacher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo, OperationStatus } from '../_helpers/operationStatusInfo';

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
	this.teacherService.getTeacherByAuthId(currentAuth[0])
				.then(function (operationStatus : operationStatusInfo){
					if (operationStatus.operationStatus == OperationStatus.Done) {
						th.currentTeacher = operationStatus.attachedObject;
		
						th.currentTeacher.birthday = new Date(th1.currentTeacher.birthday);
	
						th.profileForm = th.formBuilder.group({
							login: [th.currentAuth.login, Validators.required],
							password: [th.currentAuth.password, Validators.required],
							lastName: [th.currentTeacher.lastName, Validators.required],
							firstName: [th.currentTeacher.firstName, Validators.required],
							birthday: [th.currentTeacher.birthday, Validators.required],
							phone: [th.currentTeacher.phone, Validators.required],
							address: [th.currentTeacher.address, Validators.required]
						});
					}
				}).catch(err => {
					console.log(err);
					th.alertService.error(err.toString());
					th.loading = false;
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
    
	newTeacher.authorization = newAuthorization;
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