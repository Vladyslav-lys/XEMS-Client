import { Component, OnInit } from '@angular/core';
import { StudentService } from '../_services/student.service';
import { AuthenticationService } from '../_services/authentication.service';
import { GroupService } from '../_services/group.service';
//import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { Student } from '../_models/student';
import { Group } from '../_models/group';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';

@Component({
  selector: 'app-profile-student',
  templateUrl: './profile-student.component.html',
  styleUrls: ['./profile-student.component.css']
})
export class FullProfileStudentComponent implements OnInit {
  profileForm: FormGroup;
  currentStudent: Student;
  loading = false;
  submitted = false;
  
  currentAuth: any;
  groups: Group[];
  groups2: Group[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
	//private stub:StubService,
    private studentService: StudentService,
	private groupService: GroupService,
	private authenticationService: AuthorizationService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void> {
	var currentAuth = JSON.parse(localStorage.currentAuthentication);
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllGroups();
    }
    else {
      setTimeout(async () => {
		  await this.getAllGroups();
		}, 500);
    }
	
	var th = this;
	this.authenticationService.getAuthorizationById(currentAuth[0])
	  .then(function (operationStatus : operationStatusInfo){
		if (operationStatus.operationStatus == operationStatus.Done) {
			th.currentAuth = operationStatus.attachedObject;
			
			var th1 = th;
			th.studentService.getStudentByAuthId(th.currentAuth.id])
				.then(function (operationStatus : operationStatusInfo){
					if (operationStatus.operationStatus == operationStatus.Done) {
						th1.currentStudent = operationStatus.attachedObject;
		
						th1.currentStudent.birthday = new Date(th1.currentStudent.birthday);
	
						th1.profileForm = th1.formBuilder.group({
							login: [th1.currentAuth.login, Validators.required],
							password: [th1.currentAuth.password, Validators.required],
							lastName: [th1.currentStudent.lastName, Validators.required],
							firstName: [th1.currentStudent.firstName, Validators.required],
							birthday: [th1.currentStudent.birthday, Validators.required],
							phone: [th1.currentStudent.phone, Validators.required],
							address: [th1.currentStudent.address, Validators.required],
							group: [th1.currentStudent.group.id]
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
  
  async getAllGroups() {
    var th = this;
    
	await this.groupService.getAllGroups()
	  .then(function (operationStatus: operationStatusInfo) {
		var groups = operationStatus.attachedObject;
        th.groups = groups;
        sessionStorage.setItem("groups", JSON.stringify(groups));
        th.groups2 = JSON.parse(sessionStorage.groups).map(i => ({
          idx: i,
          id: i.id,
		  name: i.name,
		  curator: i.curator,
		  learningStartDate: i.learningStartDate,
		  learningEndDate: i.learningEndDate,
		  degree: i.degree
        }));
      }).catch(function(err) {
        console.log("Error while fetching groups");
        alert(err);
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
    var newStudent: Student;
    newStudent = this.currentStudent;
	
	if (this.profileForm.controls.login.value != null)
      newAuthorization.login = this.profileForm.controls.login.value;
    if (this.profileForm.controls.password.value != null)
      newAuthorization.password = this.profileForm.controls.password.value;

    if (this.profileForm.controls.lastName.value != null)
      newStudent.lastName = this.profileForm.controls.lastName.value;
    if (this.profileForm.controls.firstName.value != null)
      newStudent.firstName = this.profileForm.controls.firstName.value;
    if (this.profileForm.controls.birthday.value != null)
      newStudent.birthday = this.profileForm.controls.birthday.value;
    if (this.profileForm.controls.phone.value != null)
      newStudent.phone = this.profileForm.controls.phone.value;
    if (this.profileForm.controls.address.value != null)
      newStudent.address = this.profileForm.controls.address.value;
    if (this.profileForm.controls.group.value != null)
	{
	  var id = this.profileForm.controls.group.value;
	  newStudent.group = this.stub.getGroupById(id);
	}
    newStudent.modifyTime = new Date();

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
    this.studentService.invokeUpdateStudentInfo(newStudent)
      .then(function (operationStatus: operationStatusInfo) {
        if (operationStatus.operationStatus == operationStatus.Done) {
          var message = "Student info updated successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/home']);
        }
        else {
          alert(operationStatus.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while updating student info");
        alert(err);
      });
  }

  enableBtn(): boolean {
    if (this.profileForm.controls.login.value.length > 0 && this.profileForm.controls.password.value.length > 0
	  && this.profileForm.controls.lastName.value.length > 0 && this.profileForm.controls.firstName.value.length > 0
	  && this.profileForm.controls.phone.value.length > 0 && this.profileForm.controls.birthday.value != null 
	  && this.profileForm.controls.address.value.length > 0 && this.profileForm.controls.group.value.length > 0)
      return true;
    return false;
  }
}