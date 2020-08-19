import { Injectable } from '@angular/core';
import { SignalRService } from './signalR.service';
import {Router} from '@angular/router';
import { operationStatusInfo } from '../_models/operationStatusInfo';
import { Account } from '../_models/accounts';
import { User } from '../_models/user';
import { ToastrService } from 'ngx-toastr';
import { Message } from "../_models/message";

@Injectable({ providedIn: 'root' })
export class StubService {
    user:User;
	
	users:Array<User>;
	students:Array<User>;
	
    constructor(
	  private router: Router
    ) {
		this.users = new Array<User>();
		if(sessionStorage.users != null)
			this.users = JSON.parse(sessionStorage.users);
		this.students = new Array<User>();
		
		if(localStorage.currentUser != null)
			this.user = JSON.parse(localStorage.currentUser);
		
		if(this.users == null || this.users === undefined || this.users.length < 1)
		{
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
		
		let account2 = new Account();
		account2.id = 2;
		account2.createTime = new Date();
		account2.modifyTime = new Date();
		account2.photo = null;
		account2.firstName = "Alex";
		account2.lastName = "Volkov";
		account2.nickname = "Volk";
		account2.birthday = new Date();
		account2.email = "alex@gmail.com";
		let user2 = new User();
		user2.id = 2;
		user2.account = account2;
		user2.login = "log";
		user2.password = "pass";
		user2.isActive = true;
		user2.accessLevel = 3;
		this.users.push(user2);
		
		let account3 = new Account();
		account3.id = 3;
		account3.createTime = new Date();
		account3.modifyTime = new Date();
		account3.photo = null;
		account3.firstName = "Uri";
		account3.lastName = "Gorbachov";
		account3.nickname = "Gorb";
		account3.birthday = new Date();
		account3.email = "g@gmail.com";
		let user3 = new User();
		user3.id = 3;
		user3.account = account3;
		user3.login = "gorb";
		user3.password = "gorb";
		user3.isActive = true;
		user3.accessLevel = 2;
		this.users.push(user3);
		
		let account4 = new Account();
		account4.id = 4;
		account4.createTime = new Date();
		account4.modifyTime = new Date();
		account4.photo = null;
		account4.firstName = "Kiril";
		account4.lastName = "Petrov";
		account4.nickname = "Petr";
		account4.birthday = new Date();
		account4.email = "petr@gmail.com";
		let user4 = new User();
		user4.id = 4;
		user4.account = account4;
		user4.login = "kir";
		user4.password = "petr";
		user4.isActive = true;
		user4.accessLevel = 2;
		this.users.push(user4);	
		}
		
		for(var i in this.users)
		{
			if(this.users[i].accessLevel == 2)
			{
				this.students.push(this.users[i]);
			}
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
		
		for(var i in th.users)
		{
			if(th.users[i].id == user.id)
			{
				th.users[i] = user;
				break;
			}
		}
		
		if(th.user.id == user.id)
		{
			th.user = user;
		}
		
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = user;
		operationStatus.attachedInfo = "";
		
		sessionStorage.setItem("users", JSON.stringify(th.users));
		
		resolve(operationStatus);
    });
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
  
  addUser(user) {
	  var th = this;
    return new Promise(function (resolve, reject) {
		th.users.push(user);
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = th.users[th.users.length-1];
		operationStatus.attachedInfo = "";
		
		sessionStorage.setItem("users", JSON.stringify(th.users));
		
	  resolve(operationStatus);
    });
  }

  deleteUser(id) {
	  var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = 1;
		operationStatus.attachedObject = th.users;
		operationStatus.attachedInfo = "User deleted";
		
		for(var i in th.users)
		{
			if(th.users[i].id == id)
			{
				th.users.splice(parseInt(i),1);
				break;
			}
		}
		
		sessionStorage.setItem("users", JSON.stringify(th.users));
		
	  resolve(operationStatus);
    });
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
