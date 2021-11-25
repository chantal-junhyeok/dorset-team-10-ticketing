import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Booking } from 'src/app/interfaces/booking';
import { Event } from 'src/app/interfaces/event';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  @Input() modalCtrl: ModalController;
  @Input() bookingId: string;

  booking: Booking;
  event: Event;

  bookingTickets: string
  bookingCustomerName: string
  seats: string

  constructor(private dataService: DataService, private alertController: AlertController) { }

  async ngOnInit() {
    this.booking = await this.dataService.getBooking(this.bookingId);
    if (this.booking) {
      this.event = await this.dataService.getEvent(this.booking.eventId);

      this.getBookingTickets();
      this.bookingCustomerName = this.booking.customer.firstname + " " + this.booking.customer.lastname;
      this.seats = this.booking.seats.toString();
    }
    if (!this.booking || !this.event) {
      this.showAlert('Sorry', 'Data could not retrieve from the database.', 'Confirm');
    }
  }

  async showAlert(header: string, message: string, button: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [button]
    });
    await alert.present();
  }

  async closeConfirmationModal() {
    this.modalCtrl.dismiss();
  }

  getBookingTickets() {
    if (this.booking.ticketCounts.adult > 0) {
      if (this.booking.ticketCounts.adult == 1) {
        this.bookingTickets = this.booking.ticketCounts.adult + " adult";
      } else {
        this.bookingTickets = this.booking.ticketCounts.adult + " adults";
      }

      if (this.booking.ticketCounts.child > 0) {
        if (this.booking.ticketCounts.child == 1) {
          this.bookingTickets = this.bookingTickets + ", " + this.booking.ticketCounts.child + " child";
        } else {
          this.bookingTickets = this.bookingTickets + ", " + this.booking.ticketCounts.child + " children";
        }
      }
    }

    if (this.booking.ticketCounts.family > 0) {
      if (this.bookingTickets) {
        this.bookingTickets = this.bookingTickets + ", " + this.booking.ticketCounts.family + " family";
      }
    }

  }

}
