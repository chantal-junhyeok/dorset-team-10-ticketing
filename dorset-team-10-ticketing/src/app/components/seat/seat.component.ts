import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Booking } from 'src/app/interfaces/booking';
import { BookingComponent } from '../booking/booking.component';
import { ContactComponent } from '../contact/contact.component';
@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss'],
})
export class SeatComponent implements OnInit {
  @Input() event: Event;
  @Input() dateTime: Date;
  @Input() booking: Booking;
  @Input() modalCtrl: ModalController;

  autoselect = true;

  ticketCount: number;

  rowIds = [];
  columnIds = [];

  rows = [];

  selectedSeats = [];

  constructor() { }

  ngOnInit() {
    this.ticketCount = this.booking.ticketCounts.adult + this.booking.ticketCounts.child + this.booking.ticketCounts.family * 6;

    for (let i = 0; i < 10; i++) {
      const rowId = String.fromCharCode(65 + i);
      this.rowIds.push(rowId);
    }

    for (let i = 0; i < 10; i++) {
      this.columnIds.push(i);
    }

    // Load seats, if already selected.
    this.selectedSeats = this.booking.seats.map(seat => {
      return {
        'position': seat,
        'selected': true,
        'booked': false
      }
    });

    this.initializeSeats();
  }

  initializeSeats() {
    // Load all the bookings

    // Save booked seats
    let bookedSeats = [];

    // Render seats
    this.rowIds.forEach(rowId => {
      const seats = [];

      this.columnIds.forEach(columnId => {
        const seatId = rowId + columnId;

        const seat = {
          'position': seatId,
          'booked': false,
          'selected': false
        };

        if (bookedSeats.includes(seatId)) {
          seat.booked = true;
        }

        seats.push(seat);
      });

      this.rows.push(seats);
    });
  }

  selectSeat(rowIndex, columnIndex) {
    if (this.autoselect == true) {
      // Calculate score for each seat
      const seats = [];

      this.rows.forEach((row, i) => {
        row.forEach((seat, j) => {
          seat.selected = false;

          const score = Math.abs(rowIndex - i) * this.ticketCount + Math.abs(columnIndex - j); // Spread more as tickets are more, because big group tend to stay in a row
          seat.score = score;
          seats.push(seat);
        });
      });

      this.selectedSeats = seats
        .sort((a, b) => a.score - b.score)
        .slice(0, this.ticketCount);

      this.selectedSeats.forEach(selectedSeat => {
        selectedSeat.selected = true;
      });
    } else {
      const seat = this.rows[rowIndex][columnIndex];
      
      if (seat.booked == false) {
        if (seat.selected == false) {
          if (this.selectedSeats.length < this.ticketCount) {
            seat.selected = true;
            this.selectedSeats.push(seat);
          }
        } else {
          seat.selected = false;
          this.selectedSeats.splice(this.selectedSeats.indexOf(seat), 1);
        }
      }
    }
  }

  async closeSeatModal() {
    this.modalCtrl.dismiss();

    const modal = await this.modalCtrl.create({
      component: BookingComponent,
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

  async openContactModal() {
    this.booking.seats = this.selectedSeats.map(seat => {
      return seat.position;
    });

    this.modalCtrl.dismiss();

    const modal = await this.modalCtrl.create({
      component: ContactComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'event': this.event,
        'dateTime': this.dateTime,
        'booking': this.booking,
        'modalCtrl': this.modalCtrl
      }
    });
    return await modal.present();
  }
}