import { Component, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DetailView } from './detail-view';

export interface ApiResponse {
  icon_url: string;
  id: string;
  url: string;
  value: string;
}

@Component({
  selector: 'app-detail',
  template: `
    <p>
      {{ item.desc }}&nbsp;
      Can close: <input type="checkbox" [(ngModel)]="checked">&nbsp;
      <button (click)="close.emit()">Close</button>
    </p>
    <p>Chuck Norris joke:</p>
    <p>{{ joke }}</p>
  `
})
export class DetailComponent implements DetailView {
  @Input() item: any;
  @Output() close = new EventEmitter();

  checked = true;
  joke: string;

  constructor(private http: HttpClient) { }

  canClose(): Promise<boolean> {
    return new Promise(res => setTimeout(() => res(this.checked), 0));
  }

  onOpen(): Promise<void> {
    return this.http
      .get<ApiResponse>('https://api.chucknorris.io/jokes/random')
      .toPromise().then(joke => {
        this.joke = joke.value;
      });
    //return new Promise(res => setTimeout(() => res(true), 500));
  }
}
