﻿﻿import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MsalModule, MsalInterceptor } from '@azure/msal-angular';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { appRoutingModule } from './app.routing';
import { AlertComponent } from './alert/alert.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LeftmenuComponent } from './leftmenu/leftmenu.component';
import { HomeComponent } from './home/home.component';
import { MasterDetailModule } from './master-detail/master-detail.module';
import { DetailComponent } from './master-detail/detail.component';

import { StudentsComponent } from './students/students.component';
import { NotificationComponent } from './notification/notification.component';
import { WorkingPlansComponent } from './working-plans/working-plans.component';
import { ReportingBySubjectComponent } from './reporting-by-subject/reporting-by-subject.component';

import { StudentsControlComponent } from './students-control/students-control.component';
import { SubjectsControlComponent } from './subjects-control/subjects-control.component';
import { DisciplinesControlComponent } from './disciplines-control/disciplines-control.component';
import { GroupsControlComponent } from './groups-control/groups-control.component';
import { TeachersControlComponent } from './teachers-control/teachers-control.component';
import { WorkingPlansControlComponent } from './working-plans-control/working-plans-control.component';
import { ReportingBySubjectControlComponent } from './reporting-by-subject-control/reporting-by-subject-control.component';

import { SignUpStudentComponent } from './sign-up-student/sign-up-student.component';
import { SignUpSubjectComponent } from './sign-up-subject/sign-up-subject.component';
import { SignUpDisciplineComponent } from './sign-up-discipline/sign-up-discipline.component';
import { SignUpGroupComponent } from './sign-up-group/sign-up-group.component';
import { SignUpTeacherComponent } from './sign-up-teacher/sign-up-teacher.component';
import { SignUpWorkingPlansComponent } from './sign-up-working-plan/sign-up-working-plan.component';
import { SignUpReportingBySubjectComponent } from './sign-up-reporting-by-subject/sign-up-reporting-by-subject.component';
import { SignUpSubjectForMultipleStudentsComponent } from './sign-up-subject-for-multiple-students/sign-up-subject-for-multiple-students.component';

import { FullProfileStudentComponent } from './full-profile-student/full-profile-student.component';
import { FullProfileSubjectComponent } from './full-profile-subject/full-profile-subject.component';
import { FullProfileDisciplineComponent } from './full-profile-discipline/full-profile-discipline.component';
//import { FullProfileGroupComponent } from './full-profile-group/full-profile-group.component';
import { FullProfileTeacherComponent } from './full-profile-teacher/full-profile-teacher.component';
import { FullProfileWorkingPlansComponent } from './full-profile-working-plan/full-profile-working-plan.component';
import { SyncGroupsWithTeamsComponent } from './sync-groups-with-teams/sync-groups-with-teams.component';
import { FilterWorkingPlansComponent } from './filter-working-plan/filter-working-plan.component';
import { JournalComponent } from './journal/journal.component';
//import { FullProfileReportingBySubjectComponent } from './full-profile-reporting-by-subject/full-profile-reporting-by-subject.component';
//import { ProfileAdminComponent } from './profile-admin/profile-admin.component';
//import { ProfileTeacherComponent } from './profile-teacher/profile-teacher.component';
//import { ProfileStudentComponent } from './profile-student/profile-student.component';

import { FirstEnterDataComponent } from './first-enter-data/first-enter-data.component';

import { AuthGuard } from './_guards/auth.guard';
import { AdminGuard } from './_guards/admin.guard';
import { TeacherGuard } from './_guards/teacher.guard';
import { StudentGuard } from './_guards/student.guard';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
	LoginComponent,
    AlertComponent,
	HeaderComponent,
    FooterComponent,
    LeftmenuComponent,
    NotificationComponent,
	HomeComponent,
	DetailComponent,
	StudentsComponent,
	WorkingPlansComponent,
	ReportingBySubjectComponent,
	StudentsControlComponent,
	SubjectsControlComponent,
	DisciplinesControlComponent,
	GroupsControlComponent,
	TeachersControlComponent,
	WorkingPlansControlComponent,
	ReportingBySubjectControlComponent,
	SignUpStudentComponent,
	SignUpSubjectComponent,
	SignUpDisciplineComponent,
	SignUpGroupComponent,
	SignUpTeacherComponent,
	SignUpWorkingPlansComponent,
	SignUpReportingBySubjectComponent,
	SignUpSubjectForMultipleStudentsComponent,
	FullProfileStudentComponent,
	FullProfileSubjectComponent,
	FullProfileDisciplineComponent,
	//FullProfileGroupComponent,
	FullProfileTeacherComponent,
	FullProfileWorkingPlansComponent,
	SyncGroupsWithTeamsComponent,
	FilterWorkingPlansComponent,
	JournalComponent,
	//FullProfileReportingBySubjectComponent,
	//ProfileAdminComponent,
	//ProfileTeacherComponent,
	//ProfileStudentComponent
	FirstEnterDataComponent
  ],
  imports: [
    BrowserModule,
	HttpClientModule,
    ReactiveFormsModule,
    appRoutingModule,
	BrowserAnimationsModule,
	ToastrModule.forRoot(),
    FormsModule,
	MasterDetailModule,
    StoreModule.forRoot({}, {}),
	MsalModule.forRoot({
      auth: {
        clientId: 'e09f0ab1-1679-4a98-aaac-677edbcb99d1',
        authority: 'https://login.microsoftonline.com/72e42a61-9cee-4b78-8828-29b226163bd7',
        redirectUri: 'http://localhost:4200/',
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // set to true for IE 11
      },
    },
    {
      popUp: !isIE,
      consentScopes: [
        'user.read',
        'openid',
        'profile',
      ],
      unprotectedResources: [],
      protectedResourceMap: [
        ['https://graph.microsoft.com/v1.0/me', ['user.read']]
      ],
      extraQueryParameters: {}
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
