import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import {operationStatusInfo, OperationStatus} from '../_helpers/operationStatusInfo';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  connectionEstablished$ = new BehaviorSubject<boolean>(false);

  public hubConnection: HubConnection;
  public authorization: any;
  private currentToken: string;

  constructor() {
	if(localStorage.currentAuthentication)
	{
		this.authorization = JSON.parse(localStorage.currentAuthentication);
	}
	
	this.getToken();
    this.createConnection();
    this.startConnection();
	
	this.getNewToken();
  }
  
	//http://46.98.190.16:5001
	//http://127.0.0.1:4040
  private createConnection() {
	
	if(this.currentToken)
	{
	   this.hubConnection = new HubConnectionBuilder()
		.withUrl("http://754f674ec539.ngrok.io/ServerHub", { accessTokenFactory: () => this.currentToken })
		.withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();
		
		return;
	}
	
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://754f674ec539.ngrok.io/ServerHub")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }
  
  loginWithToken() {
      var th = this;
      return new Promise(function (resolve, reject) {
          th.hubConnection.invoke("LoginWithToken")
            .then(function () {
              resolve();
            }).catch(function (err) {
              reject(err);
          });
      });
    }

  private startConnection() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    this.hubConnection.start().then(
      () => {
        console.log('Hub connection started!');
        this.connectionEstablished$.next(true);
		if(this.authorization == null)
			return;
		
		this.loginWithToken()
			.then(function () {
				console.log("Loggined with token");
			}).catch(function(err) {
				console.log("Error while fetching students");
			});
      },
      error => console.error(error)
    );
  }
  
  private getToken() {
	if(this.authorization != null)
	{
	   this.currentToken = this.authorization[2];
	}
  }
  
  private getNewToken() {
	var currentDate = new Date();
	
	if(this.authorization != null)
	{
	  if(this.authorization[4] <= currentDate)
	  {
		var th = this;
		this.changeToken(this.authorization[3])
		.then(function (operationStatusInfo : operationStatusInfo){
		  if (operationStatusInfo.operationStatus == OperationStatus.Done) {
			th.currentToken = th.authorization[3];
			th.authorization[2] = th.authorization[3];
			var currentDate = new Date();
			th.authorization[4] = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDay() + 2);
			localStorage.setItem('currentAuthentication', JSON.stringify(th.authorization));
		  }
		}).catch(err => {
		  console.log(err);
		});
	  }
    }
  }
  
  private changeToken(token)
  {
	return new Promise(function (resolve, reject) {
	  this.hubConnection.invoke("ChangeToken", token)
            .then(function (operationStatus) {
              resolve(operationStatus);
            }).catch(function (err) {
              reject(err);
          });
	});
  }
  
  public disconnect()
  {
	this.hubConnection.stop();
  }
  
  public makeFullConnection(authorization)
  {
	if(authorization)
	{
		this.authorization = authorization;
		
		this.getToken();
		this.createConnection();
		this.startConnection();
	
		this.getNewToken();  
	}
  }
}
