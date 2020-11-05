import { Injectable } from '@angular/core';
import { SignalRService } from './signalR.service';
import {Router} from '@angular/router';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';
import { Authorization } from '../_models/authorization';
import { Student } from '../_models/student';
import { Teacher } from '../_models/teacher';
import { Group } from '../_models/group';
import { Discipline } from '../_models/discipline';
import { Subject } from '../_models/subject';
import { Identifiable } from "../_models/base/identifiable";
import { WorkingPlan } from '../_models/workingPlan';
import { ReportingBySubject } from '../_models/reportingBySubject';
import { ReportingBySubjectAdditionalMaterials } from '../_models/reportingBySubjectAdditionalMaterials';
import { ReportingPlanByModules } from '../_models/reportingPlanByModules';
import { ReportingPlanByTeachers } from '../_models/reportingPlanByTeachers';
import { ToastrService } from 'ngx-toastr';
import { Message } from "../_models/message";
import { CourseTask } from "../_enums/courseTask";
import { Degree } from "../_enums/degree";
import { ReportingBySemesterType } from "../_enums/reportingBySemesterType";
import { ReportingBySubjectType } from "../_enums/reportingBySubjectType";
import { Semester } from "../_enums/semester";
import { TeachersRole } from "../_enums/teachersRole";
import { AccessLevel } from "../_enums/accessLevel";

@Injectable({ providedIn: 'root' })
export class StubService {
    authorization:Authorization;
	
	authorizations:Array<Authorization>;
	accountToAuthStudents:Array<AccountToAuth>;
	accountToAuthTeachers:Array<AccountToAuth>;
	
	students:Array<Student>;
	teachers:Array<Teacher>;
	subjects:Array<Subject>;
	disciplines:Array<Discipline>;
	workingPlans:Array<WorkingPlan>;
	reportingBySubjects:Array<ReportingBySubject>;
	reportingBySubjectAdditionalMaterialss:Array<ReportingBySubjectAdditionalMaterials>;
	groups:Array<Group>;
	
