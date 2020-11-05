import { Component, OnInit } from '@angular/core';
import { StudentService } from '../_services/student.service';
import { AuthenticationService } from '../_services/authentication.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';
import { NotifyService } from '../_services/notify.service';
import { Message } from '../_models/message';
import { Group } from '../_models/group';
import { Student } from '../_models/student';
import { AccessLevel } from '../_enums/accessLevel';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';

@Component({
  selector: 'app-students-control',
  templateUrl: './students-control.component.html',
  styleUrls: ['./students-control.component.css']
})
export class StudentsControlComponent implements OnInit {

  messageText: string;
  notifyForm: FormGroup;

  students: Student[];
  students2: Student[];
  
  isActives: boolean[];

  constructor(
    private router: Router,
    private studentService: StudentService,
	private authenticationService: AuthenticationService,
	//private stub:StubService,
	private serviceClient: SignalRService,
    private notifySerivce: NotifyService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void>{
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getActiveAsync();
	  await this.getAllStudents();
    }
    else {
      setTimeout(async () => {
		  await this.getActiveAsync();
		  await this.getAllStudents();
		}, 500);
    }
	
	this.notifyForm = this.formBuilder.group({
      messageText: [this.messageText],
    });
  }
  
  async getActiveAsync() {
    var th = this;
    
	await this.authenticationService.getAllActives(AccessLevel.Teacher)
	  .then(function (operationStatus: operationStatusInfo) {
		th.isActives = operationStatus.attachedObject;
      }).catch(function(err) {
        console.log("Error while fetching students");
        alert(err);
      });
  }

  async getAllStudents() {
    var th = this;
    
	await this.studentService.getAllStudents()
	  .then(function (operationStatus: operationStatusInfo) {
		var students = operationStatus.attachedObject;
        th.students = students;
        sessionStorage.setItem("students", JSON.stringify(students));
        th.students2 = JSON.parse(sessionStorage.students).map(i => ({
          idx: i,
          id: i.id,
          firstName: i.firstName,
		  lastName: i.lastName,
		  birthday: i.birthday,
		  phone: i.phone,
		  address: i.address,
		  group: i.group,
		  createTime: i.createTime,
		  modifyTime: i.modifyTime
        }));
      }).catch(function(err) {
        console.log("Error while fetching students");
        alert(err);
      });
  }

  getAccessLevel(accessLevel) {
    var s = "";

    switch (accessLevel) {
      case AccessLevel.Student:
        s = "Student";
        break;
      case AccessLevel.Teacher:
        s = "Teacher";
        break;
      case AccessLevel.Admin:
        s = "Administrator";
        break;
    }

    return s;
  }

  getActive(isActive) {
    var s = "";

    switch (isActive) {
      case true:
        s = "Active";
        break;
      case false:
        s = "Banned";
        break;
    }

    return s;
  }

  openEdit(student) {
    this.router.navigate(['/full-profile-student/:id']);
  }

  deleteStudent(student) {
    var th = this;
	this.studentService.deleteStudentAuthorization(student.id)
	  .then(function (operationStatus: operationStatusInfo) {
		console.log(operationStatus.attachedObject);
        if (!JSON.stringify(operationStatus.operationStatus))
          window.location.reload();
      }).catch(function(err) {
        console.log("Error while deleting the student");
        alert(err);
      });
	this.studentService.deleteStudent(student.id)
	  .then(function (operationStatus: operationStatusInfo) {
		console.log(operationStatus.attachedObject);
        if (!JSON.stringify(operationStatus.operationStatus))
          window.location.reload();
      }).catch(function(err) {
        console.log("Error while deleting the student");
        alert(err);
      });
  }

  openAdd() {
    this.router.navigate(['/register-student']);
  }
  
  sendNotifyAllText() {
    var th = this;

    var message: Message;
    message = new Message();
    message.senderName = this.getAccessLevel(AccessLevel.Admin);
    message.text = this.notifyForm.controls.messageText.value;
	
	this.notifySerivce.sendNotifyAllEnteredText(message)
	  .then(function (operationStatus: operationStatusInfo) {
		console.log("Message is sent:" + th.notifyForm.controls.messageText.value);
        th.messageText = "";
        th.notifyForm.controls.messageText.reset();
      }).catch(function(err) {
        console.log(err);
        alert(err);
      });
  }
}