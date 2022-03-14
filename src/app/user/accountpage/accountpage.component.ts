import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { DoctorService } from 'src/app/doctor.service';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-accountpage',
  templateUrl: './accountpage.component.html',
  styleUrls: ['./accountpage.component.css'],
})

export class AccountpageComponent implements OnInit {
  message: string = '';
  modalRef?: BsModalRef;

  accountDetails: any;
  value: number = 0;
  valueFromInput: number;
  payment: boolean = false;
  walletUpdateForDoctor: Number;

  constructor(
    public serviceObj: DoctorService,
    public userserviceObj: UserService,
    public routerObj: Router,
    public fb: FormBuilder,
    public modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.accountDetails = this.serviceObj.getAccountPageDetails().getValue();
    this.userserviceObj
      .getUserDetailsAfterPayment(this.accountDetails.username)
      .subscribe({
        next: (res) => {
          this.accountDetails.wallet = res.payload.wallet;
        },
      });
  }

  /* modal for insufficent balance and successfull payment */
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  confirm() {
    this.routerObj.navigateByUrl(`/userdashboard/appoint/${this.userserviceObj.getUsername().getValue().username}`);
    this.modalRef.hide();
  }


  successfulPayment(template: TemplateRef<any>) {
    if (this.accountDetails.wallet >= this.accountDetails.consultationFee) {
      this.payment = true;
      this.accountDetails.wallet =
        this.accountDetails.wallet - this.accountDetails.consultationFee;

      this.message = 'payment successfull';
      this.openModal(template)

      console.log(this.accountDetails, 'from accountpage after succeseful');

      //to add the appointment details to the backend
      this.userserviceObj.addAppointmentDetails(this.accountDetails).subscribe({
        next: (res) => {
          console.log(res);

        },
        error: (err) => {
          console.log(err);
        },
      });

      //to update the wallet balance to wallet variable in backend
      this.userserviceObj.updateWallet(this.accountDetails).subscribe({
        next: (res) => {
          console.log((this.accountDetails.wallet = res.payload.wallet));
        },
        error: (err) => {
          console.log(err);
        },
      });

      //to add the appoinment details to the doctorcollection backend
      this.serviceObj
        .addAppointmentDetailsToDoctorsList(this.accountDetails)
        .subscribe({
          next: (res) => {
            console.log(
              res,
              'added these appointment details to doctorcollection too!'
            );
            this.walletUpdateForDoctor = res.payload.wallet;
          },
          error: (err) => {
            console.log(err);
          },
        });

      //update doctor wallet

      this.accountDetails.doctorWalletAddition =
        this.accountDetails.consultationFee;

      this.serviceObj.updateWalletOfDoctor(this.accountDetails).subscribe({
        next: (res) => {
          console.log(res.payload);
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.payment = false;
      this.message = 'Insufficient Balance!';
      /* alert modal */
      this.openModal(template)

    }
  }

  addToInput(valuefromButton) {
    this.value = this.value + valuefromButton;
  }

  AddMOney = this.fb.group({
    addMoney: [''],
  });

  addToWallet() {
    this.valueFromInput = this.AddMOney.value.addMoney;
    console.log(this.AddMOney.value.addMoney);
    this.accountDetails.wallet =
      this.accountDetails.wallet + this.valueFromInput;
    //to update the wallet balance to wallet variable in backend
    this.userserviceObj.updateWallet(this.accountDetails).subscribe({
      next: (res) => {
        console.log((this.accountDetails.wallet = res.payload.wallet));
      },
      error: (err) => {
        err;
      },
    });
  }
}