    constructor(
	  private router: Router
    ) {
		//localStorage.clear();
		this.authorizations = new Array<Authorization>();
		if(sessionStorage.authorizations != null)
			this.authorizations = JSON.parse(sessionStorage.authorizations);
		this.students = new Array<Student>();
		if(sessionStorage.students != null)
			this.students = JSON.parse(sessionStorage.students);
		this.teachers = new Array<Teacher>();
		if(sessionStorage.teachers != null)
			this.teachers = JSON.parse(sessionStorage.teachers);
		this.disciplines = new Array<Discipline>();
		if(sessionStorage.disciplines != null)
			this.disciplines = JSON.parse(sessionStorage.disciplines);
		this.subjects = new Array<Subject>();
		if(sessionStorage.subjects != null)
			this.subjects = JSON.parse(sessionStorage.subjects);
		this.groups = new Array<Group>();
		if(sessionStorage.groups != null)
			this.groups = JSON.parse(sessionStorage.groups);
		this.workingPlans = new Array<WorkingPlan>();
		if(sessionStorage.workingPlans != null)
			this.workingPlans = JSON.parse(sessionStorage.workingPlans);
		this.reportingBySubjects = new Array<ReportingBySubject>();
		if(sessionStorage.reportingBySubjects != null)
			this.reportingBySubjects = JSON.parse(sessionStorage.reportingBySubjects);
		this.reportingBySubjectAdditionalMaterialss = new Array<ReportingBySubjectAdditionalMaterials>();
		if(sessionStorage.reportingBySubjectAdditionalMaterialss != null)
			this.reportingBySubjectAdditionalMaterialss = JSON.parse(sessionStorage.reportingBySubjectAdditionalMaterialss);
		
		this.accountToAuthStudents = new Array<AccountToAuth>();
		if(sessionStorage.accountToAuthStudents != null)
			this.accountToAuthStudents = JSON.parse(sessionStorage.accountToAuthStudents);
		this.accountToAuthTeachers = new Array<AccountToAuth>();
		if(sessionStorage.accountToAuthTeachers != null)
			this.accountToAuthTeachers = JSON.parse(sessionStorage.accountToAuthTeachers);
		
		if(localStorage.currentAuthorization != null)
			this.authorization = JSON.parse(localStorage.currentAuthorization);
		
		if(this.disciplines == null || this.disciplines === undefined || this.disciplines.length < 1)
		{
			let discipline1 = new Discipline();
			discipline1.id = 1;
			discipline1.title = "Math";
			this.disciplines.push(discipline1);
			
			let discipline2 = new Discipline();
			discipline2.id = 2;
			discipline2.title = "Physics";
			this.disciplines.push(discipline2);
			
			sessionStorage.setItem("disciplines", JSON.stringify(this.disciplines));
		}
		
		if(this.teachers == null || this.teachers === undefined || this.teachers.length < 1)
		{
			let teacher1 = new Teacher();
			teacher1.id = 1;
			teacher1.firstName = "Alex";
			teacher1.lastName = "Volkov";
			teacher1.birthday = new Date();
			teacher1.phone = "+380982281488";
			teacher1.address = "pr. Heroev, 7";
			teacher1.createTime = new Date();
			teacher1.modifyTime = new Date();
			this.teachers.push(teacher1);
			
			let teacher2 = new Teacher();
			teacher2.id = 2;
			teacher2.firstName = "Alex";
			teacher2.lastName = "Volkov";
			teacher2.birthday = new Date();
			teacher2.phone = "+380982281488";
			teacher2.address = "pr. Heroev, 7";
			teacher2.createTime = new Date();
			teacher2.modifyTime = new Date();
			this.teachers.push(teacher2);
			
			sessionStorage.setItem("teachers", JSON.stringify(this.teachers));
		}
		
		if(this.groups == null || this.groups === undefined || this.groups.length < 1)
		{
			let group1 = new Group();
			group1.id = 1;
			group1.name = "KI-19m-1";
			group1.curator = this.teachers[0];
			group1.learningStartDate = new Date();
			group1.learningEndDate = new Date();
			group1.degree = Degree.Bachelor;
			this.groups.push(group1);
			
			let group2 = new Group();
			group2.id = 2;
			group2.name = "KI-19m-2";
			group2.curator = this.teachers[1];
			group2.learningStartDate = new Date();
			group2.learningEndDate = new Date();
			group2.degree = Degree.Master;
			this.groups.push(group2);
			
			sessionStorage.setItem("groups", JSON.stringify(this.groups));
		}
		
		if(this.students == null || this.students === undefined || this.students.length < 1)
		{
			let student1 = new Student();
			student1.id = 1;
			student1.group = group1;
			student1.firstName = "Uri";
			student1.lastName = "Gorbachov";
			student1.birthday = new Date();
			student1.phone = "+380666666666";
			student1.address = "ul. Vichka, 7";
			student1.createTime = new Date();
			student1.modifyTime = new Date();
			this.students.push(student1);
			
			let student2 = new Student();
			student2.id = 2;
			student2.group = group2;
			student2.firstName = "Kiril";
			student2.lastName = "Petrov";
			student2.birthday = new Date();
			student2.phone = "+380777777777";
			student2.address = "ul. Bogdana, 1";
			student2.createTime = new Date();
			student2.modifyTime = new Date();
			this.students.push(student2);
			
			sessionStorage.setItem("students", JSON.stringify(this.students));
		}
		
		if(this.authorizations == null || this.authorizations === undefined || this.authorizations.length < 1)
		{
			let authorization1 = new Authorization();
			authorization1.id = 1;
			authorization1.login = "admin";
			authorization1.password = "admin";
			authorization1.isActive = true;
			authorization1.refreshToken = "11";
			authorization1.refreshTokenExpiryTime = new Date("2020-10-20");
			authorization1.accessLevel = AccessLevel.Admin;
			this.authorizations.push(authorization1);
			
			let authorization2 = new Authorization();
			authorization2.id = 2;
			authorization2.login = "log";
			authorization2.password = "pass";
			authorization2.isActive = true;
			authorization1.refreshToken = "22";
			authorization1.refreshTokenExpiryTime = new Date("2020-10-20");
			authorization2.accessLevel = AccessLevel.Teacher;
			this.authorizations.push(authorization2);
			this.accountToAuthTeachers.push(new AccountToAuth(this.teachers[0].id, authorization2.id));
			
			let authorization3 = new Authorization();
			authorization3.id = 3;
			authorization3.login = "login";
			authorization3.password = "password";
			authorization3.isActive = true;
			authorization1.refreshToken = "33";
			authorization1.refreshTokenExpiryTime = new Date("2020-10-20");
			authorization3.accessLevel = AccessLevel.Teacher;
			this.authorizations.push(authorization3);
			this.accountToAuthTeachers.push(new AccountToAuth(this.teachers[1].id, authorization3.id));
			
			let authorization4 = new Authorization();
			authorization4.id = 4;
			authorization4.login = "gorb";
			authorization4.password = "gorb";
			authorization4.isActive = true;
			authorization1.refreshToken = "44";
			authorization1.refreshTokenExpiryTime = new Date("2020-10-20");
			authorization4.accessLevel = AccessLevel.Student;
			this.authorizations.push(authorization4);
			this.accountToAuthStudents.push(new AccountToAuth(this.students[0].id, authorization4.id));
		
			let authorization5 = new Authorization();
			authorization5.id = 5;
			authorization5.login = "kir";
			authorization5.password = "petr";
			authorization5.isActive = true;
			authorization1.refreshToken = "55";
			authorization1.refreshTokenExpiryTime = new Date("2020-10-20");
			authorization5.accessLevel = AccessLevel.Student;
			this.authorizations.push(authorization5);
			this.accountToAuthStudents.push(new AccountToAuth(this.students[1].id, authorization5.id));
			
			sessionStorage.setItem("authorizations", JSON.stringify(this.authorizations));
			sessionStorage.setItem("accountToAuthStudents", JSON.stringify(this.accountToAuthStudents));
			sessionStorage.setItem("accountToAuthTeachers", JSON.stringify(this.accountToAuthTeachers));
		}
		
		if(this.subjects == null || this.subjects === undefined || this.subjects.length < 1)
		{
			let subject1 = new Subject();
			subject1.id = 1;
			subject1.student = this.students[0].account;
			subject1.discipline = this.disciplines[0];
			subject1.year = 2020;
			subject1.semester = Semester.FirstWithWinterSession;
			subject1.lectureHours = 30;
			subject1.practiceHours = 30;
			subject1.laboratoryHours = 10;
			subject1.reporting = ReportingBySemesterType.Credit;
			subject1.courseTask = CourseTask.None;
			subject1.semesterGrade = 5;
			this.subjects.push(subject1);
			
			let subject2 = new Subject();
			subject2.id = 2;
			subject2.student = this.students[1].account;
			subject2.discipline = this.disciplines[1];
			subject2.year = 2020;
			subject2.semester = Semester.FirstWithWinterSession;
			subject2.lectureHours = 20;
			subject2.practiceHours = 20;
			subject2.laboratoryHours = 20;
			subject2.reporting = ReportingBySemesterType.Credit;
			subject2.courseTask = CourseTask.CourseWork;
			subject2.semesterGrade = 4;
			this.subjects.push(subject2);
			
			sessionStorage.setItem("subjects", JSON.stringify(this.subjects));
		}
		
		if(this.workingPlans == null || this.workingPlans === undefined || this.workingPlans.length < 1)
		{
			let workingPlan1 = new WorkingPlan();
			workingPlan1.id = 1;
			workingPlan1.teacher = this.teachers[0];
			workingPlan1.discipline = this.disciplines[0];
			workingPlan1.hours = 60;
			workingPlan1.role = TeachersRole.Lection;
			workingPlan1.year = 2020;
			workingPlan1.semester = Semester.FirstWithWinterSession;
			this.workingPlans.push(workingPlan1);
			
			let workingPlan2 = new WorkingPlan();
			workingPlan2.id = 2;
			workingPlan2.teacher = this.teachers[1];
			workingPlan2.discipline = this.disciplines[1];
			workingPlan2.hours = 40;
			workingPlan2.role = TeachersRole.Practice;
			workingPlan2.year = 2020;
			workingPlan2.semester = Semester.FirstWithWinterSession;
			this.workingPlans.push(workingPlan2);
			
			sessionStorage.setItem("workingPlans", JSON.stringify(this.workingPlans));
		}
		
		if(this.reportingBySubjects == null || this.reportingBySubjects === undefined || this.reportingBySubjects.length < 1)
		{
			let reportingBySubject1 = new ReportingBySubject();
			reportingBySubject1.id = 1;
			reportingBySubject1.teacher = this.teachers[0];
			reportingBySubject1.student = this.students[0];
			reportingBySubject1.title = "Module1";
			reportingBySubject1.description = "Module for subject";
			reportingBySubject1.reporting = ReportingBySubjectType.Module;
			reportingBySubject1.dueDate = new Date();
			reportingBySubject1.realDueDate = new Date();
			reportingBySubject1.isCompleted = true;
			reportingBySubject1.grade = 4;
			this.reportingBySubjects.push(reportingBySubject1);
			
			let reportingBySubject2 = new ReportingBySubject();
			reportingBySubject2.id = 2;
			reportingBySubject2.teacher = this.teachers[1];
			reportingBySubject2.student = this.students[1];
			reportingBySubject2.title = "CourseTask1";
			reportingBySubject2.description = "CourseTask for subject";
			reportingBySubject2.reporting = ReportingBySubjectType.CourseTask;
			reportingBySubject2.dueDate = new Date();
			reportingBySubject2.realDueDate = new Date();
			reportingBySubject2.isCompleted = true;
			reportingBySubject2.grade = 3;
			this.reportingBySubjects.push(reportingBySubject2);
			
			sessionStorage.setItem("reportingBySubjects", JSON.stringify(this.reportingBySubjects));
		}
		
		if(this.reportingBySubjectAdditionalMaterialss == null || this.reportingBySubjectAdditionalMaterialss === undefined || this.reportingBySubjectAdditionalMaterialss.length < 1)
		{
			let reportingBySubjectAdditionalMaterials1 = new ReportingBySubjectAdditionalMaterials();
			reportingBySubjectAdditionalMaterials1.id = 1;
			reportingBySubjectAdditionalMaterials1.reportingBySubject = this.reportingBySubjects[0];
			reportingBySubjectAdditionalMaterials1.material = "";
			this.reportingBySubjectAdditionalMaterialss.push(reportingBySubjectAdditionalMaterials1);
			
			let reportingBySubjectAdditionalMaterials2 = new ReportingBySubjectAdditionalMaterials();
			reportingBySubjectAdditionalMaterials2.id = 2;
			reportingBySubjectAdditionalMaterials2.reportingBySubject = this.reportingBySubjects[1];
			reportingBySubjectAdditionalMaterials2.material = "https://www.google.com.ua/?hl=ru";
			this.reportingBySubjectAdditionalMaterialss.push(reportingBySubjectAdditionalMaterials2);
			
			sessionStorage.setItem("reportingBySubjectAdditionalMaterialss", JSON.stringify(this.reportingBySubjectAdditionalMaterialss));
		}
    }

