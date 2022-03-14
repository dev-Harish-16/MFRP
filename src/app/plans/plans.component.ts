import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DoctorService } from '../doctor.service';
import { UserService } from '../user.service';
@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css']
})
export class PlansComponent implements OnInit {
  //this is user obj to send to the account page when there is no sufficient balance in the users wallet
  userObj = {
    username: '',
    wallet: 0,
    subscription: ''
  }
  //varaible to store the price of plan mentioned in the cards
  priceofplan: number = 0;
  //variable to store the name of plan mentioned in the cards
  planName: string = '';
  constructor(public userservObj: UserService, public routerObj: Router, public docServObj: DoctorService) { }

  ngOnInit(): void {
    //getting the username from the login page 
    this.userObj.username = this.userservObj.getUsername().getValue().username;
    console.log(this.userObj.username);
    //getting the wallet of user from the backend through a simple get request
    this.userservObj.getUserDetailsAfterPayment(this.userObj.username).subscribe({
      next: (res) => {
        this.userObj.wallet = res.payload.wallet
        console.log(this.userObj.wallet);
      }
    })
  }

  //to check the login status
  checkLogin() {
    console.log(this.userservObj.loginStatus);
    if (this.userservObj.loginStatus == true) {
      console.log("user loggedin");
    }
    else {
      //route to the login page
      this.routerObj.navigateByUrl("/login")
    }
  }
  //to get the price from the button clicked and send those values to the varaibales
  getvalues(value) {
    //gettign the value from the buttons clicked on a particular plans cards
    this.priceofplan = value;
    if (this.priceofplan == 500) {
      this.planName = "Basic"
    }
    else {
      this.planName = "Premium"
    }
  }
  //to pay
  pay() {
    if (this.userObj.wallet >= this.priceofplan) {
      this.userObj.wallet = this.userObj.wallet - this.priceofplan;
      console.log("subscribed");
      //update the wallet balance to the user database
      this.userservObj.updateWallet(this.userObj).subscribe({
        next: (res) => {
          console.log(res, "after updating in subscription page");
        },
        error: (err) => { err }
      })
      //alert after payment is succssful
      alert("SUBSCRIBED!!")
      this.userObj.subscription = this.planName
      //update the subsciption name to the user backend database
      this.userservObj.updateUserSubscription(this.userObj).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
     //redirect to account page if the balance is lesst than the price to add money to user wallet
     else {
      //next the userobj to the account page so that the user can get his values of wallet at ngoninit itself
      this.docServObj.getAccountPageDetails().next(this.userObj)
      this.routerObj.navigateByUrl(`/userdashboard/account/${this.userservObj.getUsername().getValue().username}`)
    }

  }

}

