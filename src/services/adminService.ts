import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Order } from './orderService';
import type { Booking } from './bookingService';
import type { Review } from './reviewService';
import type { NewsletterSubscriber } from './newsletterService';

// Admin user IDs - Add your admin user IDs here
const ADMIN_USER_IDS = [
  'iHnO8vOgbWUqvglNJioU5KMH6IB3', // Your admin user ID
  // Add more admin user IDs as needed
];

// Check if user is admin
export function isAdmin(userId: string): boolean {
  console.log('🔍 Admin Check:', {
    userId,
    adminUIDs: ADMIN_USER_IDS,
    isAdmin: ADMIN_USER_IDS.includes(userId)
  });
  return ADMIN_USER_IDS.includes(userId);
}

// ==================== ORDERS MANAGEMENT ====================

export async function getAllOrders(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error getting all orders:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function deleteOrder(orderId: string): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await deleteDoc(orderRef);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}

// ==================== BOOKINGS MANAGEMENT ====================

export async function getAllBookings(): Promise<Booking[]> {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const bookings: Booking[] = [];
    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate(),
        createdAt: doc.data().createdAt.toDate(),
      } as Booking);
    });
    
    return bookings;
  } catch (error) {
    console.error('Error getting all bookings:', error);
    throw error;
  }
}

export async function updateBookingStatus(bookingId: string, status: Booking['status']): Promise<void> {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, {
      status,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

export async function deleteBooking(bookingId: string): Promise<void> {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await deleteDoc(bookingRef);
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
}

// ==================== REVIEWS MANAGEMENT ====================

export async function getAllReviews(): Promise<Review[]> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const reviews: Review[] = [];
    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      } as Review);
    });
    
    return reviews;
  } catch (error) {
    console.error('Error getting all reviews:', error);
    throw error;
  }
}

export async function deleteReview(reviewId: string): Promise<void> {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await deleteDoc(reviewRef);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}

// ==================== MENU MANAGEMENT ====================

export interface MenuItem {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  featured: boolean;
  tags?: string[];
  createdAt?: Date;
}

export async function getAllMenuItems(): Promise<MenuItem[]> {
  try {
    const menuRef = collection(db, 'menu');
    const querySnapshot = await getDocs(menuRef);
    
    const items: MenuItem[] = [];
    querySnapshot.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      } as MenuItem);
    });
    
    return items;
  } catch (error) {
    console.error('Error getting menu items:', error);
    throw error;
  }
}

export async function addMenuItem(item: MenuItem): Promise<string> {
  try {
    const menuRef = collection(db, 'menu');
    const docRef = await addDoc(menuRef, {
      ...item,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw error;
  }
}

export async function updateMenuItem(itemId: string, updates: Partial<MenuItem>): Promise<void> {
  try {
    const itemRef = doc(db, 'menu', itemId);
    await updateDoc(itemRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw error;
  }
}

export async function deleteMenuItem(itemId: string): Promise<void> {
  try {
    const itemRef = doc(db, 'menu', itemId);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw error;
  }
}

// ==================== NEWSLETTER MANAGEMENT ====================

export async function getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const subscribersRef = collection(db, 'newsletter');
    const querySnapshot = await getDocs(subscribersRef);
    
    const subscribers: NewsletterSubscriber[] = [];
    querySnapshot.forEach((doc) => {
      subscribers.push({
        id: doc.id,
        ...doc.data(),
        subscribedAt: doc.data().subscribedAt.toDate(),
      } as NewsletterSubscriber);
    });
    
    return subscribers.sort((a, b) => b.subscribedAt.getTime() - a.subscribedAt.getTime());
  } catch (error) {
    console.error('Error getting newsletter subscribers:', error);
    throw error;
  }
}

// ==================== ANALYTICS ====================

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalBookings: number;
  pendingBookings: number;
  totalReviews: number;
  averageRating: number;
  newsletterSubscribers: number;
  todayOrders: number;
  todayRevenue: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [orders, bookings, reviews, subscribers] = await Promise.all([
      getAllOrders(),
      getAllBookings(),
      getAllReviews(),
      getAllNewsletterSubscribers(),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter(order => order.createdAt >= today);
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.overallRating, 0) / reviews.length
      : 0;

    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      totalRevenue,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10,
      newsletterSubscribers: subscribers.length,
      todayOrders: todayOrders.length,
      todayRevenue,
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    throw error;
  }
}