    login(username, password) {
      var th = this;
	  var authorization = new Authorization();
        return new Promise(function (resolve, reject) {
		  
		  for(var i in th.authorizations)
		  {
			  if(th.authorizations[i].login == username && th.authorizations[i].password == password)
			  {
				  th.authorization = th.authorizations[i];
				  break;
			  }				  
		  }
		  
		  var operationStatusInfo = new operationStatusInfo();
		  operationStatusInfo.operationStatus = operationStatus.Done;
		  operationStatusInfo.attachedObject = [th.authorization.id, th.authorization.accessLevel, "aa", th.authorization.refreshToken];
		  operationStatusInfo.attachedInfo = "";
		  
		  resolve(operationStatusInfo);
      });
    }

    logout(id) {
	  sessionStorage.clear();
	  localStorage.clear();
	  this.router.navigate(['/login']);
	
	  return new Promise(function (resolve, reject) {
		var operationStatus = null;
        resolve(operationStatus);
      });
    }
	
  invokeUpdateAuthorizationInfo(authorization) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		for(var i in th.authorizations)
		{
			if(th.authorizations[i].id == authorization.id)
			{
				th.authorizations[i] = authorization;
				break;
			}
		}
		
		sessionStorage.setItem("authorizations", JSON.stringify(th.authorizations)); 
		
