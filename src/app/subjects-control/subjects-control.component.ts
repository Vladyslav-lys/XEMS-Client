import { Component, OnInit } from '@angular/core';
import { StudentService } from '../_services/student.service';
import { DisciplineService } from '../_services/discipline.service';
import { SubjectService } from '../_services/subject.service';
//import { StubService } from '../_services/stub.service';
import { Router } from '@angular/router';
import { Subject } from '../_models/subject';
import {Student} from '../_models/student';
import {Discipline} from '../_models/discipline';
import { CourseTask } from "../_enums/courseTask";
import { ReportingBySemesterType } from "../_enums/reportingBySemesterType";
import { Semester } from "../_enums/semester";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo } from '../_helpers/operationStatusInfo';
import { NotifyService } from '../_services/notify.service';
import { Message } from '../_models/message';
import {HubConnectionState} from '@microsoft/signalr';
import {SignalRService} from '../_services/signalR.service';
import {Chart} from 'node_modules/chart.js';

@Component({
  selector: 'app-subjects-control',
  templateUrl: './subjects-control.component.html',
  styleUrls: ['./subjects-control.component.css']
})
export class SubjectsControlComponent implements OnInit {

  subjects: Subject[];
  subjects2: Subject[];
  
  disciplines: Discipline[];
  disciplines2: Discipline[];
  
  selectedDisciplineId:number;
  selectedTypeId:number;

  constructor(
    private router: Router,
    private studentService: StudentService,
	private disciplineService: DisciplineService,
	private subjectService: SubjectService,
	//private stub:StubService,
	private serviceClient: SignalRService,
    private notifySerivce: NotifyService,
    private formBuilder: FormBuilder
  ) {
  }

  async ngOnInit(): Promise<void>{
	
	this.selectedTypeId=0;
	this.selectedDisciplineId=0;
	
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
		await this.getAllDisciplines();
	  await this.getAllSubjects();
    }
    else {
      var interval = setInterval(async () => {
		  if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
			  clearInterval(interval);
			  await this.getAllDisciplines();
		    await this.getAllSubjects();
		  }
		}, 500);
    }
	
	this.createChart();
  }

  async getAllSubjects() {
    var th = this;
    
	await this.subjectService.getAllSubjects()
	  .then(function (operationStatus: operationStatusInfo) {
		var subjects = operationStatus.attachedObject;
        th.subjects = subjects[0];
        sessionStorage.setItem("subjects", JSON.stringify(th.subjects));
        th.subjects2 = JSON.parse(sessionStorage.subjects).map(i => ({
          idx: i,
          id: i.id,
		  student: i.student,
		  discipline: i.discipline,
		  year: i.year,
		  semester: i.semester,
		  lectureHours: i.lectureHours,
		  practiceHours: i.practiceHours,
		  laboratoryHours: i.laboratoryHours,
		  reporting: i.reportingBySemesterType,
		  courseTask: i.courseTask,
		  semesterGrade: i.semesterGrade
        }));
      }).catch(function(err) {
		  alert(err);
        console.log("Error while fetching subjects");
      });
  }
  
  async getAllDisciplines() {
    var th = this;
    
	await this.disciplineService.getAllDisciplines()
	  .then(function (operationStatus: operationStatusInfo) {
		var disciplines = operationStatus.attachedObject;
        th.disciplines = disciplines[0];
        sessionStorage.setItem("disciplines", JSON.stringify(th.disciplines));
        th.disciplines2 = JSON.parse(sessionStorage.disciplines).map(i => ({
          idx: i,
          id: i.id,
		  title: i.title
        }));
      }).catch(function(err) {
        console.log("Error while fetching disciplines");
        alert(err);
      });
  }
  
  getCourseTask(courseTask) {
    var s = "";

    switch (courseTask) {
      case CourseTask.None:
        s = "None";
        break;
      case CourseTask.CourseWork:
        s = "Course work";
        break;
      case CourseTask.CourseProject:
        s = "Course project";
        break;
    }

    return s;
  }
  
  getSemester(semester) {
    var s = "";

    switch (semester) {
      case Semester.FirstWithWinterSession:
        s = "First with winter session";
        break;
      case Semester.SecondWithSummerSession:
        s = "Second with summer session";
        break;
    }

    return s;
  }
  
  getReportingBySemesterType(reportingBySemesterType) {
    var s = "";

    switch (reportingBySemesterType) {
	  case ReportingBySemesterType.None:
        s = "None";
        break;
      case ReportingBySemesterType.Credit:
        s = "Credit";
        break;
      case ReportingBySemesterType.DifferentialCredit:
        s = "Differential credit";
        break;
	  case ReportingBySemesterType.Exam:
        s = "Exam";
        break;
	  default:
		s = "None";
		break;
    }

    return s;
  }
  
  createChart()
  {
	var currentYearHours=0, lastYearHours=0;
	
	switch(+this.selectedTypeId)
	{
		case 1:
			for(let subject of this.subjects2)
			{
				if(subject.discipline.id != this.selectedDisciplineId)
					continue;
				
				if(subject.year == new Date().getFullYear())
					currentYearHours += subject.lectureHours + subject.practiceHours + subject.laboratoryHours;
				if(subject.year == new Date().getFullYear()-1)
					lastYearHours += subject.lectureHours + subject.practiceHours + subject.laboratoryHours;
			}
			break;
		case 2:
			for(let subject of this.subjects2)
			{
				if(subject.discipline.id != this.selectedDisciplineId)
					continue;
				
				if(subject.year == new Date().getFullYear())
					currentYearHours += subject.lectureHours;
				if(subject.year == new Date().getFullYear()-1)
					lastYearHours += subject.lectureHours;
			}
			break;
		case 3:
			for(let subject of this.subjects2)
			{
				if(subject.discipline.id != this.selectedDisciplineId)
					continue;
				
				if(subject.year == new Date().getFullYear())
					currentYearHours += subject.practiceHours;
				if(subject.year == new Date().getFullYear()-1)
					lastYearHours += subject.practiceHours;
			}
			break;
		case 4:
			for(let subject of this.subjects2)
			{
				if(subject.discipline.id != this.selectedDisciplineId)
					continue;
				
				if(subject.year == new Date().getFullYear())
					currentYearHours += subject.laboratoryHours;
				if(subject.year == new Date().getFullYear()-1)
					lastYearHours += subject.laboratoryHours;
			}
			break;
	}
	
	this.showCharts(currentYearHours, lastYearHours);
  }
  
  showCharts(currentYearHours, lastYearHours)
  {
	var myChart = new Chart("subjectHoursComparison", {
		type: 'pie',
		data: {
			labels: [new Date().getFullYear(), new Date().getFullYear()-1],
			datasets: [{
				label: 'Subject hours comparison',
				data: [currentYearHours,lastYearHours],
				backgroundColor: [
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 99, 132, 0.2)'
				],
				borderColor: [
					'rgba(54, 162, 235, 1)',
					'rgba(255, 99, 132, 1)'
				],
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}
		}
	});  
  }

  openEdit(subject) {
    this.router.navigate(['/full-profile-subject/:id']);
  }

  deleteSubject(subject) {
    var th = this;
	this.subjectService.deleteSubject(subject.id)
	  .then(function (operationStatus: operationStatusInfo) {
		console.log(operationStatus.attachedObject);
        if (!JSON.stringify(operationStatus.operationStatus))
          window.location.reload();
      }).catch(function(err) {
        console.log("Error while deleting the subject");
      });
  }

  openAdd() {
    this.router.navigate(['/register-subject']);
  }
  
  openAddForMultipleStudents() {
    this.router.navigate(['/register-subject-for-multiple-students']);
  }
}