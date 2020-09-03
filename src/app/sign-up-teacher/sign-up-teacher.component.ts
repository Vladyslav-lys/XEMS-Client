import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_models/operationStatusInfo';
import { Teacher } from '../_models/teacher';
import { Group } from '../_models/group';

@Component({
  selector: 'app-sign-up-teacher',
  templateUrl: './sign-up-teacher.component.html',
  styleUrls: ['./sign-up-teacher.component.css']
})
export class SignUpTeacherComponent implements OnInit {

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
    this.photo = "data:image/png;base64,";
    /*this.user.account.photo = "data:image/png;base64," + this.user.account.photo;
    this.user.account.birthday = new Date(this.user.account.birthday);*/

    this.registerForm = this.formBuilder.group({
      login: ["", Validators.required],
      password: ["", Validators.required],
      lastName: ["", Validators.required],
      firstName: ["", Validators.required],
      secondName: ["", Validators.required],
      birthday: ["", Validators.required],
	  phone: ["", Validators.required],
	  address: ["", Validators.required],
	  rank: ["", Validators.required],
	  group: [1],
      accessLevel: [1],
      active: [true]
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

        registerComponent.photo = fr.result.toString();
        registerComponent.fileInBase64 = fr.result.toString();
      }
      fr.readAsDataURL(file);
    }
  }

  AddProfile() {

    this.submitted = true;

    if (this.registerForm.invalid || this.photo.length < 24) {
      return;
    }

    this.loading = true;

    var newTeacher: User;
    newTeacher = new User();
    newTeacher.account = new Teacher();
	newTeacher.account.group = null;

    if (this.registerForm.controls.login.value != null)
      newTeacher.login = this.registerForm.controls.login.value;
    if (this.registerForm.controls.password.value != null)
      newTeacher.password = this.registerForm.controls.password.value;
    if (this.registerForm.controls.lastName.value != null)
      newTeacher.account.lastName = this.registerForm.controls.lastName.value;
    if (this.registerForm.controls.firstName.value != null)
      newTeacher.account.firstName = this.registerForm.controls.firstName.value;
    if (this.registerForm.controls.secondName.value != null)
      newTeacher.account.secondName = this.registerForm.controls.secondName.value;
    if (this.registerForm.controls.birthday.value != null)
      newTeacher.account.birthday = this.registerForm.controls.birthday.value;
    if (this.registerForm.controls.phone.value != null)
      newTeacher.account.phone = this.registerForm.controls.phone.value;
    if (this.registerForm.controls.address.value != null)
      newTeacher.account.address = this.registerForm.controls.address.value;
    if (this.registerForm.controls.rank.value != null)
      newTeacher.account.rank = this.registerForm.controls.rank.value;
    if (this.registerForm.controls.group.value != null && this.registerForm.controls.address.value.length > 0 )
	{
	  var id = this.registerForm.controls.address.value;
	  newTeacher.account.group = this.stub.getGroupById(id);
	}
    if (this.registerForm.controls.accessLevel.value != null)
      newTeacher.accessLevel = this.registerForm.controls.accessLevel.value;
    if (this.registerForm.controls.active.value != null)
      newTeacher.isActive = this.registerForm.controls.active.value;
    if (this.fileInBase64 != null) {
      var splitted = this.fileInBase64.split(",", 2);
      newTeacher.account.photo = splitted[1];
    }
    newTeacher.account.createTime = new Date();
    newTeacher.account.modifyTime = new Date();

    var th = this;
	  
	this.stub.addTeacher(newTeacher)
	  .then(function (operationStatus: operationStatusInfo) {
		var message = "Teacher added successfully";
        console.log(message);
        alert(message);
        th.router.navigate(['/teacher-control']);
      }).catch(function(err) {
        console.log("Error while adding new teacher");
        alert(err);
	    th.loading = false;
      });
  }

  enableBtn(): boolean {
    if (this.photo.length > 24 && this.registerForm.controls.login.value.length > 0 && this.registerForm.controls.password.value.length > 0
      && this.registerForm.controls.lastName.value.length > 0 && this.registerForm.controls.firstName.value.length > 0
      && this.registerForm.controls.secondName.value.length > 0 && this.registerForm.controls.phone.value.length > 0
      && this.registerForm.controls.birthday.value != null && this.registerForm.controls.address.value.length > 0
	  && this.registerForm.controls.rank.value.length > 0)
      return true;
    return false;
  }
}