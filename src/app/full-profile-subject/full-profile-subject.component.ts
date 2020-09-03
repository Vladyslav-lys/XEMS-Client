import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { User } from '../_models/user';
import { Subject } from '../_models/subject';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_models/operationStatusInfo';

@Component({
  selector: 'app-full-profile-subject',
  templateUrl: './full-profile-subject.component.html',
  styleUrls: ['./full-profile-subject.component.css']
})
export class FullProfileSubjectComponent implements OnInit {
  subjectForm: FormGroup;
  currentSubjectId: number;
  currentSubject: Subject;
  loading = false;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
	private stub:StubService,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.route
            .queryParams
            .subscribe(params => {
              // Defaults to 0 if no query param provided.
              this.currentSubjectId = +this.route.snapshot.paramMap.get('id');
              this.LoadSubjectInfo(this.currentSubjectId);
            });
        }
      });
  }

  ngOnInit(): void {
    this.subjectForm = this.formBuilder.group({
      name: [this.currentSubject.name, Validators.required]
    });
  }

  LoadSubjectInfo(currentSubjectId: number) {
    var th = this;
    var subjects = JSON.parse(sessionStorage.subjects);
    subjects.forEach(function (subject: Subject) {
      if (subject.id == currentSubjectId) {
        th.currentSubject = subject;
      }
    });
  }

  EditSubject() {

    this.submitted = true;

    if (this.subjectForm.invalid) {
      return;
    }

    this.loading = true;

    var newSubject: Subject;
    newSubject = this.currentSubject;

    if (this.subjectForm.controls.name.value != null)
      newSubject.name = this.subjectForm.controls.name.value;

    var th = this;
    this.stub.invokeUpdateSubjectInfo(newSubject)
      .then(function (operationStatus: operationStatusInfo) {
        if (operationStatus.operationStatus == 1) {
          var message = "Subject info updated successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/subjects-control']);
        }
        else {
          alert(operationStatus.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while updating subject info");
        alert(err);
      });
  }

  enableBtn(): boolean {
    if (this.subjectForm.controls.name.value.length > 0 )
      return true;
    return false;
  }
}