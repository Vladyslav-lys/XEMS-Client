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
	
	public getAccessAdmin(): boolean {
      var result: boolean;
      if(localStorage.getItem('isAllowedAdmin') != null)
        result = JSON.parse(localStorage.isAllowedAdmin);
      else
        result = false;
      return result;
    }

    public setAccessAdmin(value: boolean){
      localStorage.setItem('isAllowedAdmin', JSON.stringify(value));
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
	  this.setAccessAdmin(null);
	  this.setAccessTeacher(null);
	  this.setAccessStudent(null);
	  localStorage.setItem('currentAuthentication', JSON.stringify(null));
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
	
  invokeUpdateAuthorizationInfo(authorization, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("UpdateAuthorization", authorization)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  getAllActives(accessLevel, serviceClient = this.serviceClient) {
	return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("GetAllActives", accessLevel)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });  
  }
	
	getAuthorizationById(id, serviceClient = this.serviceClient) {
		var th = this;
        return new Promise(function (resolve, reject) {
          serviceClient.hubConnection.invoke("GetAuthorizationById", id)
            .then(function (operationStatus) {
              resolve(operationStatus);
            }).catch(function (err) {
              reject(err);
          });
      });
	}

  addAuthorization(authorization, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("RegistrationAuthorization", authorization)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }

  deleteAuthorization(id, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("DeleteAuthorization", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
}
