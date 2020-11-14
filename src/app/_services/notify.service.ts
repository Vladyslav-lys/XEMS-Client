import { Injectable } from '@angular/core';
import { SignalRService } from './signalR.service';
import { Message } from '../_models/message';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotifyService {
  
  constructor(
    private serviceClient: SignalRService
  ) {
  }

  public sendNotifyAllConnectedText(message, serviceClient = this.serviceClient) {
	return new Promise(function (resolve, reject) {
        serviceClient.hubConnection.invoke("BroadcastToAllConnected", message)
          .then(function (operationStatus) {
            resolve(operationStatus);
          }).catch(function (err) {
            reject(err);
        });
    });
  }
  
  public sendNotifyAllEnteredText(message, serviceClient = this.serviceClient) {
	return new Promise(function (resolve, reject) {
        serviceClient.hubConnection.invoke("BroadcastToAllEntered", message)
          .then(function (operationStatus) {
            resolve(operationStatus);
          }).catch(function (err) {
            reject(err);
        });
    });
  }
  
  public sendNotifyAllEnteredStudentsText(message, serviceClient = this.serviceClient) {
	return new Promise(function (resolve, reject) {
        serviceClient.hubConnection.invoke("BroadcastToAllEntered", message)
          .then(function (operationStatus) {
            resolve(operationStatus);
          }).catch(function (err) {
            reject(err);
        });
    });
  }
  
  public sendNotifyOneText(id, message, serviceClient = this.serviceClient) {
	return new Promise(function (resolve, reject) {
        serviceClient.hubConnection.invoke("Unicast", id, message)
          .then(function (operationStatus) {
            resolve(operationStatus);
          }).catch(function (err) {
            reject(err);
        });
    });
  }

  public getNotifyEnteredText(toastrService: ToastrService, serviceClient = this.serviceClient) {
	var th = this;
    serviceClient.hubConnection.on('BroadcastToAllEntered', (message) => {
      th.showNotification(toastrService, message);
    });
	
	/*var message = new Message();
	message.text = "Message is sentssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss!";
	message.senderName = "Admin";
	this.showNotification(toastrService, message);*/
  }
  
  public getNotifyConnectedText(toastrService: ToastrService, serviceClient = this.serviceClient) {
	var th = this;
    serviceClient.hubConnection.on('BroadcastToAllConnected', (message) => {
      th.showNotification(toastrService, message);
    });
	
	/*var message = new Message();
	message.text = "Message is sentssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss!";
	message.senderName = "Admin";
	this.showNotification(toastrService, message);*/
  }
  
  public getNotifyUnicastText(toastrService: ToastrService, serviceClient = this.serviceClient) {
	var th = this;
    serviceClient.hubConnection.on('Unicast', (message) => {
      th.showNotification(toastrService, message);
    });
	
	/*var message = new Message();
	message.text = "Message is sentssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss!";
	message.senderName = "Admin";
	this.showNotification(toastrService, message);*/
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
}

{
/*return new Promise(function (resolve, reject) {
    this.serviceClient.http.get(this.serviceClient.baseUrl + 'api/Notify/GetNotifyText/')
      .toPromise()
      .then(function (message) {
        resolve(message);
      }).catch(function (err) {
        reject(err);
      });
  });*/
  
  /*notificationService.info("Admin", "Message is sent!", {
        position: ['bottom', 'right'],
        animate: 'fade',
        showProgressBar: false,
      });*/
}
