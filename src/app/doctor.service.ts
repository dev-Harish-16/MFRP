import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  whichUser: boolean = true;

  constructor(private httpClientObj: HttpClient) { }

  loginDoctor(userObj: any): Observable<any> {
    return this.httpClientObj.post("http://localhost:4200/doctor/login", userObj);
  }

  addDoctorToDatabase(userObj: any): Observable<any> {
    return this.httpClientObj.post("http://localhost:4200/doctor/createdoctor", userObj);
  }
  //editprofile
  editProfile(doctorObjUpdated: any): Observable<any> {
    console.log(`http://localhost:4200/doctor/updatedoctor/${this.logoutdoctorBehaviourSubject.getValue().username}`);
    //return null;
    return this.httpClientObj.put(`http://localhost:4200/doctor/updatedoctor/${this.logoutdoctorBehaviourSubject.getValue().username}`, doctorObjUpdated)
  }


  //get doctor values based on book appointment button selection
  doctorBehaviourSubject = new BehaviorSubject(null);
  logoutdoctorBehaviourSubject = new BehaviorSubject(null);
  getDoctorData() {
    return this.doctorBehaviourSubject
  }

  //getAccountPageDetails
  accountBehaviourSubject = new BehaviorSubject(null);
  getAccountPageDetails() {
    return this.accountBehaviourSubject
  }
  // getDoctorList
  getDoctorList(): Observable<any> {
    return this.httpClientObj.get<any>("http://localhost:4200/doctor/getdoctors")
  }
  getDoctorName() {
    return this.logoutdoctorBehaviourSubject;
  }
  doctorLogout() {
    localStorage.removeItem("token")

    this.logoutdoctorBehaviourSubject.next(null)
  }
  //add appoitmentDEtails to doctors collection in backend
  addAppointmentDetailsToDoctorsList(appointObj): Observable<any> {
    return this.httpClientObj.put(`http://localhost:4200/doctor/getdoctors/${appointObj.doctorusername}`, appointObj)
  }
  //update doctor wallet
  updateWalletOfDoctor(appointObj):Observable<any>{
    return this.httpClientObj.put(`http://localhost:4200/doctor/updatewallet/${appointObj.doctorusername}`,appointObj)
  }
  //change password
  changePasswordDoctorFn(formData):Observable<any>{
    return this.httpClientObj.put(`http://localhost:4200/doctor/updatepassword/${this.logoutdoctorBehaviourSubject.getValue().username}`, formData)
  }
  //forgot password
  otp(userObj):Observable<any>{
    return this.httpClientObj.post(`http://localhost:4200/doctor/forgotpassword/${userObj.usernameF}`,userObj);
  }
 //parse login with otp 
 loginfpassword(userObj):Observable<any>{
  return this.httpClientObj.post(`http://localhost:4200/doctor/loginfp/${userObj.usernameF}`,userObj);
}

}
