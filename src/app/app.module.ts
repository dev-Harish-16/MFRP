import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SignupdoctorComponent } from './signupdoctor/signupdoctor.component';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { PlansComponent } from './plans/plans.component';
import { NopageComponent } from './nopage/nopage.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserModule } from "./user/user.module";
import { AuthorisationService } from './authorisation.service';
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    AboutusComponent,
    PlansComponent,
    NopageComponent,
    HomeComponent,
    SignupdoctorComponent,
    UserdashboardComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    UserModule,
    ModalModule.forRoot()
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:AuthorisationService,
    multi:true
  }
    

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
