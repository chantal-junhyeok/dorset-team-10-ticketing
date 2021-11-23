import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SeatRoutingModule } from './seat-routing.module';
import { SeatComponent } from './seat.component';


@NgModule({
  declarations: [SeatComponent],
  imports: [
    CommonModule,
    SeatRoutingModule
  ]
})
export class SeatModule { }
