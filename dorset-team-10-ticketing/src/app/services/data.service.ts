import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Observable } from 'rxjs';
import { Event } from '../interfaces/event';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore: Firestore) { }
  
  getEvents(): Observable<Event[]> {
    const events = collection(this.firestore, 'events');
    return collectionData(events, { idField: 'id' }) as Observable<Event[]>;
  }
}
