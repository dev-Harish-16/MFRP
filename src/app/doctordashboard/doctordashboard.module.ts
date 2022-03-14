import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctordashboardRoutingModule } from './doctordashboard-routing.module';
import { DoctordashboardComponent } from './doctordashboard.component';


@NgModule({
  declarations: [
    DoctordashboardComponent
  ],
  imports: [
    CommonModule,
    DoctordashboardRoutingModule
  ]
})
export class DoctordashboardModule { }
