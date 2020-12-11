import { Injectable } from '@angular/core';
import { SignalRService } from './signalR.service';
import {HubConnectionState} from '@microsoft/signalr';
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
	
	public removeAuth(){
	  localStorage.removeItem('isLoggedIn');
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
	
	public removeAccessAdmin(){
	  localStorage.removeItem('isAllowedAdmin');
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
	
	public removeAccessTeacher(){
	  localStorage.removeItem('isAllowedTeacher');
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
	
	public removeAccessStudent(){
	  localStorage.removeItem('isAllowedStudent');
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

    logout(serviceClient = this.serviceClient) {
	  return new Promise(function (resolve, reject) {
        serviceClient.hubConnection.invoke("Logout")
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
	
  blockAuthorization(authorizationId, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("BlockAuthorization", authorizationId)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  unblockAuthorization(authorizationId, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("UnblockAuthorization", authorizationId)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  loginViaTeams(guid, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("LoginViaTeams", guid)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  teamsGetUserFirstLogin(guid, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("TeamsGetUserFirstLogin", guid)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  registerAzureUser(user, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("RegisterViaTeams", user)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  sendEmail(email, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("RegisterAzureUser", email)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  sendNewPassword(password, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("RegisterAzureUser", password)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }

  /*addAuthorization(authorization, serviceClient = this.serviceClient) {
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
  }*/
}
