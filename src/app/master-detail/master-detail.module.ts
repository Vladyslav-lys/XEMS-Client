import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterDetailComponent } from './master-detail.component';
import { DetailViewDirective } from './detail-view.directive';
import { DetailViewControllerDirective } from './detail-view-controller.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [MasterDetailComponent, DetailViewDirective, DetailViewControllerDirective],
  exports: [MasterDetailComponent, DetailViewDirective, DetailViewControllerDirective]
})
export class MasterDetailModule { }
