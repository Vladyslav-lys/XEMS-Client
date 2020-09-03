import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { User } from '../_models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_models/operationStatusInfo';

@Component({
  selector: 'app-full-profile-student',
  templateUrl: './full-profile-student.component.html',
  styleUrls: ['./full-profile-student.component.css']
})
export class FullProfileStudentComponent implements OnInit {
  /*file: File;
  fileName: string = "Choose file";*/
  fileInBase64: any;
  profileForm: FormGroup;
  currentStudentId: number;
  currentStudent: User;
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
              this.currentStudentId = +this.route.snapshot.paramMap.get('id');
              this.LoadStudentInfo(this.currentStudentId);
            });
        }
      });
  }

  ngOnInit(): void {
    this.currentStudent.account.birthday = new Date(this.currentStudent.account.birthday);
    this.fileInBase64 = this.currentStudent.account.photo;

    this.profileForm = this.formBuilder.group({
      login: [this.currentStudent.login, Validators.required],
      password: [this.currentStudent.password, Validators.required],
      lastName: [this.currentStudent.account.lastName, Validators.required],
      firstName: [this.currentStudent.account.firstName, Validators.required],
      secondName: [this.currentStudent.account.secondName, Validators.required],
      birthday: [this.currentStudent.account.birthday, Validators.required],
	  phone: [this.currentStudent.account.phone, Validators.required],
	  address: [this.currentStudent.account.address, Validators.required],
	  group: [this.currentStudent.account.group.id],
      accessLevel: [this.currentStudent.accessLevel],
      active: [this.currentStudent.isActive]
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

  LoadStudentInfo(currentStudentId: number) {
    var th = this;
    var students = JSON.parse(sessionStorage.students);
    students.forEach(function (student: User) {
      if (student.id == currentStudentId) {
        th.currentStudent = student;
        th.currentPhoto = student.account.photo;
      }
    });
  }

  EditProfile() {

    this.submitted = true;

    if (this.profileForm.invalid || this.currentPhoto.length < 24) {
      return;
    }

    this.loading = true;

    var newStudent: User;
    newStudent = this.currentStudent;

    if (this.profileForm.controls.login.value != null)
      newStudent.login = this.profileForm.controls.login.value;
    if (this.profileForm.controls.password.value != null)
      newStudent.password = this.profileForm.controls.password.value;
    if (this.profileForm.controls.lastName.value != null)
      newStudent.account.lastName = this.profileForm.controls.lastName.value;
    if (this.profileForm.controls.firstName.value != null)
      newStudent.account.firstName = this.profileForm.controls.firstName.value;
    if (this.profileForm.controls.secondName.value != null)
      newStudent.account.secondName = this.profileForm.controls.secondName.value;
    if (this.profileForm.controls.birthday.value != null)
      newStudent.account.birthday = this.profileForm.controls.birthday.value;
    if (this.profileForm.controls.phone.value != null)
      newStudent.account.phone = this.profileForm.controls.phone.value;
    if (this.profileForm.controls.address.value != null)
      newStudent.account.address = this.profileForm.controls.address.value;
    if (this.profileForm.controls.rank.value != null)
      newStudent.account.rank = this.profileForm.controls.rank.value;
    if (this.profileForm.controls.group.value != null)
	{
	  var id = this.profileForm.controls.address.value;
	  newStudent.account.group = this.stub.getGroupById(id);
	}
    if (this.profileForm.controls.accessLevel.value != null)
      newStudent.accessLevel = this.profileForm.controls.accessLevel.value;
    if (this.profileForm.controls.active.value != null)
      newStudent.isActive = this.profileForm.controls.active.value;
    if (this.fileInBase64 != null) {
      var splitted = this.fileInBase64.split(",", 2);
      newStudent.account.photo = splitted[1];
    }
    newStudent.account.modifyTime = new Date();

    var th = this;
    
    this.stub.invokeUpdateStudentInfo(newStudent)
      .then(function (operationStatus: operationStatusInfo) {
        if (operationStatus.operationStatus == 1) {
          var message = "User info updated successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/students-control']);
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
	  && this.profileForm.controls.address.value.length > 0)
      return true;
    return false;
  }
}