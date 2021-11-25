import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmationRoutingModule } from './confirmation-routing.module';
import { IonicModule } from '@ionic/angular';
import { ConfirmationComponent } from './confirmation.component';


@NgModule({
  declarations: [ConfirmationComponent],
  imports: [
    CommonModule,
    ConfirmationRoutingModule,
    IonicModule
  ]
})
export class ConfirmationModule { }
