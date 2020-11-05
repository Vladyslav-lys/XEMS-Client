import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '../app/login/login.component';
import { HomeComponent } from './home/home.component';

import { StudentsComponent } from './students/students.component';
//import { WorkingPlansComponent } from './working-plans/working-plans.component';
//import { ReportingBySubjectsComponent } from './reporting-by-subject/reporting-by-subject.component';

import { StudentsControlComponent } from './students-control/students-control.component';
//import { SubjectsControlComponent } from './subjects-control/subjects-control.component';
//import { DisciplinesControlComponent } from './disciplines-control/disciplines-control.component';
//import { GroupsControlComponent } from './groups-control/groups-control.component';
//import { TeachersControlComponent } from './teachers-control/teachers-control.component';
//import { WorkingPlansControlComponent } from './working-plans-control/working-plans-control.component';
//import { ReportingBySubjectsControlComponent } from './reporting-by-subject-control/reporting-by-subject-control.component';

import { SignUpStudentComponent } from './sign-up-student/sign-up-student.component';
//import { SignUpSubjectComponent } from './sign-up-subject/sign-up-subject.component';
//import { SignUpDisciplineComponent } from './sign-up-discipline/sign-up-discipline.component';
//import { SignUpGroupComponent } from './sign-up-group/sign-up-group.component';
//import { SignUpTeacherComponent } from './sign-up-teacher/sign-up-teacher.component';
//import { SignUpWorkingPlansComponent } from './sign-up-working-plans/sign-up-working-plans.component';
//import { SignUpReportingBySubjectComponent } from './sign-up-reporting-by-subject/sign-up-reporting-by-subject.component';

import { FullProfileStudentComponent } from './full-profile-student/full-profile-student.component';
//import { FullProfileSubjectComponent } from './full-profile-subject/full-profile-subject.component';
//import { FullProfileDisciplineComponent } from './full-profile-discipline/full-profile-discipline.component';
//import { FullProfileGroupComponent } from './full-profile-group/full-profile-group.component';
//import { FullProfileTeacherComponent } from './full-profile-teacher/full-profile-teacher.component';
//import { FullProfileWorkingPlansComponent } from './full-profile-working-plans/full-profile-working-plans.component';
//import { FullProfileReportingBySubjectComponent } from './full-profile-reporting-by-subject/full-profile-reporting-by-subject.component';
//import { ProfileAdminComponent } from './profile-admin/profile-admin.component';
//import { ProfileTeacherComponent } from './profile-teacher/profile-teacher.component';
//import { ProfileStudentComponent } from './profile-student/profile-student.component';

import { AuthGuard } from './_guards/auth.guard';
import { AdminGuard } from './_guards/admin.guard';
import { TeacherGuard } from './_guards/teacher.guard';
import { StudentGuard } from './_guards/student.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  //{ path: 'working-plans', component: WorkingPlansComponent, canActivate: [AuthGuard, TeacherGuard] },
  //{ path: 'reporting-by-subject', component: ReportingBySubjectComponent, canActivate: [AuthGuard, StudentGuard] },
  { path: 'students', component: StudentsComponent, canActivate: [AuthGuard, TeacherGuard] },
  { path: 'students-control', component: StudentsControlComponent, canActivate: [AuthGuard, AdminGuard] },
  //{ path: 'subjects-control', component: SubjectsControlComponent, canActivate: [AuthGuard, AdminGuard] },
  //{ path: 'disciplines-control', component: DisciplinesControlComponent, canActivate: [AuthGuard, AdminGuard] },
  //{ path: 'groups-control', component: GroupsControlComponent, canActivate: [AuthGuard, AdminGuard] },
  //{ path: 'teachers-control', component: TeachersControlComponent, canActivate: [AuthGuard, AdminGuard] },
  //{ path: 'working-plans-control', component: WorkingPlansControlComponent, canActivate: [AuthGuard, AdminGuard] },
  //{ path: 'reporting-by-subject-control', component: ReportingBySubjectControlComponent, canActivate: [AuthGuard, TeacherGuard] },
  { path: 'register-student', component: SignUpStudentComponent, canActivate: [AuthGuard, AdminGuard] },
 // { path: 'register-subject', component: SignUpSubjectComponent, canActivate: [AuthGuard, AdminGuard] },
 // { path: 'register-discipline', component: SignUpDisciplineComponent, canActivate: [AuthGuard, AdminGuard] },
 // { path: 'register-group', component: SignUpGroupComponent, canActivate: [AuthGuard, AdminGuard] },
 // { path: 'register-teacher', component: SignUpTeacherComponent, canActivate: [AuthGuard, AdminGuard] },
  //{ path: 'register-working-plans', component: SignUpWorkingPlansComponent, canActivate: [AuthGuard, AdminGuard] },
  //{ path: 'register-reporting-by-subject', component: SignUpReportingBySubjectComponent, canActivate: [AuthGuard, TeacherGuard] },
  { path: 'full-profile-student/:id', component: FullProfileStudentComponent, canActivate: [AuthGuard, AdminGuard] },
 // { path: 'full-profile-subject/:id', component: FullProfileSubjectComponent, canActivate: [AuthGuard, AdminGuard] },
 // { path: 'full-profile-discipline/:id', component: FullProfileDisciplineComponent, canActivate: [AuthGuard, AdminGuard] },
 // { path: 'full-profile-group/:id', component: FullProfileGroupComponent, canActivate: [AuthGuard, AdminGuard] },
 // { path: 'full-profile-teacher/:id', component: FullProfileTeacherComponent, canActivate: [AuthGuard, AdminGuard] },
  //{ path: 'full-profile-working-plans/:id', component: FullProfileWorkingPlansComponent, canActivate: [AuthGuard, AdminGuard] },
  //{ path: 'full-profile-reporting-by-subject/:id', component: FullProfileReportingBySubjectComponent, canActivate: [AuthGuard, TeacherGuard] }
  //{ path: 'profile-admin', component: ProfileAdminComponent, canActivate: [AuthGuard, AdminGuard] }
  //{ path: 'profile-teacher', component: ProfileTeacherComponent, canActivate: [AuthGuard, TeacherGuard] }
  //{ path: 'profile-student', component: ProfileStudentComponent, canActivate: [AuthGuard, StudentGuard] }
];

export const appRoutingModule = RouterModule.forRoot(routes);
