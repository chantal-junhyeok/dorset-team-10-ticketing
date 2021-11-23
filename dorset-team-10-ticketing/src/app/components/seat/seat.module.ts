import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeatRoutingModule } from './seat-routing.module';
import { SeatComponent } from './seat.component';


@NgModule({
  declarations: [SeatComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeatRoutingModule
  ]
})
export class SeatModule { }
