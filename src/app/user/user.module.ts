import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountpageComponent } from './accountpage/accountpage.component';
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UserComponent,
    AccountpageComponent,
    AppointmentDetailsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[
    AccountpageComponent,
    AppointmentDetailsComponent
  ]

})
export class UserModule { }
