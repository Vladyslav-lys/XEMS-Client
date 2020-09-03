import { Injectable } from '@angular/core';
import { SignalRService } from './signalR.service';
import {Router} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    constructor(
      private serviceClient: SignalRService,
	  private router: Router
    ) {
    }

    public getAuth(): boolean {
      var result: boolean;
      if(localStorage.getItem('isLoggedIn') != null)
        result = JSON.parse(localStorage.isLoggedIn);
      else
        result = false;
      return result;
    }

    public setAuth(value: boolean){
      localStorage.setItem('isLoggedIn', JSON.stringify(value));
    }
	
	public getAccessProfile(): boolean {
      var result: boolean;
      if(localStorage.getItem('isAllowedProfile') != null)
        result = JSON.parse(localStorage.isAllowedProfile);
      else
        result = false;
      return result;
    }

    public setAccessProfile(value: boolean){
      localStorage.setItem('isAllowedProfile', JSON.stringify(value));
    }
	
	public getAccessTeacher(): boolean {
      var result: boolean;
      if(localStorage.getItem('isAllowedTeacher') != null)
        result = JSON.parse(localStorage.isAllowedTeacher);
      else
        result = false;
      return result;
    }

    public setAccessTeacher(value: boolean){
      localStorage.setItem('isAllowedTeacher', JSON.stringify(value));
    }
	
	public getAccessStudent(): boolean {
      var result: boolean;
      if(localStorage.getItem('isAllowedStudent') != null)
        result = JSON.parse(localStorage.isAllowedStudent);
      else
        result = false;
      return result;
    }

    public setAccessStudent(value: boolean){
      localStorage.setItem('isAllowedStudent', JSON.stringify(value));
    }

    login(username, password, serviceClient = this.serviceClient) {
      var th = this;
        return new Promise(function (resolve, reject) {
          serviceClient.hubConnection.invoke("Login", username, password)
            .then(function (operationStatus) {
              resolve(operationStatus);
            }).catch(function (err) {
              reject(err);
          });
      });
    }

    logout(id, serviceClient = this.serviceClient) {
	  this.setAuth(null);
	  this.setAccessProfile(null);
	  this.setAccessTeacher(null);
	  localStorage.setItem('currentUser', JSON.stringify(null));
	  this.router.navigate(['/login']);
	
	  return new Promise(function (resolve, reject) {
        serviceClient.hubConnection.invoke("Logout", id)
          .then(function (operationStatus) {
            resolve(operationStatus);
          }).catch(function (err) {
		    reject(err);
        });
      });
    }
}
