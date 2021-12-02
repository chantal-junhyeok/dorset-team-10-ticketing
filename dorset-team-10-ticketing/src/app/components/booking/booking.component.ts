import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Booking } from 'src/app/interfaces/booking';
import { Event } from 'src/app/interfaces/event';
import { DataService } from 'src/app/services/data.service';
import { SeatComponent } from '../seat/seat.component';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  @Input() event: Event;
  @Input() dateTime: Date;
  @Input() modalCtrl: ModalController;

  @Input() booking?: Booking;

  availableSeats: number;

  constructor(private router: Router, private dataService: DataService, private alertController: AlertController) { }

  ngOnInit() {
    this.validateInputs();

    if (this.booking == null) {
      this.booking = {
        ticketCounts: {
          adult: 0,
          child: 0,
          family: 0
        },
        totalPrice: 0,
        customer: {
          firstname: '',
          lastname: '',
          email: '',
        },
        eventId: this.event.id,
        seats: [],
        dateTime: this.dateTime
      }
    }

    // Check if enough seats are available
    this.dataService.getBookings(this.event.id, this.booking.dateTime)
    .then(result => {
      // Collect all booked seats
      let bookings = result;
      const bookedSeats: string[] = [];
      bookings.forEach(booking => {
        booking.seats.forEach(seat => {
          bookedSeats.push(seat);
        });
      });
      
      this.availableSeats = 100 - bookedSeats.length;
    })
    .catch(error => {
      console.log(error);
    });
  }

  validateInputs() {
    if (this.event == null || this.dateTime == null || this.modalCtrl == null) {
      this.router.navigate(['home']);
    }
  }

  showFamilyInfo() {
    this.showAlert('Family ticket', 'A family ticket contains 2 adult tickets and 4 child tickets.', 'Okay');
  }

  addAdultTicket() {
    // TODO: Replace number with environment variable (config)
    if (this.booking.ticketCounts.adult + this.booking.ticketCounts.family * 2 < 5) {
      this.booking.ticketCounts.adult += 1;
      this.calculateTotalPrice();
    } else {
      this.showAlert('Sorry', 'Max. 5 adult tickets (incl. 2 in a family ticket) can be booked at a time.', 'Okay');
    }
    this.checkAndReplaceWithFamilyTicket();
  }

  removeAdultTicket() {
    if (this.booking.ticketCounts.adult > 0) {
      this.booking.ticketCounts.adult -= 1;
      this.calculateTotalPrice();
    }
  }

  addChildTicket() {
    if (this.booking.ticketCounts.child + this.booking.ticketCounts.family * 4 < 4) {
      if (this.booking.ticketCounts.adult > 0) {
        // TODO: Replace number with environment variable (config)
        this.booking.ticketCounts.child += 1;
        this.calculateTotalPrice();
        this.checkAndReplaceWithFamilyTicket();
      } else {
        this.showAlert('Sorry', "A child or children must be accompanied by at least one adult.", "Confirm");
      }
    } else {
      this.showAlert('Sorry', 'Max. 4 children tickets (incl. 4 in a family ticket) can be booked at a time.', 'Okay');
    }
  }

  removeChildTicket() {
    if (this.booking.ticketCounts.child > 0) {
      this.booking.ticketCounts.child -= 1;
      this.calculateTotalPrice();
    }
  }

  checkAndReplaceWithFamilyTicket() {
    if (this.booking.ticketCounts.adult >= 2 && this.booking.ticketCounts.child >= 4) {
      const totalWithoutFamily = this.booking.totalPrice;

      this.booking.ticketCounts.family += 1;
      this.booking.ticketCounts.child -= 4;
      this.booking.ticketCounts.adult -= 2;

      this.calculateTotalPrice();

      const savedAmount = totalWithoutFamily - this.booking.totalPrice;

      this.showAlert('Family Ticket', `Your tickets are replaced with one family ticket. You saved €${savedAmount}`, 'Confirm');
    }
  }

  addFamilyTicket() {
    if (this.booking.ticketCounts.family < 1) {
      if (this.booking.ticketCounts.adult <= 3) {
        if (this.booking.ticketCounts.child <= 0) {
          this.booking.ticketCounts.family += 1;
          this.calculateTotalPrice();
        } else {
          this.showAlert('Sorry', 'Max. 4 children tickets (incl. 4 in a family ticket) can be booked at a time.', 'Okay');
        }
      } else {
        this.showAlert('Sorry', 'Max. 5 adult tickets (incl. 2 in a family ticket) can be booked at a time.', 'Okay');
      }
    }
    else {
      this.showAlert('Sorry', 'You can only book one family ticket at a time.', 'Okay');
    }
  }

  removeFamilyTicket() {
    if (this.booking.ticketCounts.family > 0) {
      this.booking.ticketCounts.family -= 1;
      this.calculateTotalPrice();
    }
  }

  removeTicket(type: number) {
    this.booking.ticketCounts[Object.keys(this.booking.ticketCounts)[type]] = this.booking.ticketCounts[Object.keys(this.booking.ticketCounts)[type]] > 0 ?
      this.booking.ticketCounts[Object.keys(this.booking.ticketCounts)[type]] - 1 : 0;
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.booking.totalPrice = 0;
    this.booking.totalPrice += this.booking.ticketCounts.adult * this.event.prices.adult;
    this.booking.totalPrice += this.booking.ticketCounts.child * this.event.prices.child;
    this.booking.totalPrice += this.booking.ticketCounts.family * this.event.prices.family;
  }

  async showAlert(header: string, message: string, button: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [button]
    });
    await alert.present();
  }

  async closeBookingModal() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Cancel Booking',
      message: 'Do you want to cancel the current booking? All information will be lost.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            this.modalCtrl.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

  async openSeatModal() {
    if (this.booking.ticketCounts.adult > 0 || this.booking.ticketCounts.child > 0 || this.booking.ticketCounts.family > 0) {
      if (this.booking.ticketCounts.adult + this.booking.ticketCounts.child + this.booking.ticketCounts.family * 6 < this.availableSeats) {
        this.modalCtrl.dismiss();

        const modal = await this.modalCtrl.create({
          component: SeatComponent,
          cssClass: 'my-custom-class',
          componentProps: {
            'event': this.event,
            'dateTime': this.dateTime,
            'booking': this.booking,
            'modalCtrl': this.modalCtrl
          }
        });

        return await modal.present();
      } else {
        this.showAlert('Sorry', "Not enough seats are avilable. Please choose another session.", "Confirm");
      }
    } else {
      this.showAlert('Sorry', "Please add at least one ticket to proceed with your booking.", "Confirm");
    }
  }
}
