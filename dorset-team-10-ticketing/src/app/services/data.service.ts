import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, getDoc, getDocs, query, where } from '@firebase/firestore';
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

  async getBookings(eventId: string): Promise<Booking[]> {
    const bookingsRef = collection(this.firestore, 'bookings');
    const q = query(bookingsRef, where("eventId", "==", eventId));
    const querySnapshot = await getDocs(q);
    const result: Booking[] = [];
    querySnapshot.forEach((doc) => {
      result.push(doc.data() as Booking);
    });
    return result;
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

  async getBooking(id : string): Promise<Booking> {
    const bookingRef = doc(this.firestore, `bookings/${id}`);
    const bookingSnap = await getDoc(bookingRef);

    if (bookingSnap.exists()) {
      return bookingSnap.data() as Booking;
    } else {
      return null;
    }
  }

  async getEvent(id : string): Promise<Event> {
    const ref = doc(this.firestore, `events/${id}`);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return snap.data() as Event;
    } else {
      return null;
    }
  }
}
