import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';


@NgModule({
  declarations: [BookingComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookingRoutingModule
  ]
})
export class BookingModule { }
