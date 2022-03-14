import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-doctordashboard',
  templateUrl: './doctordashboard.component.html',
  styleUrls: ['./doctordashboard.component.css']
})
export class DoctordashboardComponent implements OnInit {
  Time: any;
  date: any;
  constructor(public doctorService: DoctorService) {}
  
  doctorInfo:any
  ngOnInit(): void {
    timer(0, 1000).subscribe(() => {
      this.Time = new Date();
      this.date=new Date()
    });
   this.getDoctorInfo()
  }

  getDoctorInfo() {
  this.doctorInfo= this.doctorService.getDoctorName().getValue();
  console.log(this.doctorInfo);
  
  }


}

