import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { Subject } from '../_models/subject';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_models/operationStatusInfo';

@Component({
  selector: 'app-sign-up-subject',
  templateUrl: './sign-up-subject.component.html',
  styleUrls: ['./sign-up-subject.component.css']
})
export class SignUpSubjectComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private router: Router,
    private userService: UserService,
	private stub:StubService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ["", Validators.required],
    });
  }

  AddSubject() {

    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

    var newSubject: Subject;
    newSubject = new Subject();

    if (this.registerForm.controls.name.value != null)
      newSubject.name = this.registerForm.controls.name.value;

    var th = this;
	this.stub.addSubject(newSubject)
	  .then(function (operationStatus: operationStatusInfo) {
		var message = "Subject added successfully";
        console.log(message);
        alert(message);
        th.router.navigate(['/subjects-control']);
      }).catch(function(err) {
        console.log("Error while adding new subject");
        alert(err);
	    th.loading = false;
      });
  }

  enableBtn(): boolean {
    if (this.registerForm.controls.name.value.length > 0)
      return true;
    return false;
  }
}