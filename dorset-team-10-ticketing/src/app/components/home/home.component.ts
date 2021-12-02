import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Event } from 'src/app/interfaces/event';
import { DataService } from 'src/app/services/data.service';
import { BookingComponent } from '../booking/booking.component';

import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  events: Event[] = [];
  datetimes: Date[] = [];

  currentOpenIndex: number;

  constructor(private dataService: DataService, private cd: ChangeDetectorRef, private alertCtrl: AlertController, private modalCtrl: ModalController) {
    this.dataService.getEvents().subscribe(result => {
      this.events = result;
      this.cd.detectChanges();
    });
  }

  ngOnInit() {
  }

  openEvent(index: number){
    if (this.currentOpenIndex != null) {
      $($('.div-dates')[this.currentOpenIndex]).slideUp();
    }

    if (this.currentOpenIndex != index) {
      this.currentOpenIndex = index;
      $($('.div-dates')[index]).slideDown();
    }
  }

  async openBooking(event: Event, dateTime: Date) {
    const modal = await this.modalCtrl.create({
      component: BookingComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'event': event,
        'dateTime': dateTime,
        'modalCtrl': this.modalCtrl
      }
    });
    return await modal.present();
  }
}
