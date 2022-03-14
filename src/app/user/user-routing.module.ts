import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountpageComponent } from './accountpage/accountpage.component';
import { AppointmentDetailsComponent } from './appointment-details/appointment-details.component';
import { UserComponent } from './user.component';

const routes: Routes = [
  { path: '', component: UserComponent },
  { path: 'account/:username', component: AccountpageComponent },
  { path: 'appoint/:username', component: AppointmentDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
