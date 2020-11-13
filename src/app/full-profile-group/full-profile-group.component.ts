import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../_services/subject.service';
import { TeacherService } from '../_services/teacher.service';
import { SignalRService } from '../_services/signalR.service';
//import { StubService } from '../_services/stub.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Authorization } from '../_models/authorization';
import { Teacher } from '../_models/teacher';
import { Group} from '../_models/group';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { operationStatusInfo, OperationStatus } from '../_helpers/operationStatusInfo';

@Component({
  selector: 'app-full-profile-group',
  templateUrl: './full-profile-group.component.html',
  styleUrls: ['./full-profile-group.component.css']
})
export class FullProfileGroupComponent implements OnInit {
  profileForm: FormGroup;
  currentGroupId: number;
  currentGroup: Group;
  loading = false;
  submitted = false;
  
  teachers: Teachers[];
  teachers2: Teachers[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
	//private stub:StubService,
    private subjectService: SubjectService,
	private teacherService: TeacherService,
    private formBuilder: FormBuilder,
	private serviceClient: SignalRService
  ) {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd) {
          this.route
            .queryParams
            .subscribe(params => {
              // Defaults to 0 if no query param provided.
              this.currentGroupId = +this.route.snapshot.paramMap.get('id');
			  this.LoadGroupInfo(this.currentGroupId);
            });
        }
      });
  }

  async ngOnInit(): Promise<void> {
	if(this.serviceClient.hubConnection.state == HubConnectionState.Connected){
	  await this.getAllTeachers()
    }
    else {
      setTimeout(async () => {
		  await this.getAllTeachers()
		}, 500);
    }
	
	this.profileForm = this.formBuilder.group({
      name: [this.currentGroup.name, Validators.required],
	  curator: [this.currentGroup.teacher ? this.currentGroup.teacher.id : ""],
	  learningStartDate: [this.currentGroup.learningStartDate, Validators.required],
	  learningEndDate: [this.currentGroup.learningEndDate, Validators.required],
	  degree: [this.currentGroup.degree]
    });
  }

  LoadGroupInfo(currentGroupId: number) {
	var th = this;
    var groups = JSON.parse(sessionStorage.groups);
    groups.forEach(function (group: Group) {
      if (group.id == currentGroupId) {
        th.currentGroup = group;
      }
    });
  }

  EditGroup() {

    this.submitted = true;

    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
	
	var newGroup: Group;
    newGroup = this.currentGroup;

    if (this.profileForm.controls.name.value != null)
      newGroup.name = this.profileForm.controls.name.value;
	if (this.profileForm.controls.curator.value != null && this.profileForm.controls.curator.value.length > 0)
	{
	  var id = this.profileForm.controls.curator.value;
	  newGroup.curator = this.stub.getTeacherById(id);
	}
	if (this.profileForm.controls.learningStartDate.value != null)
      newGroup.learningStartDate = this.profileForm.controls.learningStartDate.value;
    if (this.profileForm.controls.learningEndDate.value != null)
      newGroup.learningEndDate = this.profileForm.controls.learningEndDate.value;
    if (this.profileForm.controls.degree.value != null)
      newGroup.degree = this.profileForm.controls.degree.value;

    var th = this;
    this.subjectService.invokeUpdateGroupInfo(newGroup)
      .then(function (operationStatusInfo: operationStatusInfo) {
        if (operationStatusInfo.operationStatus == OperationStatus.Done) {
          var message = "Group info updated successfully";
          console.log(message);
          alert(message);
          th.router.navigate(['/groups-control']);
        }
        else {
          alert(operationStatusInfo.attachedInfo);
        }
      }).catch(function (err) {
        console.log("Error while updating group info");
        alert(err);
      });
  }
  
  async getAllTeachers() {
    var th = this;
    
	await this.teacherService.getAllTeachers()
	  .then(function (operationStatus: operationStatusInfo) {
		var teachers = operationStatus.attachedObject;
        th.teachers = teachers[0];
        sessionStorage.setItem("teachers", JSON.stringify(th.teachers));
        th.teachers2 = JSON.parse(sessionStorage.teachers).map(i => ({
          idx: i,
          id: i.id,
		  firstName: i.firstName,
		  lastName: i.lastName,
		  birthday: i.birthday,
		  phone: i.phone,
		  address: i.address,
		  createTime: i.createTime,
		  modifyTime: i.modifyTime
        }));
      }).catch(function(err) {
        console.log("Error while fetching teachers");
      });
  }

  enableBtn(): boolean {
	if (this.groupForm.controls.name.value.length > 0 && this.groupForm.controls.curator.value.length > 0 && 
		&& this.groupForm.controls.learningStartDate.value != null && this.groupForm.controls.learningEndDate.value != null)
      return true;
    return false;
  }
}