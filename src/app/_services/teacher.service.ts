import { Injectable } from '@angular/core';
import { SignalRService } from './signalR.service';
import {Router} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TeacherService {

    constructor(
      private serviceClient: SignalRService,
	  private router: Router
    ) {
    }

  invokeUpdateTeacherInfo(teacher, changedFields, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("UpdateTeacher", teacher, changedFields)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  getAllTeachers(serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("GetTeachersCatalogue")
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  getTeacherById(id, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("GetTeacherById", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  getTeacherByAuthId(id, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("GetTeacherByAuth", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  getActiveTeacherById(id, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("GetActiveTeacherById", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }

  addTeacher(teacher, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("RegisterTeacher", teacher)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }

  deleteTeacher(id, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("DeleteTeacher", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  deleteTeacherAuthorization(id, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("DeleteTeacherAuthorization", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  activateTeacher(id, serviceClient = this.serviceClient) {
	return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("ActivateTeacher", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  deactivateTeacher(id, serviceClient = this.serviceClient) {
	return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("DeactivateTeacher", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
}
