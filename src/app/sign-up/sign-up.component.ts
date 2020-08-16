import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { User } from '../_models/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_models/operationStatusInfo';
import { Account } from '../_models/accounts';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

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
      username: ["", Validators.required],
      password: ["", Validators.required],
      lastName: ["", Validators.required],
      firstName: ["", Validators.required],
      nickName: ["", Validators.required],
      email: ["", Validators.required],
      birthday: ["", Validators.required],
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

    var newUser: User;
    newUser = new User();
    newUser.account = new Account();

    if (this.registerForm.controls.username.value != null)
      newUser.login = this.registerForm.controls.username.value;
    if (this.registerForm.controls.password.value != null)
      newUser.password = this.registerForm.controls.password.value;
    if (this.registerForm.controls.lastName.value != null)
      newUser.account.lastName = this.registerForm.controls.lastName.value;
    if (this.registerForm.controls.firstName.value != null)
      newUser.account.firstName = this.registerForm.controls.firstName.value;
    if (this.registerForm.controls.nickName.value != null)
      newUser.account.nickname = this.registerForm.controls.nickName.value;
    if (this.registerForm.controls.email.value != null)
      newUser.account.email = this.registerForm.controls.email.value;
    if (this.registerForm.controls.birthday.value != null)
      newUser.account.birthday = this.registerForm.controls.birthday.value;
    if (this.registerForm.controls.accessLevel.value != null)
      newUser.accessLevel = this.registerForm.controls.accessLevel.value;
    if (this.registerForm.controls.active.value != null)
      newUser.isActive = this.registerForm.controls.active.value;
    if (this.fileInBase64 != null) {
      var splitted = this.fileInBase64.split(",", 2);
      newUser.account.photo = splitted[1];
    }
    newUser.account.createTime = new Date();
    newUser.account.modifyTime = new Date();

    var th = this;
	  
	this.stub.addUser(newUser)
	  .then(function (operationStatus: operationStatusInfo) {
		var message = "User added successfully";
        console.log(message);
        alert(message);
        th.router.navigate(['/users']);
      }).catch(function(err) {
        console.log("Error while adding new user");
        alert(err);
	    th.loading = false;
      });
  }

  enableBtn(): boolean {
    if (this.photo.length > 24 && this.registerForm.controls.username.value.length > 0 && this.registerForm.controls.password.value.length > 0
      && this.registerForm.controls.lastName.value.length > 0 && this.registerForm.controls.firstName.value.length > 0
      && this.registerForm.controls.nickName.value.length > 0 && this.registerForm.controls.email.value.length > 0
      && this.registerForm.controls.birthday.value != null)
      return true;
    return false;
  }
}