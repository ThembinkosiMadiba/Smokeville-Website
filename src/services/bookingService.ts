import { collection, addDoc, doc, getDoc, getDocs, query, where, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Booking {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  phoneNumber: string;
  date: Date;
  time: string;
  guests: number;
  occasion?: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

// Create a new booking
export async function createBooking(bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const bookingsRef = collection(db, 'bookings');
    const docRef = await addDoc(bookingsRef, {
      ...bookingData,
      date: Timestamp.fromDate(bookingData.date),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

// Get booking by ID
export async function getBooking(bookingId: string): Promise<Booking | null> {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);
    
    if (bookingSnap.exists()) {
      return {
        id: bookingSnap.id,
        ...bookingSnap.data(),
        date: bookingSnap.data().date.toDate(),
        createdAt: bookingSnap.data().createdAt.toDate(),
        updatedAt: bookingSnap.data().updatedAt.toDate(),
      } as Booking;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting booking:', error);
    throw error;
  }
}

// Get user bookings
export async function getUserBookings(userId: string): Promise<Booking[]> {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const bookings: Booking[] = [];
    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      } as Booking);
    });
    
    return bookings.sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw error;
  }
}

// Update booking
export async function updateBooking(bookingId: string, updates: Partial<Booking>): Promise<void> {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    
    if (updates.date) {
      updateData.date = Timestamp.fromDate(updates.date);
    }
    
    await updateDoc(bookingRef, updateData);
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
}

// Cancel booking
export async function cancelBooking(bookingId: string): Promise<void> {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status: 'cancelled',
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw error;
  }
}

// Delete booking
export async function deleteBooking(bookingId: string): Promise<void> {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await deleteDoc(bookingRef);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
}

// Get all bookings (for admin)
export async function getAllBookings(): Promise<Booking[]> {
  try {
    const bookingsRef = collection(db, 'bookings');
    const querySnapshot = await getDocs(bookingsRef);
    
    const bookings: Booking[] = [];
    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      } as Booking);
    });
    
    return bookings.sort((a, b) => b.date.getTime() - a.date.getTime());
  } catch (error) {
    console.error('Error getting all bookings:', error);
    throw error;
  }
}

// Check availability for a specific date and time
export async function checkAvailability(date: Date, time: string): Promise<number> {
  try {
    const bookingsRef = collection(db, 'bookings');
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const q = query(
      bookingsRef,
      where('date', '>=', Timestamp.fromDate(startOfDay)),
      where('date', '<=', Timestamp.fromDate(endOfDay)),
      where('time', '==', time),
      where('status', 'in', ['pending', 'confirmed'])
    );
    
    const querySnapshot = await getDocs(q);
    let totalGuests = 0;
    
    querySnapshot.forEach((doc) => {
      totalGuests += doc.data().guests;
    });
    
    // Assuming max capacity is 100 guests
    const maxCapacity = 100;
    return maxCapacity - totalGuests;
  } catch (error) {
    console.error('Error checking availability:', error);
    throw error;
  }
}
