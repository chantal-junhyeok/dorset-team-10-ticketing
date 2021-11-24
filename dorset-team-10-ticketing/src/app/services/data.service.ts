import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection } from '@firebase/firestore';
import { collectionData } from 'rxfire/firestore';
import { Observable } from 'rxjs';
import { Booking } from '../interfaces/booking';
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

  async saveBooking(booking: Booking): Promise<string> {
    const bookings = collection(this.firestore, 'bookings');
    
    let id: string = '';
    
    await addDoc(bookings, booking)
      .then(docRef => {
          id = docRef.id;
      })
      .catch(error => console.error("Error adding document: ", error));
    
    return id;
  }
}
