import { Component, OnInit } from '@angular/core';
import { StudentService } from '../_services/student.service';
import { TeacherService } from '../_services/teacher.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { Student } from '../_models/student';
import { Teacher } from '../_models/teacher';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';
import { NotifyService } from '../_services/notify.service';
import { Message } from '../_models/message';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';
import { AccessLevel } from '../_enums/accessLevel';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  messageText: string;
  notifyForm: FormGroup;

  students: Student[];
  students2: Student[];
  
  teacher:Teacher;

  constructor(
    private router: Router,
    private studentService: StudentService,
	private teacherService: TeacherService,
	//private stub:StubService,
	private serviceClient: SignalRService,
    private notifySerivce: NotifyService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void>  {
	  
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
		await this.getTeacher();
	  await this.getAllStudents();
    }
    else {
		var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
			  await this.getTeacher();
		    await this.getAllStudents();
		  }
		}, 500);
    };
	
    this.notifyForm = this.formBuilder.group({
      messageText: [this.messageText],
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
  
  async getTeacher() {
    var th = this;
    var auth = JSON.parse(localStorage.currentAuthentication);
	var teacher;
    await this.teacherService.getTeacherByAuthId(auth[0])
	  .then(function (operationStatus: operationStatusInfo) {
		var teacher1 = operationStatus.attachedObject;
		th.teacher = teacher1[0];
      }).catch(function(err) {
        console.log("Error while fetching working plans");
        alert(err);
      });
  }

  async getAllStudents() {
    var th = this;
    
	await this.studentService.getAllStudents()
	  .then(function (operationStatus: operationStatusInfo) {
		var students = operationStatus.attachedObject;
        th.students = students[0];
        sessionStorage.setItem("students", JSON.stringify(th.students));
        th.students2 = JSON.parse(sessionStorage.students).map(i => ({
          idx: i,
          id: i.id,
          firstName: i.firstName,
		  lastName: i.lastName,
		  birthday: i.birthday,
		  phone: i.phone,
		  address: i.address,
		  group: i.group
        }));
      }).catch(function(err) {
        console.log("Error while fetching students");
      });
  }

  sendNotifyAllText() {
    var th = this;

    var message: Message;
    message = new Message();
    message.senderName = this.teacher.lastName + " " + this.teacher.firstName;
    message.text = this.notifyForm.controls.messageText.value;
	
	this.notifySerivce.sendNotifyAllEnteredStudentsText(message)
	  .then(function (operationStatus: operationStatusInfo) {
		console.log("Message is sent:" + th.notifyForm.controls.messageText.value);
        th.messageText = "";
        th.notifyForm.controls.messageText.reset();
      }).catch(function(err) {
        console.log(err);
        alert(err);
      });
  }
  
  sendNotifyOneText(student, txt) {
    var th = this;

    var message: Message;
    message = new Message();
    message.senderName = this.teacher.lastName + " " + this.teacher.firstName;
    message.text = txt;
	
	this.notifySerivce.sendNotifyOneText(student.id, message)
	  .then(function (operationStatus: operationStatusInfo) {
		console.log("Message is sent:" + txt);
        th.messageText = "";
        th.notifyForm.controls.messageText.reset();
      }).catch(function(err) {
        console.log(err);
        alert(err);
      });
  }
}