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

  filteredEvents: Event[] = [];

  datetimes: Date[] = [];

  currentOpenIndex: number;

  query: string;
  ageG: boolean = true;
  agePG: boolean = true;
  ageR: boolean = true;
  ageX: boolean = true;
  sortBy: string;

  constructor(private dataService: DataService, private cd: ChangeDetectorRef, private alertCtrl: AlertController, private modalCtrl: ModalController) {
    this.dataService.getEvents().subscribe(result => {
      this.events = result;
      this.events.forEach(event => { this.filteredEvents.push(event); });
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

  toggleFilterBar() {
    $('#filter-bar').slideToggle();
  }

  changeQuery(newValue) {
    this.query = newValue;
    this.updateFilter();
  }

  changeSort(newValue) {
    this.sortBy = newValue;
    this.updateFilter();
  }

  updateFilter() {
    this.filteredEvents.length = 0;

    this.events.forEach(event => {
      let isIncluded = true;

      if (this.query != null && this.query.trim() != '' && !event.title.toLowerCase().includes(this.query.trim().toLowerCase())) {
        isIncluded = false;
      }

      if (!this.ageG && event.ageRating == 'G') {
        isIncluded = false;
      }
      
      if (!this.agePG && event.ageRating == 'PG') {
        isIncluded = false;
      }
      
      if (!this.ageR && event.ageRating == 'R') {
        isIncluded = false;
      }
      
      if (!this.ageX && event.ageRating == 'X') {
        isIncluded = false;
      }

      if (isIncluded) {
        this.filteredEvents.push(event);
      }
    });

    if (this.sortBy == "title-asc") {
      this.filteredEvents.sort(function (a, b) {
        return a.title < b.title ? -1 : a.title > b.title ? 1 : 0;
      });
    } else if (this.sortBy == "title-desc") {
      this.filteredEvents.sort(function (a, b) {
        return a.title > b.title ? -1 : a.title < b.title ? 1 : 0;
      });
    } else if (this.sortBy == "closest-showing-date") {
      const today = new Date().getTime() / 1000;

      this.filteredEvents.sort((a, b) => {
        return a.datetimes
        .filter(c => { return c.seconds > today; })
        .sort((c, d) => {
          return c.seconds - d.seconds;
        })[0].seconds - b.datetimes
        .filter(c => { return c.seconds > today; })
        .sort((c, d) => {
          return c.seconds - d.seconds;
        })[0].seconds;
      });
    }

    this.cd.detectChanges();
  }
}
