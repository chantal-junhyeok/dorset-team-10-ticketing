import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Booking } from 'src/app/interfaces/booking';
import { Event } from 'src/app/interfaces/event';
import { DataService } from 'src/app/services/data.service';
import { BookingComponent } from '../booking/booking.component';
import { ContactComponent } from '../contact/contact.component';
@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss'],
})
export class SeatComponent implements OnInit {
  @Input() event: Event;
  @Input() booking: Booking;
  @Input() modalCtrl: ModalController;

  autoselect = true;

  ticketCount: number;

  rows: Row[] = [];

  selectedSeats: Seat[] = [];

  constructor(private dataService: DataService, private alertController: AlertController) { }

  ngOnInit() {
    // Count the number of tickets.
    this.ticketCount = this.booking.ticketCounts.adult + this.booking.ticketCounts.child + this.booking.ticketCounts.family * 6;

    // Create seat objects and check if they were previously selected.
    for (let i = 0; i < 10; i++) {
      const rowName = String.fromCharCode(65 + i);
      const row = { index: i, name: rowName, seats: [] };
      for (let j = 0; j < 10; j++) {
        const seatName = `${rowName}${j}`;
        const seat = { index: j, name: seatName, booked: false, selected: this.booking.seats.includes(seatName) };
        row.seats.push(seat);
      }
      this.rows.push(row);
    }
    this.updateSelectedSeats();

    // Load booked seats
    console.log(this.event.id);

    this.dataService.getBookings(this.event.id, this.booking.dateTime)
      .then(result => {
        // Collect all booked seats names.
        let bookings = result;
        const bookedSeats = [];
        bookings.forEach(booking => {
          booking.seats.forEach(seat => {
            bookedSeats.push(seat);
          });
        });

        // Mark all booked seats
        this.rows.forEach(row => {
          row.seats.forEach(seat => {
            if (bookedSeats.includes(seat.name)) {
              seat.booked = true;
            }
          });
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  selectSeat(chosenRow: Row, chosenSeat: Seat) {
    if (!chosenSeat.booked) {
      if (this.autoselect == true) {
        const seats = [];
        // Reset selection
        this.rows.forEach(row => {
          row.seats.forEach(seat => {
            seat.selected = false;
          });
        });

        // Calculate the distance score for each seat
        this.rows.forEach(row => {
          row.seats.forEach(seat => {
            seat.score = seat.booked ? 100 : Math.abs(chosenRow.index - row.index) * this.ticketCount + Math.abs(chosenSeat.index - seat.index);
            // If adjoined seat is selected lesson score to priotize it
            if ((row.seats[seat.index - 1] != undefined && row.seats[seat.index - 1].selected) || 
              (row.seats[seat.index + 1] != undefined && row.seats[seat.index + 1].selected)) {
                seat.score -= this.ticketCount;
            }
            seats.push(seat);
          });
        });
        // Select the seats with the lowest distance scores
        seats
          .sort((a, b) => a.score - b.score)
          .slice(0, this.ticketCount)
          .forEach(seat => {
            seat.selected = true;
          });
      } else {
        if (!chosenSeat.selected) {
          if (this.ticketCount > this.selectedSeats.length)
            chosenSeat.selected = true;
        } else {
          chosenSeat.selected = false;
        }
      }
    }

    this.updateSelectedSeats();
  }

  updateSelectedSeats(): void {
    this.selectedSeats = [];
    this.rows.forEach(row => {
      row.seats.forEach(seat => {
        if (seat.selected) {
          this.selectedSeats.push(seat);
        }
      });
    });
  }

  saveSelectedSeats(): void {
    this.booking.seats = this.selectedSeats.map(seat => {
      return seat.name;
    });
  }

  async closeSeatModal() {
    this.saveSelectedSeats();

    this.modalCtrl.dismiss();

    const modal = await this.modalCtrl.create({
      component: BookingComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'event': this.event,
        'dateTime': this.booking.dateTime,
        'modalCtrl': this.modalCtrl,
        'booking': this.booking
      }
    });
    return await modal.present();
  }

  async openContactModal() {
    this.saveSelectedSeats();

    if (this.selectedSeats.length == this.ticketCount) {
      this.modalCtrl.dismiss();

      const modal = await this.modalCtrl.create({
        component: ContactComponent,
        cssClass: 'my-custom-class',
        componentProps: {
          'event': this.event,
          'booking': this.booking,
          'modalCtrl': this.modalCtrl
        }
      });
      return await modal.present();
    } else {
      const alert = await this.alertController.create({
        header: 'Sorry',
        message: 'Please select enought seats.',
        buttons: ['Okay']
      });
      await alert.present();
    }
  }
}

interface Row {
  index: number;
  name: string;
  seats: Seat[];
}

interface Seat {
  index: number;
  name: string;
  booked: boolean;
  selected: boolean;
  score?: number;
}