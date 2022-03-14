import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoctordashboardComponent } from './doctordashboard.component';

const routes: Routes = [{ path: '', component: DoctordashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctordashboardRoutingModule { }
