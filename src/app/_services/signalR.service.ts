import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  connectionEstablished$ = new BehaviorSubject<boolean>(false);

  public hubConnection: HubConnection;

  constructor() {
    this.createConnection();
    this.startConnection();
  }
  
	//http://46.98.190.16:5001
  private createConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://194.107.230.233:5001/ServerHub')
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }

  private startConnection() {
    if (this.hubConnection.state === HubConnectionState.Connected) {
      return;
    }

    this.hubConnection.start().then(
      () => {
        console.log('Hub connection started!');
        this.connectionEstablished$.next(true);
      },
      error => console.error(error)
    );
  }

  /*private registerOnServerEvents(): void {
    this.hubConnection.on('Send', (data: any) => {
      console.log('data', data);
    });
  }*/
}
