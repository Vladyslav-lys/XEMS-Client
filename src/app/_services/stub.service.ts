import { Injectable } from '@angular/core';
import { SignalRService } from './signalR.service';
import {Router} from '@angular/router';
import { operationStatusInfo } from '../_models/operationStatusInfo';
import { Account } from '../_models/accounts';
import { User } from '../_models/user';
import { Student } from '../_models/student';
import { Teacher } from '../_models/teacher';
import { Group } from '../_models/group';
import { Subject } from '../_models/subject';
import { ToastrService } from 'ngx-toastr';
import { Message } from "../_models/message";

@Injectable({ providedIn: 'root' })
export class StubService {
    user:User;
	
	users:Array<User>;
	students:Array<User>;
	teachers:Array<User>;
	subjects:Array<Subject>;
	groups:Array<Group>;
	
    constructor(
	  private router: Router
    ) {
		//localStorage.clear();
		this.users = new Array<User>();
		if(sessionStorage.users != null)
			this.users = JSON.parse(sessionStorage.users);
		this.students = new Array<User>();
		if(sessionStorage.students != null)
			this.students = JSON.parse(sessionStorage.students);
		this.teachers = new Array<User>();
		if(sessionStorage.teachers != null)
			this.teachers = JSON.parse(sessionStorage.teachers);
		this.subjects = new Array<Subject>();
		if(sessionStorage.subjects != null)
			this.subjects = JSON.parse(sessionStorage.subjects);
		this.groups = new Array<Group>();
		if(sessionStorage.groups != null)
			this.groups = JSON.parse(sessionStorage.groups);
		
		if(localStorage.currentUser != null)
			this.user = JSON.parse(localStorage.currentUser);
		
		if(this.subjects == null || this.subjects === undefined || this.subjects.length < 1)
		{
			this.subjects = new Array<Subject>();
			
			let subject1 = new Subject();
			subject1.id = 1;
			subject1.name = "Math";
			this.subjects.push(subject1);
			
			let subject2 = new Subject();
			subject2.id = 2;
			subject2.name = "Physics";
			this.subjects.push(subject2);
		}
		
		if(this.users == null || this.users === undefined || this.users.length < 1)
		{
			this.students = new Array<User>();
			this.teachers = new Array<User>();
			this.groups = new Array<Group>();
			
			let group1 = new Group();
			group1.id = 1;
			group1.name = "KI-19m-1";
			this.groups.push(group1);
			
			let group2 = new Group();
			group2.id = 2;
			group2.name = "KI-19m-2";
			this.groups.push(group2);
			
		let account1 = new Account();
		account1.id = 1;
		account1.createTime = new Date();
		account1.modifyTime = new Date();
		account1.photo = null;
		account1.firstName = "Vlad";
		account1.lastName = "Lys";
		account1.nickname = "Nick";
		account1.birthday = new Date();
		account1.email = "v@gmail.com";
		let user1 = new User();
		user1.id = 1;
		user1.account = account1;
		user1.login = "admin";
		user1.password = "admin";
		user1.isActive = true;
		user1.accessLevel = 4;
		this.users.push(user1);
		
		let account2 = new Teacher();
		account2.id = 1;
		account2.firstName = "Alex";
		account2.lastName = "Volkov";
		account2.secondName = "Urievich";
		account2.birthday = new Date();
		account2.phone = "+380982281488";
		account2.address = "pr. Heroev, 7";
		account2.rank = "Dotsent";
		account2.photo = null;
		account2.group = group1;
		account2.createTime = new Date();
		account2.modifyTime = new Date();
		let user2 = new User();
		user2.id = 2;
		user2.account = account2;
		user2.login = "log";
		user2.password = "pass";
		user2.isActive = true;
		user2.accessLevel = 3;
		this.users.push(user2);
		this.teachers.push(user2);
		
		let account3 = new Student();
		account3.id = 1;
		account3.firstName = "Uri";
		account3.lastName = "Gorbachov";
		account3.secondName = "Urievich";
		account3.birthday = new Date();
		account3.phone = "+380666666666";
		account3.address = "ul. Vichka, 7";
		account3.photo = null;
		account3.group = group1;
		account3.createTime = new Date();
		account3.modifyTime = new Date();
		let user3 = new User();
		user3.id = 3;
		user3.account = account3;
		user3.login = "gorb";
		user3.password = "gorb";
		user3.isActive = true;
		user3.accessLevel = 2;
		this.users.push(user3);
		this.students.push(user3);
		
		let account4 = new Student();
		account4.id = 2;
		account4.firstName = "Kiril";
		account4.lastName = "Petrov";
		account4.secondName = "Urievich";
		account4.birthday = new Date();
		account4.phone = "+380777777777";
		account4.address = "ul. Bogdana, 1";
		account4.photo = null;
		account4.group = group2;
		account4.createTime = new Date();
		account4.modifyTime = new Date();
		let user4 = new User();
		user4.id = 4;
		user4.account = account4;
		user4.login = "kir";
		user4.password = "petr";
		user4.isActive = true;
		user4.accessLevel = 2;
		this.users.push(user4);
		this.students.push(user4);
		console.log(this.students);
		}
    }

