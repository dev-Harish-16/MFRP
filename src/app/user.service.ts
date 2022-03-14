import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  userBehaviourSubject = new BehaviorSubject(null)
  userTypeBehaviourSubject = new BehaviorSubject(null)

  loginStatus: boolean = false;
  constructor(public httpClientObj: HttpClient) {

  }
  addUserToDatabase(userObj: any) {
    return this.httpClientObj.post("http://localhost:4200/user/createuser", userObj);
  }

  loginUser(userObj: any): Observable<any> {

    return this.httpClientObj.post("http://localhost:4200/user/login", userObj);

  }
  //to add to appointment page
  addAppointmentDetails(appointObj: any): Observable<any> {
    return this.httpClientObj.put(`http://localhost:4200/user/userdashboard/${appointObj.username}`, appointObj);
  }
  //get user by username
  getUserDetailsAfterPayment(username: any): Observable<any> {
    return this.httpClientObj.get(`http://localhost:4200/user/getuser/${username}`)
  }
  //update wallet
  updateWallet(userObj: any): Observable<any> {
    return this.httpClientObj.put(`http://localhost:4200/user/wallet/${userObj.username}`, userObj)
  }
  //editprofile
  editProfile(userObjUpdated: any): Observable<any> {
    console.log(`http://localhost:4200/user/updateuser/${this.userBehaviourSubject.getValue().username}`);
    //return null;
    return this.httpClientObj.put(`http://localhost:4200/user/updateuser/${this.userBehaviourSubject.getValue().username}`, userObjUpdated)
  }
  //change password
  changePasswordFn(formData) {
    return this.httpClientObj.put(`http://localhost:4200/user/updatepassword/${this.userBehaviourSubject.getValue().username}`, formData)
  }

  getUsername() {
    return this.userBehaviourSubject;
  }
  getUserType() {
    return this.userTypeBehaviourSubject;
  }
  otp(userObj) {
    return this.httpClientObj.post(`http://localhost:4200/user/forgotpassword/${userObj.usernameF}`, userObj);
  }
  loginfpassword(userObj) {
    return this.httpClientObj.post(`http://localhost:4200/user/loginfp/${userObj.usernameF}`, userObj);
  }
  userLogout() {
    localStorage.removeItem("token")

    this.userBehaviourSubject.next(null)
  }
  //to update the user subcription when subscribed
  updateUserSubscription(userObj: any): Observable<any> {
    return this.httpClientObj.put(`http://localhost:4200/user/userdashboard/subscription/${userObj.username}`, userObj)
  }
}
