﻿import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { appRoutingModule } from './app.routing';
import { AlertComponent } from './alert/alert.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AuthGuard } from './_services/auth.guard';
import { LeftmenuComponent } from './leftmenu/leftmenu.component';
import { ProfileGuard } from './_services/profile.guard';
import { FullProfileComponent } from './full-profile/full-profile.component';
import { StudentsComponent } from './students/students.component';
import { NotificationComponent } from './notification/notification.component';
import { HomeComponent } from './home/home.component';
import { WorkPlansComponent } from './work-plans/work-plans.component';
import { StudentModulesComponent } from './student-modules/student-modules.component';
import { ModulesComponent } from './modules/modules.component';
import { StudentsControlComponent } from './students-control/students-control.component';
import { SubjectsControlComponent } from './subjects-control/subjects-control.component';
import { TeachersControlComponent } from './teachers-control/teachers-control.component';
import { WorkPlansControlComponent } from './work-plans-control/work-plans-control.component';
import { ScheduleControlComponent } from './schedule-control/schedule-control.component';
import { SignUpStudentComponent } from './sign-up-student/sign-up-student.component';
import { SignUpSubjectComponent } from './sign-up-subject/sign-up-subject.component';
import { SignUpTeacherComponent } from './sign-up-teacher/sign-up-teacher.component';
import { SignUpWorkPlansComponent } from './sign-up-work-plans/sign-up-work-plans.component';
import { SignUpScheduleComponent } from './sign-up-schedule/sign-up-schedule.component';
import { FullProfileStudentComponent } from './full-profile-student/full-profile-student.component';
import { FullProfileSubjectComponent } from './full-profile-subject/full-profile-subject.component';
import { FullProfileTeacherComponent } from './full-profile-teacher/full-profile-teacher.component';
import { FullProfileWorkPlansComponent } from './full-profile-work-plans/full-profile-work-plans.component';
import { FullProfileScheduleComponent } from './full-profile-schedule/full-profile-schedule.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { WorksAndProjectsComponent } from './works-and-projects/works-and-projects.component';

@NgModule({
  declarations: [
    AppComponent,
	LoginComponent,
    AlertComponent,
	HeaderComponent,
    FooterComponent,
    LeftmenuComponent,
    FullProfileComponent,
    NotificationComponent,
	StudentsComponent,
	HomeComponent,
	WorkPlansComponent,
	StudentModulesComponent,
	ModulesComponent,
	StudentsControlComponent,
	SubjectsControlComponent,
	TeachersControlComponent,
	WorkPlansControlComponent,
	ScheduleControlComponent,
	SignUpStudentComponent,
	SignUpSubjectComponent,
	SignUpTeacherComponent,
	SignUpWorkPlansComponent,
	SignUpScheduleComponent,
	FullProfileStudentComponent,
	FullProfileSubjectComponent,
	FullProfileTeacherComponent,
	FullProfileWorkPlansComponent,
	FullProfileScheduleComponent,
	ScheduleComponent,
	WorksAndProjectsComponent
  ],
  imports: [
    BrowserModule,
	HttpClientModule,
    ReactiveFormsModule,
    appRoutingModule,
	BrowserAnimationsModule,
	ToastrModule.forRoot(),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
