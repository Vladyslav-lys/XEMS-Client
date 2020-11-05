import { Component, OnInit } from '@angular/core';
import { Authorization } from '../_models/authorization';

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.css']
})
export class LeftmenuComponent implements OnInit {

  public authentication: any;

  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem('currentAuthentication')) {
      this.authentication = JSON.parse(localStorage.currentAuthentication);
    }
  }
}

