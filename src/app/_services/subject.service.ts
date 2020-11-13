import { Injectable } from '@angular/core';
import { SignalRService } from './signalR.service';
import {Router} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SubjectService {

    constructor(
      private serviceClient: SignalRService,
	  private router: Router
    ) {
    }

  invokeUpdateSubjectInfo(subject, changedFields, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("UpdateSubject", subject, changedFields)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  getAllSubjects(serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("GetSubjectsCatalogue")
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  getSubjectById(id, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("GetSubjectById", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }

  addSubject(subject, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("CreateSubject",subject)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }

  deleteSubject(id, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("DeleteSubject", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
}
