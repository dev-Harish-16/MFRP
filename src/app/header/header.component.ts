
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DoctorService } from '../doctor.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  profileInfo: any;
  doctorform: FormGroup;
  userForm: FormGroup;
  resetting: boolean = true;
  changePasswordForm: FormGroup;
  changePasswordFormDoctor: FormGroup;
  constructor(
    public userServiceObj: UserService,
    public doctorServiceObj: DoctorService,
    public editFormBuilderObj: FormBuilder,
    public formBuilderObj: FormBuilder
  ) { }

  ngOnInit(): void {
    this.editUserFormData();
    this.editDoctorFormData();
  }

  logout() {
    //user ? userservice logout sholud be called
  
    
    if (this.userServiceObj.getUserType().getValue() == 'user') {
      this.userServiceObj.userLogout();
      this.userServiceObj.loginStatus = false;
    }
    else {
      this.doctorServiceObj.doctorLogout();
      this.userServiceObj.loginStatus = false;
    }
    //doctorservice obj should be called
  }


  editUserFormData() {
    this.userForm = this.editFormBuilderObj.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      city: ['', Validators.required],
      phoneno: ['', Validators.required],
    });
  }
  editDoctorFormData() {
    this.doctorform = this.editFormBuilderObj.group({
      name: ['', Validators.required],
      experience: ['', Validators.required],
      consultationFee: ['', Validators.required],
      city: ['', Validators.required],
      phoneno: ['', Validators.required],
      specialization: ['', Validators.required],
    });
    this.changePasswordForm = this.formBuilderObj.group({
      username: ['', Validators.required],
      oldpassword: ['', Validators.required],
      newpassword: ['', Validators.required],
    })
    this.changePasswordFormDoctor = this.formBuilderObj.group({
      usernameD: ['', Validators.required],
      oldpasswordD: ['', Validators.required],
      newpasswordD: ['', Validators.required],
    })
  }
  userSubmit(ref) {
    //this.userServiceObj.getUsername().
    console.log("edit user profile")
    console.log(this.userForm.value);

    this.userServiceObj.editProfile(this.userForm.value).subscribe({
      next: (res) => {
        console.log(res.payload);

      },
      error: (err) => {
        console.log("err is ", err);

      }

    })

    this.userForm.reset()
    this.userForm.valid
    ref.submitted = false;
  }
  doctorSubmit(ref) {
    console.log("edit doctor profile")
    console.log(this.doctorform.value);

    this.doctorServiceObj.editProfile(this.doctorform.value).subscribe({
      next: (res) => {
        console.log(res.payload);

      },
      error: (err) => {
        console.log("err is ", err);

      }

    })
    this.doctorform.reset()
    this.doctorform.valid
    ref.submitted = false;

  }
  //change password
  changePassword(passwordFormData) {
    console.log("from submit fn USER");
    this.userServiceObj.changePasswordFn(this.changePasswordForm.value).subscribe({
      next: (res) => {
        console.log(res);

      },
      error: (err) => {
        console.log("err is ", err);

      }

    })
    //do ref.reset and follow
    this.changePasswordForm.reset()
    this.changePasswordForm.valid
    passwordFormData.submitted = false;


  }

  changePasswordDoctor(passwordFormData) {

    console.log("from submit fn DOCTOR");
    this.doctorServiceObj.changePasswordDoctorFn(this.changePasswordFormDoctor.value).subscribe({
      next: (res) => {
        console.log(res);

      },
      error: (err) => {
        console.log("err is ", err);

      }

    })
    //do ref.reset and follow
    this.changePasswordFormDoctor.reset()
    this.changePasswordFormDoctor.valid
    passwordFormData.submitted = false;


  }

  get name() {
    return this.doctorform.get('name');
  }
  get username() {
    return this.doctorform.get('username');
  }
  get experience() {
    return this.doctorform.get('experience');
  }
  get phoneno() {
    return this.doctorform.get('phoneno');
  }
  get consultationFee() {
    return this.doctorform.get('consultationFee');
  }
  get specialization() {
    return this.doctorform.get('specialization');
  }
  get city() {
    return this.doctorform.get('city');
  }
  //user edit profile form
  get nameOfUser() {
    return this.userForm.get('name');
  }
  get cityOfUser() {
    return this.userForm.get('city');
  }
  get ageOfUser() {
    return this.userForm.get('age');
  }
  get phonenoOfUser() {
    return this.userForm.get('phoneno');
  }
  //change  password -user
  get usernameOfF() {
    return this.changePasswordForm.get("username")
  }
  get oldpassword() {
    return this.changePasswordForm.get("oldpassword")
  }
  get newpassword() {
    return this.changePasswordForm.get("newpassword")
  }
  // change password doctor
  get usernameD() {
    return this.changePasswordFormDoctor.get("usernameD")
  }
  get oldpasswordD() {
    return this.changePasswordFormDoctor.get("oldpasswordD")
  }
  get newpasswordD() {
    return this.changePasswordFormDoctor.get("newpasswordD")
  }

}