		var operationStatusInfo = new operationStatusInfo();
		operationStatusInfo.operationStatus = operationStatus.Done;
		operationStatusInfo.attachedObject = authorization;
		operationStatusInfo.attachedInfo = "";
		
		resolve(operationStatusInfo);
    });
  }
  
  invokeUpdateAcitveTeacherInfo(id, isActive) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		for(var i in th.accountToAuthTeachers)
		{
			if(th.accountToAuthTeachers[i].accountId == id)
			{
				for(var j in th.authorizations)
				{
					if(th.authorizations[j].id == th.accountToAuthTeachers[i].authId)
					{
						th.authorizations[j].isActive = isActive;
						sessionStorage.setItem("authorizations", JSON.stringify(th.authorizations)); 
						break;
					}
				}
				break;
			}
		}
		
		var operationStatusInfo = new operationStatusInfo();
		operationStatusInfo.operationStatus = operationStatus.Done;
		operationStatusInfo.attachedObject = null;
		operationStatusInfo.attachedInfo = "";
		
		resolve(operationStatusInfo);
    });
  }
  
  invokeUpdateAcitveStudentInfo(id, isActive) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		for(var i in th.accountToAuthStudents)
		{
			if(th.accountToAuthStudents[i].accountId == id)
			{
				for(var j in th.authorizations)
				{
					if(th.authorizations[j].id == th.accountToAuthStudents[i].authId)
					{
						th.authorizations[j].isActive = isActive;
						sessionStorage.setItem("authorizations", JSON.stringify(th.authorizations)); 
						break;
					}
				}
				break;
			}
		}
		
		var operationStatusInfo = new operationStatusInfo();
		operationStatusInfo.operationStatus = operationStatus.Done;
		operationStatusInfo.attachedObject = null;
		operationStatusInfo.attachedInfo = "";
		
		resolve(operationStatusInfo);
    });
  }
  
  invokeUpdateTeacherInfo(teacher) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		for(var i in th.teachers)
		{
			if(th.teachers[i].id == teacher.id)
			{
				th.teachers[i] = teacher;
				break;
			}
		}
		
		sessionStorage.setItem("teachers", JSON.stringify(th.teachers));
		
		var operationStatusInfo = new operationStatusInfo();
		operationStatusInfo.operationStatus = operationStatus.Done;
		operationStatusInfo.attachedObject = teacher;
		operationStatusInfo.attachedInfo = "";
		
		resolve(operationStatusInfo);
    });
  }
  
  invokeUpdateStudentInfo(student) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		for(var i in th.students)
		{
			if(th.students[i].id == student.id)
			{
				th.students[i] = student;
				break;
			}
		}
		
		sessionStorage.setItem("students", JSON.stringify(th.students));
		
		var operationStatusInfo = new operationStatusInfo();
		operationStatusInfo.operationStatus = operationStatus.Done;
		operationStatusInfo.attachedObject = student;
		operationStatusInfo.attachedInfo = "";
		
		resolve(operationStatusInfo);
    });
  }
  
  invokeUpdateDisciplineInfo(discipline) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		for(var i in th.disciplines)
		{
			if(th.disciplines[i].id == discipline.id)
			{
				th.disciplines[i] = discipline;
				break;
			}
		}
		
		sessionStorage.setItem("disciplines", JSON.stringify(th.disciplines));
		
		var operationStatusInfo = new operationStatusInfo();
		operationStatusInfo.operationStatus = operationStatus.Done;
		operationStatusInfo.attachedObject = discipline;
		operationStatusInfo.attachedInfo = "";
		
		resolve(operationStatusInfo);
    });
  }
  
  invokeUpdateSubjectInfo(subject) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		for(var i in th.subjects)
		{
			if(th.subjects[i].id == subject.id)
			{
				th.subjects[i] = subject;
				break;
			}
		}
		
		sessionStorage.setItem("subjects", JSON.stringify(th.subjects));
		
		var operationStatusInfo = new operationStatusInfo();
		operationStatusInfo.operationStatus = operationStatus.Done;
		operationStatusInfo.attachedObject = subject;
		operationStatusInfo.attachedInfo = "";
		
		resolve(operationStatusInfo);
    });
  }
  
  invokeUpdateWorkingPlanInfo(workingPlan) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		for(var i in th.workingPlans)
		{
			if(th.workingPlans[i].id == workingPlan.id)
			{
				th.workingPlans[i] = workingPlan;
				break;
			}
		}
		
		sessionStorage.setItem("workingPlans", JSON.stringify(th.workingPlans));
		
		var operationStatusInfo = new operationStatusInfo();
		operationStatusInfo.operationStatus = operationStatus.Done;
		operationStatusInfo.attachedObject = workingPlan;
		operationStatusInfo.attachedInfo = "";
		
		resolve(operationStatusInfo);
    });
  }
  
  invokeUpdateGroupInfo(group) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		for(var i in th.groups)
		{
			if(th.groups[i].id == group.id)
			{
				th.groups[i] = group;
				break;
			}
		}
		
		sessionStorage.setItem("groups", JSON.stringify(th.groups));
		
		var operationStatusInfo = new operationStatusInfo();
		operationStatusInfo.operationStatus = operationStatus.Done;
		operationStatusInfo.attachedObject = group;
		operationStatusInfo.attachedInfo = "";
		
		resolve(operationStatusInfo);
    });
  }
  
  invokeUpdateReportingBySubjectInfo(reportingBySubject) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		for(var i in th.reportingBySubjects)
		{
			if(th.reportingBySubjects[i].id == reportingBySubject.id)
			{
				th.reportingBySubjects[i] = reportingBySubject;
				break;
			}
		}
		
		sessionStorage.setItem("reportingBySubjects", JSON.stringify(th.reportingBySubjects));
		
		var operationStatusInfo = new operationStatusInfo();
		operationStatusInfo.operationStatus = operationStatus.Done;
		operationStatusInfo.attachedObject = reportingBySubject;
		operationStatusInfo.attachedInfo = "";
		
		resolve(operationStatusInfo);
    });
  }
  
  invokeUpdateReportingBySubjectAdditionalMaterialsInfo(reportingBySubjectAdditionalMaterials) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		for(var i in th.reportingBySubjectAdditionalMaterialss)
		{
			if(th.reportingBySubjectAdditionalMaterialss[i].id == reportingBySubjectAdditionalMaterials.id)
			{
				th.reportingBySubjectAdditionalMaterialss[i] = reportingBySubjectAdditionalMaterials;
				for(var j in th.reportingBySubjects)
				{
					if(th.reportingBySubjects[j].id == th.reportingBySubjectAdditionalMaterialss[i].reportingBySubject.id)
					{
						th.reportingBySubjects[j] = th.reportingBySubjectAdditionalMaterialss[i].reportingBySubject;
						break;
					}
				}
		
				sessionStorage.setItem("reportingBySubjects", JSON.stringify(th.reportingBySubjects));
				break;
			}
		}
		
		sessionStorage.setItem("reportingBySubjectAdditionalMaterialss", JSON.stringify(th.reportingBySubjectAdditionalMaterialss));
		
		var operationStatusInfo = new operationStatusInfo();
		operationStatusInfo.operationStatus = operationStatus.Done;
		operationStatusInfo.attachedObject = reportingBySubjectAdditionalMaterials;
		operationStatusInfo.attachedInfo = "";
		
		resolve(operationStatusInfo);
    });
  }
  
  getAllAuthorizations() {
	  var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.authorizations;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });
  }
  
  getAllStudents() {
	  var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.students;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });
  }
  
  getAllTeachers() {
	  var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.teachers;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });
  }
  
  getAllDisciplines() {
	  var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.disciplines;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });
  }
  
  getAllSubjects() {
	  var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.subjects;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });
  }
  
  getAlWorkingPlans() {
	  var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.workingPlans;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });
  }
  
  getAllGroups() {
	var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.groups;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });
  }
  
  getAllReportingBySubjects() {
	var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.reportingBySubjects;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });
  }
  
  getAllReportingBySubjectAdditionalMaterialss() {
	var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.reportingBySubjectAdditionalMaterialss;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });
  }
  
   getAllActives(accessLevel) {
	var th = this;
    return new Promise(function (resolve, reject) {
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		var isActives = [];
		for(var i in th.authorizations)
		{
			if(th.authorizations[i].accessLevel == accessLevel)
				isActives[i] = th.authorizations[i].isActive;
		}
		operationStatus.attachedObject = isActives;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });
  }
  
  getAuthorizationById(id)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		var authorization = new Authorization();
		for(var i in th.authorizations)
		{
			if(th.authorizations[i].id == id)
			{
				authorization = th.authorizations[i];
			}
		}			
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = authorization;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });  
  }
  
  getTeacherById(id)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		var teacher = new Teacher();
		for(var i in th.teachers)
		{
			if(th.teachers[i].id == id)
			{
				teacher = th.teachers[i];
				break;
			}
		}			
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = teacher;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });  
  }
  
  getTeacherByAuthId(id)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		var teacher = new Teacher();
		
		for(var i in th.accountToAuthTeachers)
		{
			if(th.accountToAuthTeachers[i].authId == id)
			{
				for(var j in th.teachers)
				{
					if(th.teachers[j].id == accountToAuthTeachers[i].accountId)
					{
						teacher = th.teachers[j];
						break;
					}
				}
				break;
			}
		}
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = teacher;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });  
  }
  
  getStudentById(id)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		var student = new Student();
		for(var i in th.students)
		{
			if(th.students[i].id == id)
			{
				student = th.students[i];
				break;
			}
		}			
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = student;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });  
  }
  
  getStudentByAuthId(id)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		var student = new Student();
		for(var i in th.accountToAuthStudents)
		{
			if(th.accountToAuthStudents[i].authId == id)
			{
				for(var j in th.students)
				{
					if(th.students[j].id == accountToAuthStudents[i].accountId)
					{
						student = th.students[j];
						break;
					}
				}
				break;
			}
		}
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = student;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });  
  }
  
  getDisciplineById(id)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		var discipline = new Discipline();
		for(var i in th.disciplines)
		{
			if(th.disciplines[i].id == id)
			{
				discipline = th.disciplines[i];
			}
		}			
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = discipline;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });  
  }
  
  getSubjectById(id)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		var subject = new Subject();
		for(var i in th.subjects)
		{
			if(th.subjects[i].id == id)
			{
				subject = th.subjects[i];
			}
		}			
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = subject;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });  
  }
  
  getWorkingPlanById(id)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		var workingPlan = new WorkingPlan();
		for(var i in th.workingPlans)
		{
			if(th.workingPlans[i].id == id)
			{
				workingPlan = th.workingPlans[i];
			}
		}			
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = workingPlan;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });  
  }
  
  getGroupById(id)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		var group = new Group();
		for(var i in th.groups)
		{
			if(th.groups[i].id == id)
			{
				group = th.groups[i];
			}
		}			
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = group;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });  
  }
  
  getReportingBySubjectById(id)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		var reportingBySubject = new ReportingBySubject();
		for(var i in th.reportingBySubjects)
		{
			if(th.reportingBySubjects[i].id == id)
			{
				reportingBySubject = th.reportingBySubjects[i];
			}
		}			
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = reportingBySubject;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });  
  }
  
  getReportingBySubjectAdditionalMaterialstById(id)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		var reportingBySubjectAdditionalMaterials = new ReportingBySubjectAdditionalMaterials();
		for(var i in th.reportingBySubjectAdditionalMaterialss)
		{
			if(th.reportingBySubjectAdditionalMaterialss[i].id == id)
			{
				reportingBySubjectAdditionalMaterials = th.reportingBySubjectAdditionalMaterialss[i];
			}
		}			
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = reportingBySubjectAdditionalMaterials;
		operationStatus.attachedInfo = "";
		
      resolve(operationStatus);
    });  
  }
  
   getActiveStudentById(id) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		var isActive = false;	
		for(var i in th.accountToAuthStudents)
		{
			if(th.accountToAuthStudents[i].accountId == id)
			{
				for(var j in th.authorizations)
				{
					if(th.authorizations[j].id == th.accountToAuthStudents[i].authId)
					{
						isActive = th.authorizations[i].isActive;
						break;
					}
				}
				break;
			}
		}
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = isActive;
		operationStatus.attachedInfo = "";
		
		resolve(operationStatus);
    });
  }
  
  getActiveTeacherById(id) {
	var th = this;
	
    return new Promise(function (resolve, reject) {
		
		var isActive = false;	
		for(var i in th.accountToAuthTeachers)
		{
			if(th.accountToAuthTeachers[i].accountId == id)
			{
				for(var j in th.authorizations)
				{
					if(th.authorizations[j].id == th.accountToAuthTeachers[i].authId)
					{
						isActive = th.authorizations[i].isActive;
						break;
					}
				}
				break;
			}
		}
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = isActive;
		operationStatus.attachedInfo = "";
		
		resolve(operationStatus);
    });
  }
  
  addAuthorization(authorization) {
	var th = this;
    return new Promise(function (resolve, reject) {
		this.authorizations.push(authorization);  
		sessionStorage.setItem("authorizations", JSON.stringify(this.authorizations));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.authorizations[th.authorizations.length-1];
		operationStatus.attachedInfo = "";
		
	  resolve(operationStatus);
    });
  }
  
  addTeacher(teacher)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		th.teachers.push(teacher);
		sessionStorage.setItem("teachers", JSON.stringify(th.teachers));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.teachers[th.teachers.length-1];
		operationStatus.attachedInfo = "";
		
	  resolve(operationStatus);
    });  
  }
  
  addStudent(student)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		th.students.push(student);
		sessionStorage.setItem("students", JSON.stringify(th.students));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.students[th.students.length-1];
		operationStatus.attachedInfo = "";
		
	  resolve(operationStatus);
    });  
  }
  
  addDiscipline(discipline)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		th.disciplines.push(discipline);
		sessionStorage.setItem("disciplines", JSON.stringify(th.disciplines));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.disciplines[th.disciplines.length-1];
		operationStatus.attachedInfo = "";
		
	  resolve(operationStatus);
    });  
  }
  
  addSubject(subject)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		th.subjects.push(subject);
		sessionStorage.setItem("subjects", JSON.stringify(th.subjects));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.subjects[th.subjects.length-1];
		operationStatus.attachedInfo = "";
		
	  resolve(operationStatus);
    });  
  }
  
  addWorkingPlan(workingPlan)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		th.workingPlans.push(workingPlan);
		sessionStorage.setItem("workingPlans", JSON.stringify(th.workingPlans));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.workingPlans[th.workingPlans.length-1];
		operationStatus.attachedInfo = "";
		
	  resolve(operationStatus);
    });  
  }
  
  addGroup(group)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		th.groups.push(group);
		sessionStorage.setItem("groups", JSON.stringify(th.groups));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.groups[th.groups.length-1];
		operationStatus.attachedInfo = "";
		
	  resolve(operationStatus);
    });  
  }
  
  addReportingBySubject(reportingBySubject)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		th.reportingBySubjects.push(reportingBySubject);
		sessionStorage.setItem("reportingBySubjects", JSON.stringify(th.reportingBySubjects));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.reportingBySubjects[th.reportingBySubjects.length-1];
		operationStatus.attachedInfo = "";
		
	  resolve(operationStatus);
    });  
  }
  
  addReportingBySubjectAdditionalMaterials(reportingBySubjectAdditionalMaterials)
  {
	var th = this;
    return new Promise(function (resolve, reject) {
		th.reportingBySubjects.push(reportingBySubjectAdditionalMaterials.reportingBySubject);
		sessionStorage.setItem("reportingBySubjects", JSON.stringify(th.reportingBySubjects));
		
		th.reportingBySubjectAdditionalMaterialss.push(reportingBySubjectAdditionalMaterials);
		sessionStorage.setItem("reportingBySubjectAdditionalMaterialss", JSON.stringify(th.reportingBySubjectAdditionalMaterialss));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.reportingBySubjectAdditionalMaterialss[th.reportingBySubjectAdditionalMaterialss.length-1];
		operationStatus.attachedInfo = "";
		
	  resolve(operationStatus);
    });  
  }

  deleteTeacherAuthorization(id) {
	var th = this;
    return new Promise(function (resolve, reject) {
		for(var i in th.accountToAuthTeachers)
		{
			if(th.accountToAuthTeachers[i].accountId == id)
			{
				for(var j in th.authorizations)
				{
					if(th.authorizations[j].id == th.accountToAuthTeachers[i].authId)
					{
						this.authorizations.splice(parseInt(i),1);
						break;
					}
				}
				break;
			}
		}
		
		sessionStorage.setItem("authorizations", JSON.stringify(this.authorizations));  
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.authorizations;
		operationStatus.attachedInfo = "Authorization deleted";
		
	  resolve(operationStatus);
    });
  }
  
  deleteStudentAuthorization(id) {
	var th = this;
    return new Promise(function (resolve, reject) {
		for(var i in th.accountToAuthStudents)
		{
			if(th.accountToAuthStudents[i].accountId == id)
			{
				for(var j in th.authorizations)
				{
					if(th.authorizations[j].id == th.accountToAuthStudents[i].authId)
					{
						this.authorizations.splice(parseInt(i),1);
						break;
					}
				}
				break;
			}
		}
		
		sessionStorage.setItem("authorizations", JSON.stringify(this.authorizations));  
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.authorizations;
		operationStatus.attachedInfo = "Authorization deleted";
		
	  resolve(operationStatus);
    });
  }
  
  deleteTeacher(id) {
	var th = this;
    return new Promise(function (resolve, reject) {
		
		for(var i in th.teachers)
		{
			if(th.teachers[i].id == id)
			{
				th.teachers.splice(parseInt(i),1);
				break;
			}
		}
		
		sessionStorage.setItem("teachers", JSON.stringify(th.teachers));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.teachers;
		operationStatus.attachedInfo = "Teacher deleted";
		
	  resolve(operationStatus);
    });
  }
  
  deleteStudent(id) {
	  var th = this;
    return new Promise(function (resolve, reject) {
		
		for(var i in th.students)
		{
			if(th.students[i].id == id)
			{
				th.students.splice(parseInt(i),1);
				break;
			}
		}
		
		sessionStorage.setItem("students", JSON.stringify(th.students));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.students;
		operationStatus.attachedInfo = "Student deleted";
		
	  resolve(operationStatus);
    });
  }
  
  deleteDiscipline(id) {
	var th = this;
    return new Promise(function (resolve, reject) {
		
		for(var i in th.disciplines)
		{
			if(th.disciplines[i].id == id)
			{
				th.disciplines.splice(parseInt(i),1);
				break;
			}
		}
		
		sessionStorage.setItem("disciplines", JSON.stringify(th.disciplines));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.disciplines;
		operationStatus.attachedInfo = "Discipline deleted";
		
	  resolve(operationStatus);
    });
  }
  
  deleteSubject(id) {
	var th = this;
    return new Promise(function (resolve, reject) {
		
		for(var i in th.subjects)
		{
			if(th.subjects[i].id == id)
			{
				th.subjects.splice(parseInt(i),1);
				break;
			}
		}
		
		sessionStorage.setItem("subjects", JSON.stringify(th.subjects));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.subjects;
		operationStatus.attachedInfo = "Subject deleted";
		
	  resolve(operationStatus);
    });
  }
  
  deleteWorkingPlan(id) {
	var th = this;
    return new Promise(function (resolve, reject) {
		
		for(var i in th.workingPlans)
		{
			if(th.workingPlans[i].id == id)
			{
				th.workingPlans.splice(parseInt(i),1);
				break;
			}
		}
		
		sessionStorage.setItem("workingPlans", JSON.stringify(th.workingPlans));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.workingPlans;
		operationStatus.attachedInfo = "Working plan deleted";
		
	  resolve(operationStatus);
    });
  }
  
  deleteGroup(id) {
	var th = this;
    return new Promise(function (resolve, reject) {
		
		for(var i in th.groups)
		{
			if(th.groups[i].id == id)
			{
				th.groups.splice(parseInt(i),1);
				break;
			}
		}
		
		sessionStorage.setItem("groups", JSON.stringify(th.groups));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.groups;
		operationStatus.attachedInfo = "Group deleted";
		
	  resolve(operationStatus);
    });
  }
  
  deleteReportingBySubject(id) {
	var th = this;
    return new Promise(function (resolve, reject) {
		
		for(var i in th.reportingBySubjects)
		{
			if(th.reportingBySubjects[i].id == id)
			{
				th.reportingBySubjects.splice(parseInt(i),1);
				break;
			}
		}
		
		sessionStorage.setItem("reportingBySubjects", JSON.stringify(th.reportingBySubjects));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.reportingBySubjects;
		operationStatus.attachedInfo = "Reporting deleted";
		
	  resolve(operationStatus);
    });
  }
  
  deleteReportingBySubjectAdditionalMaterials(id) {
	var th = this;
    return new Promise(function (resolve, reject) {
		
		for(var i in th.reportingBySubjectAdditionalMaterialss)
		{
			if(th.reportingBySubjectAdditionalMaterialss[i].id == id)
			{
				for(var j in th.reportingBySubjects)
				{
					if(th.reportingBySubjects[j].id == th.reportingBySubjectAdditionalMaterialss[i].reportingBySubject.id)
					{
						th.reportingBySubjects.splice(parseInt(j),1);
						break;
					}
				}
		
				sessionStorage.setItem("reportingBySubjects", JSON.stringify(th.reportingBySubjects));
				th.reportingBySubjectAdditionalMaterialss.splice(parseInt(i),1);
				break;
			}
		}
		
		sessionStorage.setItem("reportingBySubjectAdditionalMaterialss", JSON.stringify(th.reportingBySubjectAdditionalMaterialss));
		
		var operationStatus = new operationStatusInfo();
		operationStatus.operationStatus = operationStatus.Done;
		operationStatus.attachedObject = th.reportingBySubjectAdditionalMaterialss;
		operationStatus.attachedInfo = "Reporting deleted";
		
	  resolve(operationStatus);
    });
  }
  
  public sendNotifyAllConnectedText(message: Message) {
	  var th = this;
	return new Promise(function (resolve, reject) {
		var operationStatus = th.sendStubMessage("Message was sent to all entered");
        resolve(operationStatus);
    });
  }
  
  public sendNotifyAllEnteredText(message: Message) {
	  var th = this;
	return new Promise(function (resolve, reject) {
        var operationStatus = th.sendStubMessage("Message was sent to all entered");
        resolve(operationStatus);
    });
  }
  
  public sendNotifyOneText(id, message: Message) {
	  var th = this;
	return new Promise(function (resolve, reject) {
        var operationStatus = th.sendStubMessage("Message was sent to one");
        resolve(operationStatus);
    });
  }

  public getNotifyEnteredText(toastrService: ToastrService) {
	var message = this.getStubMessage();
	this.showNotification(toastrService, message);
  }
  
  public getNotifyConnectedText(toastrService: ToastrService) {
	var message = this.getStubMessage();
	this.showNotification(toastrService, message);
  }
  
  public getNotifyUnicastText(toastrService: ToastrService) {
	var message = this.getStubMessage();
	this.showNotification(toastrService, message);
  }
  
  sendStubMessage(messageText:string)
  {
	var message = this.getStubMessage(); 
	var operationStatus = new operationStatusInfo();
	operationStatus.operationStatus = operationStatus.Done;
	operationStatus.attachedObject = message;
	operationStatus.attachedInfo = messageText;	
	return operationStatus;
  }
  
  getStubMessage()
  {
	var message = new Message();
	message.text = "Message is sentssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss!";
	message.senderName = "Admin";
	return message;
  }
  
  showNotification(toastrService: ToastrService, message) {
	toastrService.show(message.text, message.senderName, {
      tapToDismiss: true,
	  positionClass: 'toast-bottom-right',
	  toastClass: "toast-info-custom",
	  disableTimeOut: true,
      progressAnimation: 'increasing',
      progressBar: false,
    });
  }
  
  getAllLoggedInUsers() {
    return new Promise(function (resolve, reject) {
	  resolve(null);
    });
  }
  
  getAllLoggedInStudents() {
    return new Promise(function (resolve, reject) {
      resolve(null);
    });
  }
}

class AccountToAuth {
	accountId: number;
	authId: number;
	
	constructor(accountId: number, authId: number) {
 
        this.accountId = accountId;
        this.authId = authId;
    }
}