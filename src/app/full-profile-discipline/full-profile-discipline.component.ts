import { Component, OnInit } from '@angular/core';
import { DisciplineService } from '../_services/discipline.service';
//import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { Discipline } from '../_models/discipline';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo, OperationStatus } from '../_helpers/operationStatusInfo';

@Component({
  selector: 'app-full-profile-discipline',
  templateUrl: './full-profile-discipline.component.html',
  styleUrls: ['./full-profile-discipline.component.css']
})
export class FullProfileDisciplineComponent implements OnInit {
  disciplineForm: FormGroup;
  currentDisciplineId: number;
  currentDiscipline: Discipline;
  loading = false;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
	//private stub:StubService,
    private disciplineService: DisciplineService,
    private formBuilder: FormBuilder
  ) {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.route
            .queryParams
            .subscribe(params => {
              // Defaults to 0 if no query param provided.
              this.currentDisciplineId = +this.route.snapshot.paramMap.get('id');
              this.LoadDisciplineInfo(this.currentDisciplineId);
            });
        }
      });
  }

  ngOnInit(): void {
    this.disciplineForm = this.formBuilder.group({
      title: [this.currentDiscipline.title, Validators.required]
    });
  }

  LoadDisciplineInfo(currentDisciplineId: number) {
    var th = this;
    var disciplines = JSON.parse(sessionStorage.disciplines);
    disciplines.forEach(function (discipline: Discipline) {
      if (discipline.id == currentDisciplineId) {
        th.currentDiscipline = discipline;
      }
    });
  }

  EditDiscipline() {

    this.submitted = true;

    if (this.disciplineForm.invalid) {
      return;
    }

    this.loading = true;

    var newDiscipline: Discipline;
    newDiscipline = this.currentDiscipline;

    if (this.disciplineForm.controls.title.value != null)
      newDiscipline.title = this.disciplineForm.controls.title.value;

    var th = this;
    this.disciplineService.invokeUpdateDisciplineInfo(newDiscipline)
      .then(function (operationStatusInfo: operationStatusInfo) {
        if (operationStatusInfo.operationStatus == OperationStatus.Done) {
          var message = "Discipline info updated successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/disciplines-control']);
        }
        else {
          alert(operationStatusInfo.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while updating discipline info");
		th.loading = false;
      });
  }

  enableBtn(): boolean {
    if (this.disciplineForm.controls.title.value.length > 0 )
      return true;
    return false;
  }
}