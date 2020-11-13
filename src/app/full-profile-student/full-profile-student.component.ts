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
import { operationStatusInfo, OperationStatus } from '../_helpers/operationStatusInfo';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';

@Component({
  selector: 'app-full-profile-student',
  templateUrl: './full-profile-student.component.html',
  styleUrls: ['./full-profile-student.component.css']
})
export class FullProfileStudentComponent implements OnInit {
  profileForm: FormGroup;
  currentStudentId: number;
  currentStudent: Student;
  loading = false;
  submitted = false;
  
  groups: Group[];
  groups2: Group[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
	//private stub:StubService,
    private studentService: StudentService,
	private groupService: GroupService,
	private authenticationService: AuthenticationService,
	private serviceClient: SignalRService,
    private formBuilder: FormBuilder
  ) {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.route
            .queryParams
            .subscribe(params => {
              // Defaults to 0 if no query param provided.
              this.currentStudentId = +this.route.snapshot.paramMap.get('id');
              this.LoadStudentInfo(this.currentStudentId);
            });
        }
      });
  }

  async ngOnInit(): Promise<void> {
    //this.currentStudent.birthday = new Date(this.currentStudent.birthday);
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllGroups();
    }
    else {
      var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
		    await this.getAllGroups();
		  }
		}, 500);
    }
	
    this.profileForm = this.formBuilder.group({
      lastName: [this.currentStudent.lastName, Validators.required],
      firstName: [this.currentStudent.firstName, Validators.required],
      birthday: [this.currentStudent.birthday, Validators.required],
	  phone: [this.currentStudent.phone, Validators.required],
	  address: [this.currentStudent.address, Validators.required],
	  group: [this.currentStudent.group.id],
	  active: [this.currentStudent.authorization.isActive]
    });
  }
  
  async getAllGroups() {
    var th = this;
    
	await this.groupService.getAllGroups()
	  .then(function (operationStatusInfo: operationStatusInfo) {
		var groups = operationStatusInfo.attachedObject;
        th.groups = groups[0];
        sessionStorage.setItem("groups", JSON.stringify(th.groups));
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
      });
  }

  LoadStudentInfo(currentStudentId: number) {
    var th = this;
    var students = JSON.parse(sessionStorage.students);
    students.forEach(function (student: Student) {
      if (student.id == currentStudentId) {
        th.currentStudent = student;
      }
    });
  }

  EditStudent() {

    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;

    //var newStudent: Student;
    //newStudent = this.currentStudent;
	var newStudent: any;
	newStudent = {};
	
	/*if (this.profileForm.controls.active.value != null)
      newStudent.authorization.isActive = this.profileForm.controls.active.value;*/
	
	newStudent.id = this.currentStudent.id;
    if (this.profileForm.controls.lastName.value != null && this.profileForm.controls.lastName.value != this.currentStudent.lastName)
      newStudent.lastName = this.profileForm.controls.lastName.value;
    if (this.profileForm.controls.firstName.value != null && this.profileForm.controls.firstName.value != this.currentStudent.firstName)
      newStudent.firstName = this.profileForm.controls.firstName.value;
    if (this.profileForm.controls.birthday.value != null && this.profileForm.controls.birthday.value != this.currentStudent.birthday.split('T')[0])
      newStudent.birthday = this.profileForm.controls.birthday.value;
    if (this.profileForm.controls.phone.value != null && this.profileForm.controls.phone.value != this.currentStudent.phone)
      newStudent.phone = this.profileForm.controls.phone.value;
    if (this.profileForm.controls.address.value != null && this.profileForm.controls.address.value != this.currentStudent.address)
      newStudent.address = this.profileForm.controls.address.value;
    if (this.profileForm.controls.group.value != null && this.profileForm.controls.group.value != this.currentStudent.group.id)
	{
	  var id = this.profileForm.controls.group.value;
	  //newStudent.group = this.getGroupById(id);
	  newStudent.groupId = +id;
	}

    var th = this;
	console.log(newStudent);
	
	if(Object.keys(newStudent).length < 2 && this.profileForm.controls.active.value == this.currentStudent.authorization.isActive)
	{
		alert("Please, change any field");
        th.loading = false;
		return;
	}
	
	if(Object.keys(newStudent).length >= 2)
    this.studentService.invokeUpdateStudentInfo(newStudent, Object.keys(newStudent))
      .then(function (operationStatusInfo: operationStatusInfo) {
        if (operationStatusInfo.operationStatus == OperationStatus.Done) {
          var message = "Student info updated successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/students-control']);
        }
        else {
          alert(operationStatusInfo.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while updating student info");
        th.loading = false;
      });
	
	if(this.profileForm.controls.active.value == this.currentStudent.authorization.isActive)
	{
		th.loading = false;
		return;
	}
	
	if(!this.profileForm.controls.active.value)
	{
	  this.authenticationService.blockAuthorization(this.currentStudent.authorization.id)
	   .then(function (operationStatusInfo: operationStatusInfo) {
        if (operationStatusInfo.operationStatus == OperationStatus.Done) {
          var message = "Student blocked successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/students-control']);
        }
        else {
          alert(operationStatusInfo.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while blocking student");
        th.loading = false;
      });
	}
	else
	{
	 this.authenticationService.unblockAuthorization(this.currentStudent.authorization.id)
	  .then(function (operationStatusInfo: operationStatusInfo) {
        if (operationStatusInfo.operationStatus == OperationStatus.Done) {
          var message = "Student unblocked successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/students-control']);
        }
        else {
          alert(operationStatusInfo.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while unblocking student");
		alert(err);
        th.loading = false;
      });
	}
  }
  
  getGroupById(id)
  {
	for(let group of this.groups2)
	{
		if(group.id == id)
			return group;
	}
  }

  enableBtn(): boolean {
    if (!this.profileForm.invalid && (this.profileForm.controls.lastName.value != this.currentStudent.lastName
	|| this.profileForm.controls.firstName.value != this.currentStudent.firstName
	|| this.profileForm.controls.birthday.value != this.currentStudent.birthday
	|| this.profileForm.controls.phone.value != this.currentStudent.phone
	|| this.profileForm.controls.address.value != this.currentStudent.address
	|| this.profileForm.controls.group.value != this.currentStudent.group.id
	|| this.profileForm.controls.active.value != this.currentStudent.authorization.isActive))
      return true;
    return false;
  }
}