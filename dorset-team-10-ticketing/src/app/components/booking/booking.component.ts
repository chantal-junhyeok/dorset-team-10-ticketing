import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Booking } from 'src/app/interfaces/booking';
import { Event } from 'src/app/interfaces/event';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  @Input() event: Event;
  @Input() dateTime: Date;

  booking: Booking;

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
    this.validateEvent();

    this.booking = {
      id: '',
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
      seats: []
    };
  }
  
  validateEvent() {
    if (this.event == null || this.dateTime == null) {
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
    if (this.booking.ticketCounts.adult <= 3 && this.booking.ticketCounts.child <= 0) {

      this.booking.ticketCounts.family += 1;
      this.calculateTotalPrice();
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
}
