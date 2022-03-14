import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { DoctorService } from '../doctor.service';

@Component({
  selector: 'app-signupdoctor',
  templateUrl: './signupdoctor.component.html',
  styleUrls: ['./signupdoctor.component.css']
})
export class SignupdoctorComponent implements OnInit {
  doctorSignup: FormGroup;
  modalRef?: BsModalRef;
  fileName: string;
  file: File;
  imgUrl: string | ArrayBuffer = "https://www.instituteofphotography.in/wp-content/uploads/2015/05/dummy-profile-pic.jpg";
  constructor(private signupFormBuilderObj: FormBuilder, private routerObj: Router, private doctorServiceObj: DoctorService,public modalService: BsModalService) { }

  ngOnInit(): void {
    this.doctorSignup = this.signupFormBuilderObj.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      experience: ['', Validators.required],
      consultationFee: ['', Validators.required],
      city: ['', Validators.required],
      password: ['', Validators.required],
      phoneno: ['',[ Validators.required,Validators.pattern("^[0-9]{10}$")]],
      specialization: ['', Validators.required]
    })

  }
  //image 
  onFileSelected(imageFile: File) {
    this.file = imageFile;
    this.fileName = imageFile.name;
    const reader = new FileReader()
    reader.readAsDataURL(imageFile)
    reader.onload = () => {
      this.imgUrl = reader.result
    }
  }

  // Doctor created  modal
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  confirm() {
    this.routerObj.navigateByUrl('/login');
    this.modalRef.hide();
  }


  //on submitting the form
  signupSubmit(template:TemplateRef<any>) {

    let formData = new FormData();
    let doctorObj = this.doctorSignup.value;
    formData.append('doctorObj', JSON.stringify(doctorObj));
    formData.append('image', this.file);
    console.log(this.doctorSignup.value);
    this.doctorServiceObj.addDoctorToDatabase(formData).subscribe({
      next: (res) => {
        console.log('res is', res);
        //call Doctor created  modal
        this.openModal(template);

      },
      error: (err) => {
        console.log('something went wrong ', err);
      },
    });
  }


  get name() {
    return this.doctorSignup.get("name")
  }
  get username() {
    return this.doctorSignup.get("username")
  }
  get password() {
    return this.doctorSignup.get("password")
  }
  get experience() {
    return this.doctorSignup.get("experience")
  }
  get phoneno() {
    return this.doctorSignup.get("phoneno")
  }
  get consultationFee() {
    return this.doctorSignup.get("consultationFee")
  }
  get specialization() {
    return this.doctorSignup.get("specialization")
  }
  get city() {
    return this.doctorSignup.get("city")
  }
}
