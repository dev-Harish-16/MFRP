import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutusComponent } from './aboutus/aboutus.component';
 import { DoctordashboardComponent } from './doctordashboard/doctordashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NopageComponent } from './nopage/nopage.component';
import { PlansComponent } from './plans/plans.component';
import { SignupComponent } from './signup/signup.component';
import { SignupdoctorComponent } from './signupdoctor/signupdoctor.component';
//import { UserdashboardComponent } from './userdashboard/userdashboard.component';

const routes: Routes = [
  {path:"home",component:HomeComponent},
  {path:"plans",component:PlansComponent},
  {path:"aboutus",component:AboutusComponent},
  {path:"login",component:LoginComponent},
  {path:"signup",component:SignupComponent},
  {path:"signupdoctor", component:SignupdoctorComponent},
  // {path:"doctordashboard",component:DoctordashboardComponent},
  {path:"userdashboard", loadChildren: () => import('./user/user.module').then(m => m.UserModule)},
  { path: 'doctordashboard/:username', loadChildren: () => import('./doctordashboard/doctordashboard.module').then(m => m.DoctordashboardModule) },
  // { path: "userdashboard/:username", loadChildren:()=>import('./user/user.module').then(m => m.UserModule) },
  {path:"userdashboard/:username", loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  // Empty path
  {path:"",redirectTo:"home",pathMatch:"full"},
  // Invalidpath
  {path:"**",component:NopageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
