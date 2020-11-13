import { Injectable } from '@angular/core';
import { SignalRService } from './signalR.service';
import {Router} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class WorkingPlanService {

    constructor(
      private serviceClient: SignalRService,
	  private router: Router
    ) {
    }

  invokeUpdateWorkingPlanInfo(workingPlan, changedFields, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("UpdateWorkingPlan", workingPlan, changedFields)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  getAllWorkingPlans(serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("GetWorkingPlansCatalogue")
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  getAllWorkingPlansByTeacherId(teacherId, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("GetTeacherWorkingPlans", teacherId)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
  
  getWorkingPlanById(id, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("GetWorkingPlanById", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }

  addWorkingPlan(workingPlan, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("CreateWorkingPlan",workingPlan)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }

  deleteWorkingPlan(id, serviceClient = this.serviceClient) {
    return new Promise(function (resolve, reject) {
      serviceClient.hubConnection.invoke("DeleteWorkingPlan", id)
        .then(function (operationStatus) {
          resolve(operationStatus);
        }).catch(function (err) {
        reject(err);
      });
    });
  }
}
