import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { UserService } from '../user.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  modalRef?: BsModalRef;
  userSignup: FormGroup;
  userTypes = ['USER', 'DOCTOR'];
  constructor(private signupFormBuilderObj: FormBuilder, private routerObj: Router, private userServiceObj: UserService,public modalService: BsModalService) { }

  ngOnInit(): void {
    this.userSignup = this.signupFormBuilderObj.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      age: ['', [Validators.required, Validators.pattern("^[0-9]{2}$")]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')]],
      city: ['', Validators.required],
      password: ['', Validators.required],
      phoneno: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]]
    })


  }
  //user created message modal
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  confirm() {
    this.routerObj.navigateByUrl('/login');
    this.modalRef.hide();
  }

  //on submitting the form
  signupSubmit(template: TemplateRef<any>) {
    console.log(this.userSignup.value);
    this.userServiceObj.addUserToDatabase(this.userSignup.value).subscribe({
      next: (res) => {
        console.log('res is', res);

        //call user created message modal
        this.openModal(template);
      },
      error: (err) => {
        console.log('something went wrong ', err);
      },
    });
  }

  get name() {
    return this.userSignup.get("name")
  }
  get username() {
    return this.userSignup.get("username")
  }
  get password() {
    return this.userSignup.get("password")
  }
  get age() {
    return this.userSignup.get("age")
  }
  get phoneno() {
    return this.userSignup.get("phoneno")
  }
  get email() {
    return this.userSignup.get("email")
  }
  get city() {
    return this.userSignup.get("city")
  }
}
