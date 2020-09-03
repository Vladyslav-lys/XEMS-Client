import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { User } from '../_models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_models/operationStatusInfo';

@Component({
  selector: 'app-full-profile-teacher',
  templateUrl: './full-profile-teacher.component.html',
  styleUrls: ['./full-profile-teacher.component.css']
})
export class FullProfileTeacherComponent implements OnInit {
  /*file: File;
  fileName: string = "Choose file";*/
  fileInBase64: any;
  profileForm: FormGroup;
  currentTeacherId: number;
  currentTeacher: User;
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
              this.currentTeacherId = +this.route.snapshot.paramMap.get('id');
              this.LoadTeacherInfo(this.currentTeacherId);
            });
        }
      });
  }

  ngOnInit(): void {
    this.currentTeacher.account.birthday = new Date(this.currentTeacher.account.birthday);
    this.fileInBase64 = this.currentTeacher.account.photo;

    this.profileForm = this.formBuilder.group({
	  login: [this.currentTeacher.login, Validators.required],
      password: [this.currentTeacher.password, Validators.required],
      lastName: [this.currentTeacher.account.lastName, Validators.required],
      firstName: [this.currentTeacher.account.firstName, Validators.required],
      secondName: [this.currentTeacher.account.secondName, Validators.required],
      birthday: [this.currentTeacher.account.birthday, Validators.required],
	  phone: [this.currentTeacher.account.phone, Validators.required],
	  address: [this.currentTeacher.account.address, Validators.required],
	  rank: [this.currentTeacher.account.rank, Validators.required],
	  group: [this.currentTeacher.account.group ? this.currentTeacher.account.group.id : ""],
      accessLevel: [this.currentTeacher.accessLevel],
      active: [this.currentTeacher.isActive]
    });
  }

  onFileChanged(event) {
    var registerComponent = this;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      var fr = new FileReader();
      fr.onload = function () {
        var split1 = fr.result.toString().split(":", 2);
        var split2 = split1[1].split(";", 2);

        registerComponent.currentPhoto = fr.result.toString();
        registerComponent.fileInBase64 = fr.result.toString();
      }
      fr.readAsDataURL(file);
    }
  }

  LoadTeacherInfo(currentTeacherId: number) {
    var th = this;
    var teachers = JSON.parse(sessionStorage.teachers);
    teachers.forEach(function (teacher: User) {
      if (teacher.id == currentTeacherId) {
        th.currentTeacher = teacher;
        th.currentPhoto = teacher.account.photo;
      }
    });
  }

  EditProfile() {

    this.submitted = true;

    if (this.profileForm.invalid || this.currentPhoto.length < 24) {
      return;
    }

    this.loading = true;

    var newTeacher: User;
    newTeacher = this.currentTeacher;

    if (this.profileForm.controls.login.value != null)
      newTeacher.login = this.profileForm.controls.login.value;
    if (this.profileForm.controls.password.value != null)
      newTeacher.password = this.profileForm.controls.password.value;
    if (this.profileForm.controls.lastName.value != null)
      newTeacher.account.lastName = this.profileForm.controls.lastName.value;
    if (this.profileForm.controls.firstName.value != null)
      newTeacher.account.firstName = this.profileForm.controls.firstName.value;
    if (this.profileForm.controls.secondName.value != null)
      newTeacher.account.secondName = this.profileForm.controls.secondName.value;
    if (this.profileForm.controls.birthday.value != null)
      newTeacher.account.birthday = this.profileForm.controls.birthday.value;
    if (this.profileForm.controls.phone.value != null)
      newTeacher.account.phone = this.profileForm.controls.phone.value;
    if (this.profileForm.controls.address.value != null)
      newTeacher.account.address = this.profileForm.controls.address.value;
    if (this.profileForm.controls.rank.value != null)
      newTeacher.account.rank = this.profileForm.controls.rank.value;
    if (this.profileForm.controls.group.value != null && this.profileForm.controls.address.value.length > 0)
	{
	  var id = this.profileForm.controls.address.value;
	  newTeacher.account.group = this.stub.getGroupById(id);
	}
	else if(this.profileForm.controls.address.value.length > 0)
	{
	  newTeacher.account.group = null;
	}
    if (this.profileForm.controls.accessLevel.value != null)
      newTeacher.accessLevel = this.profileForm.controls.accessLevel.value;
    if (this.profileForm.controls.active.value != null)
      newTeacher.isActive = this.profileForm.controls.active.value;
    if (this.fileInBase64 != null) {
      var splitted = this.fileInBase64.split(",", 2);
      newTeacher.account.photo = splitted[1];
    }
    newTeacher.account.modifyTime = new Date();

    var th = this;
    
    this.stub.invokeUpdateTeacherInfo(newTeacher)
      .then(function (operationStatus: operationStatusInfo) {
        if (operationStatus.operationStatus == 1) {
          var message = "User info updated successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/teacher-control']);
        }
        else {
          alert(operationStatus.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while updating user info");
        alert(err);
      });
  }

  enableBtn(): boolean {
    if (this.currentPhoto != null && this.currentPhoto.length > 24 && this.profileForm.controls.login.value.length > 0 
	  && this.profileForm.controls.password.value.length > 0 && this.profileForm.controls.lastName.value.length > 0 
	  && this.profileForm.controls.firstName.value.length > 0 && this.profileForm.controls.secondName.value.length > 0 
	  && this.profileForm.controls.phone.value.length > 0 && this.profileForm.controls.birthday.value != null 
	  && this.profileForm.controls.address.value.length > 0 && this.profileForm.controls.rank.value.length > 0)
      return true;
    return false;
  }
}