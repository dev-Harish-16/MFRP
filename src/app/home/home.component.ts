import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public router:Router) { }

  ngOnInit(): void {
  
  }

  //Navigate to AboutUS component
  navTOaboutUS(){
    this.router.navigateByUrl("aboutus")
  }
  // Consultation
  consult(){
    this.router.navigateByUrl("login")
    window.scrollTo(0, 0)
  }

}
