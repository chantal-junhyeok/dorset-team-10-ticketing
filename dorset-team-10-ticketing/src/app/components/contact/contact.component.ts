import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Booking } from 'src/app/interfaces/booking';
import { DataService } from 'src/app/services/data.service';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { SeatComponent } from '../seat/seat.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @Input() event: Event;
  @Input() dateTime: Date;
  @Input() booking: Booking;
  @Input() modalCtrl: ModalController;

  bookingId: string;

  constructor(private dataService: DataService, private alertController: AlertController) { }

  ngOnInit() { }

  async closeContactModal() {
    this.modalCtrl.dismiss();

    const modal = await this.modalCtrl.create({
      component: SeatComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'event': this.event,
        'dateTime': this.dateTime,
        'modalCtrl': this.modalCtrl,
        'booking': this.booking
      }
    });
    return await modal.present();
  }

  async openConfirmationModal() {
    this.modalCtrl.dismiss();

    const modal = await this.modalCtrl.create({
      component: ConfirmationComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'modalCtrl': this.modalCtrl,
        'bookingId': this.bookingId
      }
    });
    return await modal.present();
  }

  async showAlert(header: string, message: string, button: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [button]
    });
    await alert.present();
  }

  async saveBooking() {
    if (this.validate()) {
      const id = await this.dataService.saveBooking(this.booking);
      if (id) {
        this.bookingId = id;
        this.openConfirmationModal();
      }
    }

  }

  validate() {

    if (!this.booking.customer.firstname) {
      this.showAlert('Sorry', 'Please enter a valid first name.', 'Confirm');
      return false;
    }
    else if (!this.booking.customer.lastname) {
      this.showAlert('Sorry', 'Please enter a valid last name.', 'Confirm');
      return false;
    }
    else if (!this.booking.customer.email || !this.validateEmail(this.booking.customer.email)) {
      this.showAlert('Sorry', 'Please enter a valid email address.', 'Confirm');
      return false;
    }
    return true;

  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
