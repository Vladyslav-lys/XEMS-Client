import { Component, OnInit } from '@angular/core';
import { DisciplineService } from '../_services/discipline.service';
import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { Discipline } from '../_models/discipline';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';

@Component({
  selector: 'app-sign-up-discipline',
  templateUrl: './sign-up-discipline.component.html',
  styleUrls: ['./sign-up-discipline.component.css']
})
export class SignUpDisciplineComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private router: Router,
    private disciplineService: DisciplineService,
	private stub:StubService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      title: ["", Validators.required],
    });
  }

  AddDiscipline() {

    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    var newDiscipline: Discipline;
    newDiscipline = new Discipline();

    if (this.registerForm.controls.title.value != null)
      newDiscipline.title = this.registerForm.controls.title.value;

    var th = this;
	this.disciplineService.addDiscipline(newDiscipline)
	  .then(function (operationStatus: operationStatusInfo) {
		var message = "Discipline added successfully";
        console.log(message);
        alert(message);
        th.router.navigate(['/disciplines-control']);
      }).catch(function(err) {
        console.log("Error while adding new discipline");
        alert(err);
	    th.loading = false;
      });
  }

  enableBtn(): boolean {
    if (this.registerForm.controls.title.value.length > 0)
      return true;
    return false;
  }
}