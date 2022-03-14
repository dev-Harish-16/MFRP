import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DoctorService } from '../doctor.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  modalRef?: BsModalRef;

  city = [
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Mumbai',
    'Bangalore',
    'Vizag',
    'Delhi',
  ];
  specialization = [
    'General medicine',
    'Neurologist',
    'Orthopaedician',
    'Dentist',
    'Cardiologist',
    'Gynecologist',
    'Opthamologist',
    'Psychiartist',
    'Dermatologist',
  ];

  //all doctors data
  doctors: any[] = []
  //value from city select
  cityFromSelect: String;
  //value from specialisation select
  specFromSelect: String;
  //doctors data based on book appointment button selection
  selectedDoctor: any[] = [];
  //appointment times,date data
  appointmentDataObj: any[] = [];
  //comment
  comment: string = "";
  //usernmae
  username: string = "";
  //wallet
  wallet: number = 0;
  //salutation
  salutation: String = "";
  salutationPlans:String="";
  //subscription
  userSubscription: String = "";

  accObj = {
    age: 0,
    wallet: 0,
    username: '',
    doctorname: '',
    consultationFee: 0,
    date: "01/02/2012",
    timmings: "5 am",
    doctorusername: '',
    doctorWallet: 0
  };

  constructor(
    public serviceObj: DoctorService,
    public userServiceObj: UserService,
    public fb: FormBuilder,
    public activatedRouteObj: ActivatedRoute,
    private routerObj: Router,
    public modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.getdoctor();
    this.loginStatus();
  }


  //check login and give the name for the usermodule to give the salutation
  loginStatus() {
    if (this.userServiceObj.loginStatus == true) {
      this.username = this.userServiceObj.getUsername().getValue().username;
      this.userServiceObj.getUserDetailsAfterPayment(this.username).subscribe({
        next: (res) => {
          //get the user subscription status
          this.userSubscription = res.payload.subscription
          this.salutation = this.username
          this.salutationPlans = this.userSubscription
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
    else {
      this.username = ""
    }
  }

  getdoctor() {
    this.serviceObj.getDoctorList().subscribe({
      next: (obj) => {
        this.doctors = obj.payload;
        console.log('doctors list after assigning is ', this.doctors);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //to get the value from the city selector
  getCity(city1) {
    this.cityFromSelect = city1.target.value
  }

  //to get the value from the specilization
  getDataAccSpec(spec) {
    this.specFromSelect = spec.target.value
  }
  //to get the seleted doctors 
  getDoctorsData() {
    this.selectedDoctor.splice(0, this.selectedDoctor.length)
    this.selectedDoctor = this.doctors.filter(doc => { return doc.city == this.cityFromSelect && doc.specialization == this.specFromSelect })
    if (this.selectedDoctor.length == 0) {
      this.comment = `Oops! NO ${this.specFromSelect} IN ${this.cityFromSelect}`
    }
    else {
      this.comment = ""
    }
  }

  /* alert modal for navigate to login,if the user is not logged in */
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  confirm() {
   
    this.routerObj.navigateByUrl('/login');
    this.modalRef.hide();
  }

  /* check login, if the user is logged in or not */
  checkLogin(template: TemplateRef<any>) {

    console.log(this.userServiceObj.loginStatus);
    if (this.userServiceObj.loginStatus == true) {
      this.goToAccountPage();
    } else {
      this.openModal(template);
    }

  }

  /* go to accountpage */
  goToAccountPage() {

    this.serviceObj.getAccountPageDetails().next(this.accObj);
    this.routerObj.navigateByUrl(`/userdashboard/account/${this.userServiceObj.getUsername().getValue().username}`);

  }


  goToModal(username) {

    this.appointmentDataObj.splice(0, this.appointmentDataObj.length);
    this.serviceObj.getDoctorData().next(this.selectedDoctor.find((doctorObj) => doctorObj.username == username));
    this.appointmentDataObj.push(this.serviceObj.getDoctorData().getValue());
    console.log(typeof (this.appointmentDataObj));
    console.log('from user c', this.appointmentDataObj);

  }


  appointmentForm = this.fb.group({
    date: [''],
    timmings: [''],
  });

  onSubmit() {
    if (this.userServiceObj.loginStatus == true) {

      this.username = this.userServiceObj.getUsername().getValue().username;
      this.accObj.age = this.userServiceObj.getUsername().getValue().age;
      this.accObj.username = this.username;
      this.accObj.wallet = this.wallet;
      this.accObj.timmings = this.appointmentForm.value.timmings;
      this.accObj.date = this.appointmentForm.value.date;
      for (let v of this.appointmentDataObj) {
        (this.accObj.doctorusername = v.username),
          (this.accObj.doctorname = v.name),
          (this.accObj.consultationFee = v.consultationFee);
      }
      console.log('obj is', this.accObj);
    }
  }

  /* Go to appointment page */
  goToAppointmentPage() {
    this.routerObj.navigateByUrl(`/userdashboard/appoint/${this.userServiceObj.getUsername().getValue().username}`);
  }
}
