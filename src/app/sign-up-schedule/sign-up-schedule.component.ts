import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_models/operationStatusInfo';
import { Account } from '../_models/accounts';

@Component({
  selector: 'app-sign-up-schedule',
  templateUrl: './sign-up-schedule.component.html',
  styleUrls: ['./sign-up-schedule.component.css']
})
export class SignUpScheduleComponent implements OnInit {

  /*file: File;
  fileName: string = "Choose file";*/
  fileInBase64: any;
  photo: string;
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
  }

  AddWorkPlan() {
  }

  enableBtn(): boolean {
    return false;
  }
}