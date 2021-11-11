import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Event } from 'src/app/interfaces/event';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  events: Event[] = [];

  constructor(private dataService: DataService, private cd: ChangeDetectorRef, private alertCtrl: AlertController, private modalCtrl: ModalController) {
    this.dataService.getEvents().subscribe(result => {
      this.events = result;
      this.cd.detectChanges();
    });
  }

  ngOnInit() {}

}
