import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from '../doctor.service';
import { UserService } from '../user.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userLogin: FormGroup;
  userObj: any;
  message: Boolean = false;
  status: Boolean = false;
  forgotPasswordForm: FormGroup;
  otp: String = '';
  otpDoctor: String = '';
  constructor(public formBuilderObj: FormBuilder, public userServiceObj: UserService, public doctorServiceObj: DoctorService, public routerObj: Router) { }
  ngOnInit(): void {
    this.userLogin = this.formBuilderObj.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.forgotPasswordForm = this.formBuilderObj.group({
      usernameF: ['', Validators.required],
      phonenumberF: ['', Validators.required],
      otp: ['']
    })


  }
  loginFormSubmit() {
    console.log(this.userLogin.value)
    //if user type is user - goto user service
    //console.log(this.userLogin.value.userType);


    this.userServiceObj.loginUser(this.userLogin.value).subscribe({
      next: (res: any) => {
        console.log("res is ", res);
        //if its user,then login success,
        if (res.message == "invalid password") {
          this.message = true
        }
        if (res.message == "login success") {
          console.log("login success");
          this.userServiceObj.loginStatus = true;
          //local storage
          localStorage.setItem("token", res.token)
          this.userServiceObj.getUsername().next(res.user)
          this.userServiceObj.getUserType().next('user')
          this.doctorServiceObj.whichUser = true
          this.routerObj.navigateByUrl(`userdashboard/${res.user.username}`)

        }
        else {
          console.log(" User Login Failed")
          this.doctorServiceObj.loginDoctor(this.userLogin.value).subscribe({
            next: (res: any) => {
              console.log("res is ", res);
              if ((res.message == "invalid password") || (res.message == "doctor not found")) {
                this.message = true
              }

              if (res.message == "login success") {
                console.log("login success");
                this.userServiceObj.loginStatus = true;
                //local storage
                localStorage.setItem("token", res.token)
                this.doctorServiceObj.getDoctorName().next(res.doctor)
                this.userServiceObj.getUserType().next('doctor')
                this.doctorServiceObj.whichUser = false
                this.routerObj.navigateByUrl(`doctordashboard/${res.doctor.username}`)


              }
              else {
                console.log(" Doctor Login also Failed , invalid Credentials or need to sign up")

              }
            },
            error: (err) => {
              console.log("error is ", err)
            }

          })
        }
      },
      error: (err) => {
        console.log("error is ", err)
      }

    })



  }
  navigateToSignUp() {
    this.routerObj.navigateByUrl("/signup")
  }
  navigateToSignUpDoctor() {
    this.routerObj.navigateByUrl("/signupdoctor")
    console.log("navigate to signup doctor");

  }
  //OTP FOR FORGOT PASSWORD-user
  generateOTP() {
    this.status = true;
    this.userServiceObj.otp(this.forgotPasswordForm.value).subscribe({
      next: (res: any) => {
        console.log(res)
        this.otp = res.payload
        if (res.message == "user not found") {
          this.doctorServiceObj.otp(this.forgotPasswordForm.value).subscribe({
            next: (res: any) => {
              console.log(res)
              this.otpDoctor = res.payload
              if (res.message == "doctor not found") {
                console.log("INVALID CREDENTIALS")
                
              }


            },
            error: (err) => {
              console.log(err)
            }
          })
        }
       
       


      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  checkOtp(formValue: any,ref) {
    if (formValue.otp == "") {
      console.log("otp not received ");
      this.status =false;
      this.forgotPasswordForm.reset()
      this.forgotPasswordForm.valid
      ref.submitted = false
      this.routerObj.navigateByUrl("/login")
    }
    else {


      console.log("otp from form is", formValue.otp, "username", formValue.usernameF);
      console.log("otp from otp generator is ", this.otp);
      this.status = false;
      if (formValue.otp == this.otp) {
        console.log("otp matched with user");
        this.userServiceObj.loginfpassword(formValue).subscribe({
          next: (res: any) => {
            console.log("res is ", res);
            if (res.message == "login success") {
              console.log("login success");
              this.userServiceObj.loginStatus = true;
              //local storage
              localStorage.setItem("token", res.token)
              this.userServiceObj.getUsername().next(res.user)
              this.userServiceObj.getUserType().next('user')
              this.doctorServiceObj.whichUser = true
              this.forgotPasswordForm.reset()
              this.forgotPasswordForm.valid
              ref.submitted = false
              this.routerObj.navigateByUrl(`userdashboard/${res.user.usernameF}`)

            }
          }
        })
      }
      else {
        if (formValue.otp == this.otpDoctor) {
          console.log("otp matched with doctor");
          this.doctorServiceObj.loginfpassword(formValue).subscribe({
            next: (res: any) => {
              console.log("res is ", res);
              if (res.message == "login success") {
                console.log("login success");
                this.userServiceObj.loginStatus = true;
                //local storage
                localStorage.setItem("token", res.token)
                this.doctorServiceObj.getDoctorName().next(res.doctor)
                this.userServiceObj.getUserType().next('doctor')
                this.doctorServiceObj.whichUser = false
                this.forgotPasswordForm.reset()
                this.forgotPasswordForm.valid
                ref.submitted = false
                this.routerObj.navigateByUrl(`doctordashboard/${res.doctor.usernameF}`)


              }
            }
          })
        }
      }
    }
  }

  get username() {
    return this.userLogin.get("username")
  }
  get password() {
    return this.userLogin.get("password")
  }
  //forgot password
  get usernameF() {
    return this.forgotPasswordForm.get("usernameF")
  }
  get phonenumberF() {
    return this.forgotPasswordForm.get("phonenumberF")
  }


}
