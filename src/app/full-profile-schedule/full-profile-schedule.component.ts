import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { User } from '../_models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_models/operationStatusInfo';

@Component({
  selector: 'app-full-profile-schedule',
  templateUrl: './full-profile-schedule.component.html',
  styleUrls: ['./full-profile-schedule.component.css']
})
export class FullProfileScheduleComponent implements OnInit {
  /*file: File;
  fileName: string = "Choose file";*/
  fileInBase64: any;
  profileForm: FormGroup;
  currentUserId: number;
  currentUser: User;
  currentPhoto: any;
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
              this.currentUserId = +this.route.snapshot.paramMap.get('id');
            });
        }
      });
  }

  ngOnInit(): void {
  }

  LoadUserInfo(currentUserId: number) {
  }

  EditWorkPlan() {

    this.submitted = true;

    if (this.profileForm.invalid || this.currentPhoto.length < 24) {
      return;
    }

    this.loading = true;
  }

  enableBtn(): boolean {
    return false;
  }
}