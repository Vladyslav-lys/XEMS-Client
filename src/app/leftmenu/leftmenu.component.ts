import { Component, OnInit } from '@angular/core';
import {Account} from '../_models/accounts';
import { User } from '../_models/user';

@Component({
  selector: 'app-leftmenu',
  templateUrl: './leftmenu.component.html',
  styleUrls: ['./leftmenu.component.css']
})
export class LeftmenuComponent implements OnInit {

  public user: User;

  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      this.user = JSON.parse(localStorage.currentUser);
    }
  }
}

