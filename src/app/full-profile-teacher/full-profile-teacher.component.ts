import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../_services/teacher.service';
import { AuthenticationService } from '../_services/authentication.service';
//import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { Teacher } from '../_models/teacher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo, OperationStatus } from '../_helpers/operationStatusInfo';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
	//private stub:StubService,
    private teacherService: TeacherService,
	private authenticationService: AuthenticationService,
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
    //this.currentTeacher.birthday = new Date(this.currentTeacher.birthday);

    this.profileForm = this.formBuilder.group({
      lastName: [this.currentTeacher.lastName, Validators.required],
      firstName: [this.currentTeacher.firstName, Validators.required],
      birthday: [this.currentTeacher.birthday, Validators.required],
	  phone: [this.currentTeacher.phone, Validators.required],
	  address: [this.currentTeacher.address, Validators.required],
	  active: [this.currentTeacher.authorization.isActive]
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
	
    //var newTeacher: Teacher;
    //newTeacher = this.currentTeacher;
	var newTeacher: any;
	newTeacher = {};
	
    //if (this.profileForm.controls.active.value != null)
    //  this.currentTeacher.authorization.isActive = this.profileForm.controls.active.value;
    
	newTeacher.id = this.currentTeacher.id;
    if (this.profileForm.controls.lastName.value != null && this.profileForm.controls.lastName.value != this.currentTeacher.lastName)
      newTeacher.lastName = this.profileForm.controls.lastName.value;
    if (this.profileForm.controls.firstName.value != null && this.profileForm.controls.firstName.value != this.currentTeacher.firstName)
      newTeacher.firstName = this.profileForm.controls.firstName.value;
    if (this.profileForm.controls.birthday.value != null && this.profileForm.controls.birthday.value != this.currentTeacher.birthday.split('T')[0])
      newTeacher.birthday = this.profileForm.controls.birthday.value;
    if (this.profileForm.controls.phone.value != null && this.profileForm.controls.phone.value != this.currentTeacher.phone)
      newTeacher.phone = this.profileForm.controls.phone.value;
    if (this.profileForm.controls.address.value != null && this.profileForm.controls.address.value != this.currentTeacher.address)
      newTeacher.address = this.profileForm.controls.address.value;

    var th = this;
	console.log(newTeacher);
	
	if(Object.keys(newTeacher).length < 2 && this.profileForm.controls.active.value == this.currentTeacher.authorization.isActive)
	{
		alert("Please, change any field");
        th.loading = false;
		return;
	}
	
	if(Object.keys(newTeacher).length >= 2)
    this.teacherService.invokeUpdateTeacherInfo(newTeacher, Object.keys(newTeacher))
      .then(function (operationStatus: operationStatusInfo) {
        if (operationStatus.operationStatus == OperationStatus.Done) {
          var message = "Teacher info updated successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/teachers-control']);
        }
        else {
          alert(operationStatus.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while updating teacher info");
        th.loading = false;
      });
	  
	if(this.profileForm.controls.active.value == this.currentTeacher.authorization.isActive)
	{
		th.loading = false;
		return;
	}
	
	if(!this.profileForm.controls.active.value)
	{
	  this.authenticationService.blockAuthorization(this.currentTeacher.authorization.id)
	   .then(function (operationStatusInfo: operationStatusInfo) {
        if (operationStatusInfo.operationStatus == OperationStatus.Done) {
          var message = "Teacher blocked successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/teachers-control']);
        }
        else {
          alert(operationStatusInfo.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while blocking Teacher");
        th.loading = false;
      });
	}
	else
	{
	 this.authenticationService.unblockAuthorization(this.currentTeacher.authorization.id)
	  .then(function (operationStatusInfo: operationStatusInfo) {
        if (operationStatusInfo.operationStatus == OperationStatus.Done) {
          var message = "Teacher unblocked successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/teachers-control']);
        }
        else {
          alert(operationStatusInfo.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while unblocking teacher");
        th.loading = false;
      });
	}
  }

  enableBtn(): boolean {
    if (!this.profileForm.invalid && (this.profileForm.controls.lastName.value != this.currentTeacher.lastName
	|| this.profileForm.controls.firstName.value != this.currentTeacher.firstName
	|| this.profileForm.controls.birthday.value != this.currentTeacher.birthday.split('T')[0]
	|| this.profileForm.controls.phone.value != this.currentTeacher.phone
	|| this.profileForm.controls.address.value != this.currentTeacher.address
	|| this.profileForm.controls.active.value != this.currentTeacher.authorization.isActive))
      return true;
    return false;
  }
}