    login(username, password) {
      var th = this;
	  var user = new User();
        return new Promise(function (resolve, reject) {
		  
		  for(var i in th.users)
		  {
			  if(th.users[i].login == username && th.users[i].password == password)
			  {
				  th.user = th.users[i];
				  break;
			  }				  
		  }
		  
		  var operationStatus = new operationStatusInfo();
		  operationStatus.operationStatus = 1;
		  operationStatus.attachedObject = th.user;
		  operationStatus.attachedInfo = "";
		  
		  resolve(operationStatus);
      });
    }

    logout(id) {
	  localStorage.clear();
	  this.router.navigate(['/login']);
	
	  return new Promise(function (resolve, reject) {
		var operationStatus = null;
        resolve(operationStatus);
      });
    }
	
  invokeUpdateAccountInfo(user) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		th.invokeUpdateInfoInArray(user);
		
		if(th.user.id == user.id)
		{
			th.user = user;
		}
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = user;
		operationStatus.attachedInfo = "";
		
		resolve(operationStatus);
    });
  }
  
  invokeUpdateTeacherInfo(user) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		th.invokeUpdateInfoInArray(user);
		
		for(var i in th.teachers)
		{
			if(th.teachers[i].id == user.id)
			{
				th.teachers[i] = user;
				break;
			}
		}
		
		sessionStorage.setItem("teachers", JSON.stringify(th.teachers));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = user;
		operationStatus.attachedInfo = "";
		
		resolve(operationStatus);
    });
  }
  
  invokeUpdateStudentInfo(user) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		th.invokeUpdateInfoInArray(user);
		
		for(var i in th.students)
		{
			if(th.students[i].id == user.id)
			{
				th.students[i] = user;
				break;
			}
		}
		
		sessionStorage.setItem("students", JSON.stringify(th.students));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = user;
		operationStatus.attachedInfo = "";
		
		resolve(operationStatus);
    });
  }
  
  invokeUpdateSubjectInfo(subject) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		for(var i in th.subjects)
		{
			if(th.subjects[i].id == subject.id)
			{
				th.subjects[i] = subject;
				break;
			}
		}
		
		sessionStorage.setItem("subjects", JSON.stringify(th.subjects));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = subject;
		operationStatus.attachedInfo = "";
		
		resolve(operationStatus);
    });
  }
  
  private invokeUpdateInfoInArray(user)
  {
	for(var i in this.users)
	{
		if(this.users[i].id == user.id)
		{
			this.users[i] = user;
			break;
		}
	}
		
	sessionStorage.setItem("users", JSON.stringify(this.users));  
  }
  
  getAllUsers() {
	  var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = th.users;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });
  }
  
  getAllStudents() {
	  var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = th.students;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });
  }
  
  getAllTeachers() {
	  var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = th.teachers;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });
  }
  
  getAllSubjects() {
	  var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = th.subjects;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });
  }
  
  getAllGroups() {
	var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = th.groups;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });
  }
  
  getGroupById(id)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		var group = new Group();
		for(var i in th.groups)
		{
			if(th.groups[i].id == id)
			{
				group = th.groups[i];
			}
		}			
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = group;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });  
  }
  
  addUser(user) {
	  var th = this;
    return new Promise(function (resolve, reject) {
		th.addUserToArray(user);
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = th.users[th.users.length-1];
		operationStatus.attachedInfo = "";
		
	  resolve(operationStatus);
    });
  }
  
  addStudent(user)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		th.addUserToArray(user);
		th.students.push(user);
		
		sessionStorage.setItem("students", JSON.stringify(th.students));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = th.students[th.students.length-1];
		operationStatus.attachedInfo = "";
		
	  resolve(operationStatus);
    });  
  }
  
  addTeacher(user)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		th.addUserToArray(user);
		th.teachers.push(user);
		
		sessionStorage.setItem("teachers", JSON.stringify(th.teachers));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = th.teachers[th.teachers.length-1];
		operationStatus.attachedInfo = "";
		
	  resolve(operationStatus);
    });  
  }
  
  addSubject(subject)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		th.subjects.push(subject);
		
		sessionStorage.setItem("subjects", JSON.stringify(th.subjects));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = th.subjects[th.subjects.length-1];
		operationStatus.attachedInfo = "";
		
	  resolve(operationStatus);
    });  
  }
  
  private addUserToArray(user)
  {
	this.users.push(user);  
	sessionStorage.setItem("users", JSON.stringify(this.users));
  }

  deleteUser(id) {
	  var th = this;
    return new Promise(function (resolve, reject) {
		
		th.deleteUserFromArray(id);
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = th.users;
		operationStatus.attachedInfo = "User deleted";
		
	  resolve(operationStatus);
    });
  }
  
  deleteTeacher(id) {
	  var th = this;
    return new Promise(function (resolve, reject) {
		th.deleteUserFromArray(id);
		
		for(var i in th.teachers)
		{
			if(th.teachers[i].id == id)
			{
				th.teachers.splice(parseInt(i),1);
				break;
			}
		}
		
		sessionStorage.setItem("teachers", JSON.stringify(th.teachers));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = th.teachers;
		operationStatus.attachedInfo = "Teacher deleted";
		
	  resolve(operationStatus);
    });
  }
  
  deleteStudent(id) {
	  var th = this;
    return new Promise(function (resolve, reject) {
		th.deleteUserFromArray(id);
		
		for(var i in th.students)
		{
			if(th.students[i].id == id)
			{
				th.students.splice(parseInt(i),1);
				break;
			}
		}
		
		sessionStorage.setItem("students", JSON.stringify(th.students));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = th.students;
		operationStatus.attachedInfo = "Student deleted";
		
	  resolve(operationStatus);
    });
  }
  
  deleteSubject(id) {
	  var th = this;
    return new Promise(function (resolve, reject) {
		for(var i in th.subjects)
		{
			if(th.subjects[i].id == id)
			{
				th.subjects.splice(parseInt(i),1);
				break;
			}
		}
		
		sessionStorage.setItem("subjects", JSON.stringify(th.subjects));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = th.subjects;
		operationStatus.attachedInfo = "Subject deleted";
		
	  resolve(operationStatus);
    });
  }
  
  private deleteUserFromArray(id)
  {
	for(var i in this.users)
	{
		if(this.users[i].id == id)
		{
			this.users.splice(parseInt(i),1);
			break;
		}
	}
		
	sessionStorage.setItem("users", JSON.stringify(this.users));  
  }
  
  public sendNotifyAllConnectedText(message: Message) {
	  var th = this;
	return new Promise(function (resolve, reject) {
		var operationStatus = th.sendStubMessage("Message was sent to all entered");
        resolve(operationStatus);
    });
  }
  
  public sendNotifyAllEnteredText(message: Message) {
	  var th = this;
	return new Promise(function (resolve, reject) {
        var operationStatus = th.sendStubMessage("Message was sent to all entered");
        resolve(operationStatus);
    });
  }
  
  public sendNotifyOneText(id, message: Message) {
	  var th = this;
	return new Promise(function (resolve, reject) {
        var operationStatus = th.sendStubMessage("Message was sent to one");
        resolve(operationStatus);
    });
  }

  public getNotifyEnteredText(toastrService: ToastrService) {
	var message = this.getStubMessage();
	this.showNotification(toastrService, message);
  }
  
  public getNotifyConnectedText(toastrService: ToastrService) {
	var message = this.getStubMessage();
	this.showNotification(toastrService, message);
  }
  
  public getNotifyUnicastText(toastrService: ToastrService) {
	var message = this.getStubMessage();
	this.showNotification(toastrService, message);
  }
  
  sendStubMessage(messageText:string)
  {
	var message = this.getStubMessage(); 
	var operationStatus = new operationStatusInfo();
	operationStatus.operationStatus = 1;
	operationStatus.attachedObject = message;
	operationStatus.attachedInfo = messageText;	
	return operationStatus;
  }
  
  getStubMessage()
  {
	var message = new Message();
	message.text = "Message is sentssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss!";
	message.senderName = "Admin";
	return message;
  }
  
  showNotification(toastrService: ToastrService, message) {
	toastrService.show(message.text, message.senderName, {
      tapToDismiss: true,
	  positionClass: 'toast-bottom-right',
	  toastClass: "toast-info-custom",
	  disableTimeOut: true,
      progressAnimation: 'increasing',
      progressBar: false,
    });
  }
  
  getAllLoggedInUsers() {
    return new Promise(function (resolve, reject) {
	  resolve(null);
    });
  }
  
  getAllLoggedInStudents() {
    return new Promise(function (resolve, reject) {
      resolve(null);
    });
  }
  
  activateUser(id) {
	return new Promise(function (resolve, reject) {
      resolve(null);
    });
  }
  
  deactivateUser(id) {
	return new Promise(function (resolve, reject) {
      resolve(null);
    });
  }
  
  changeUserStatus(id, status) {
	return new Promise(function (resolve, reject) {
      resolve(null);
    });
  }
}
