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
  
  isActive = false;

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
    this.currentStudent.birthday = new Date(this.currentStudent.birthday);
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllGroups();
	  await this.getActive()
    }
    else {
      setTimeout(async () => {
		  await this.getAllGroups();
		  await this.getActive()
		}, 500);
    }
	
    this.profileForm = this.formBuilder.group({
      lastName: [this.currentStudent.lastName, Validators.required],
      firstName: [this.currentStudent.firstName, Validators.required],
      birthday: [this.currentStudent.birthday, Validators.required],
	  phone: [this.currentStudent.phone, Validators.required],
	  address: [this.currentStudent.address, Validators.required],
	  group: [this.currentStudent.group]
    });
  }
  
  async getActive() {
    var th = this;
    
	await this.studentService.getActiveStudentById(this.currentStudentId)
	  .then(function (operationStatus: operationStatusInfo) {
		th.isActive = operationStatus.attachedObject;
      }).catch(function(err) {
        console.log("Error while fetching teachers");
        alert(err);
      });
  }
  
  async getAllGroups() {
    var th = this;
    
	await this.groupService.getAllGroups()
	  .then(function (operationStatusInfo: operationStatusInfo) {
		var groups = operationStatusInfo.attachedObject;
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

    var newStudent: Student;
    newStudent = this.currentStudent;

	if (this.profileForm.controls.active.value != null)
      this.isActive = this.profileForm.controls.active.value;

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
	  newStudent.group = this.getGroupById(id);
	}
    newStudent.modifyTime = new Date();

    var th = this;
	this.studentService.invokeUpdateAcitveStudentInfo(newStudent.id, this.isActive)
      .then(function (operationStatusInfo: operationStatusInfo) {
        if (operationStatusInfo.operationStatus == OperationStatus.Done) {
          var message = "Student info updated successfully";
          console.log(message);
          alert(message);
        }
        else {
          alert(operationStatusInfo.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while updating student info");
        alert(err);
      });
    
    this.studentService.invokeUpdateStudentInfo(newStudent)
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
        alert(err);
      });
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
    if (this.profileForm.controls.lastName.value.length > 0 && this.profileForm.controls.firstName.value.length > 0
	  && this.profileForm.controls.phone.value.length > 0 && this.profileForm.controls.birthday.value != null 
	  && this.profileForm.controls.address.value.length > 0 && this.profileForm.controls.group.value.length > 0)
      return true;
    return false;
  }
}