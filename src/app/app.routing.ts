import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from '../app/login/login.component';
import { FullProfileComponent } from './full-profile/full-profile.component';
import { StudentsComponent } from './students/students.component';
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
import { SignUpTeacherComponent} from './sign-up-teacher/sign-up-teacher.component';
import { SignUpWorkPlansComponent } from './sign-up-work-plans/sign-up-work-plans.component';
import { SignUpScheduleComponent } from './sign-up-schedule/sign-up-schedule.component';
import { FullProfileStudentComponent } from './full-profile-student/full-profile-student.component';
import { FullProfileSubjectComponent } from './full-profile-subject/full-profile-subject.component';
import { FullProfileTeacherComponent } from './full-profile-teacher/full-profile-teacher.component';
import { FullProfileWorkPlansComponent } from './full-profile-work-plans/full-profile-work-plans.component';
import { FullProfileScheduleComponent } from './full-profile-schedule/full-profile-schedule.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { WorksAndProjectsComponent } from './works-and-projects/works-and-projects.component';

import { AuthGuard } from './_services/auth.guard';
import { ProfileGuard } from './_services/profile.guard';
import { TeacherGuard } from './_services/teacher.guard';
import { StudentGuard } from './_services/student.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'students-control', component: StudentsControlComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'subjects-control', component: SubjectsControlComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'teachers-control', component: TeachersControlComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'work-plans-control', component: WorkPlansControlComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'schedule-control', component: ScheduleControlComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'register-student', component: SignUpStudentComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'register-subject', component: SignUpSubjectComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'register-teacher', component: SignUpTeacherComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'register-work-plans', component: SignUpWorkPlansComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'register-schedule', component: SignUpScheduleComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'full-profile', component: FullProfileComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'full-profile-student/:id', component: FullProfileStudentComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'full-profile-subject/:id', component: FullProfileSubjectComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'full-profile-teacher/:id', component: FullProfileTeacherComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'full-profile-work-plans/:id', component: FullProfileWorkPlansComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'full-profile-schedule/:id', component: FullProfileScheduleComponent, canActivate: [AuthGuard, ProfileGuard] },
  { path: 'students', component: StudentsComponent, canActivate: [AuthGuard, TeacherGuard] },
  { path: 'work-plans', component: WorkPlansComponent, canActivate: [AuthGuard, TeacherGuard] },
  { path: 'modules', component: ModulesComponent, canActivate: [AuthGuard, TeacherGuard] },
  { path: 'student-modules', component: StudentModulesComponent, canActivate: [AuthGuard, TeacherGuard] },
  { path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard, StudentGuard] },
  { path: 'works-and-projects', component: WorksAndProjectsComponent, canActivate: [AuthGuard, StudentGuard] },
];

export const appRoutingModule = RouterModule.forRoot(routes);
