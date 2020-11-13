import { Injectable } from '@angular/core';
import { SignalRService } from './signalR.service';
import {Router} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class StudentService {

    constructor(
      private serviceClient: SignalRService,
	  private router: Router
    ) {
    }

  invokeUpdateStudentInfo(student, changedFields, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("UpdateStudent", student, changedFields)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  getAllStudents(serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("GetStudentsCatalogue")
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
		  reject(err);
      });
    });
  }
  
  getStudentById(id, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("GetStudentById", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  getStudentByAuthId(id, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("GetStudentByAuth", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  getActiveStudentById(id, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("GetActiveStudentById", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }

  addStudent(student, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("RegisterStudent", student)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }

  deleteStudent(id, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("DeleteStudent", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  deleteStudentAuthorization(id, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("DeleteStudentAuthorization", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  activateStudent(id, serviceClient = this.serviceClient) {
	return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("ActivateStudent", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  deactivateStudent(id, serviceClient = this.serviceClient) {
	return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("DeactivateStudent", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
}
