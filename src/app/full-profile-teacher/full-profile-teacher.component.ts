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
  selector: 'app-full-profile-teacher',
  templateUrl: './full-profile-teacher.component.html',
  styleUrls: ['./full-profile-teacher.component.css']
})
export class FullProfileTeacherComponent implements OnInit {
  profileForm: FormGroup;
  currentTeacherId: number;
  currentTeacher: Teacher;
  loading = false;
  submitted = false;
  
  isActive = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
	private stub:StubService,
    private teacherService: TeacherService,
	private authenticationService: AuthorizationService,
    private formBuilder: FormBuilder
  ) {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.route
            .queryParams
            .subscribe(params => {
              // Defaults to 0 if no query param provided.
              this.currentTeacherId = +this.route.snapshot.paramMap.get('id');
              this.LoadTeacherInfo(this.currentTeacherId);
            });
        }
      });
  }

  async ngOnInit(): Promise<void> {
    this.currentTeacher.birthday = new Date(this.currentTeacher.birthday);
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getActive()
    }
    else {
      setTimeout(async () => {
		  await this.getActive()
		}, 500);
    }

    this.profileForm = this.formBuilder.group({
	  /*login: [this.currentTeacher.login, Validators.required],
      password: [this.currentTeacher.password, Validators.required],*/
      lastName: [this.currentTeacher.lastName, Validators.required],
      firstName: [this.currentTeacher.firstName, Validators.required],
      birthday: [this.currentTeacher.birthday, Validators.required],
	  phone: [this.currentTeacher.phone, Validators.required],
	  address: [this.currentTeacher.address, Validators.required]
    });
  }
  
  async getActive() {
    var th = this;
    
	await this.teacherService.getActiveTeacherById(this.currentTeacherId)
	  .then(function (operationStatus: operationStatusInfo) {
		th.isActive = operationStatus.attachedObject;
      }).catch(function(err) {
        console.log("Error while fetching teachers");
        alert(err);
      });
  }

  LoadTeacherInfo(currentTeacherId: number) {
    var th = this;
    var teachers = JSON.parse(sessionStorage.teachers);
    teachers.forEach(function (teacher: Teacher) {
      if (teacher.id == currentTeacherId) {
        th.currentTeacher = teacher;
      }
    });
  }

  EditProfile() {

    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
	
    var newTeacher: Teacher;
    newTeacher = this.currentTeacher;
	
	/*if (this.profileForm.controls.login.value != null)
      newAuthorization.login = this.profileForm.controls.login.value;
    if (this.profileForm.controls.password.value != null)
      newAuthorization.password = this.profileForm.controls.password.value;
	if (this.profileForm.controls.accessLevel.value != null)
      newAuthorization.accessLevel = this.profileForm.controls.accessLevel.value;*/
    if (this.profileForm.controls.active.value != null)
      this.isActive = this.profileForm.controls.active.value;
    
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
	this.teacherService.invokeUpdateAcitveTeacherInfo(newTeacher.id, this.isActive)
      .then(function (operationStatus: operationStatusInfo) {
        if (operationStatus.operationStatus == operationStatus.Done) {
          var message = "Teacher info updated successfully";
          console.log(message);
          alert(message);
        }
        else {
          alert(operationStatus.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while updating teacher info");
        alert(err);
      });
	  
    this.teacherService.invokeUpdateTeacherInfo(newTeacher)
      .then(function (operationStatus: operationStatusInfo) {
        if (operationStatus.operationStatus == operationStatus.Done) {
          var message = "Teacher info updated successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/teacher-control']);
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
    if (/*this.profileForm.controls.login.value.length > 0 && this.profileForm.controls.password.value.length > 0 
	  && */this.profileForm.controls.lastName.value.length > 0 && this.profileForm.controls.firstName.value.length > 0
	  && this.profileForm.controls.phone.value.length > 0 && this.profileForm.controls.birthday.value != null 
	  && this.profileForm.controls.address.value.length > 0)
      return true;
    return false;
  }
}