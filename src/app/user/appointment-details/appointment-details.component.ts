import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-appointment-details',
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.css']
})
export class AppointmentDetailsComponent implements OnInit {

  appointmentDetails: any[] = [];
  username: string;
  wallet:number=0;

  constructor(public userServiceObj: UserService,public routerObj:Router) { }

  ngOnInit(): void {
    
  }

  getDetails(){
    this.username = this.userServiceObj.getUsername().getValue().username
    this.userServiceObj.getUserDetailsAfterPayment(this.username).subscribe({
      next: (userObj) => {
        this.appointmentDetails = userObj.payload.appointmentDetails
        console.log(this.appointmentDetails);  
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
  gotToUserDashboard(){
    this.routerObj.navigateByUrl(`/userdashboard/${this.userServiceObj.getUsername().getValue().username}`)
  }
}