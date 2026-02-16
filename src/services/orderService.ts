import { collection, addDoc, doc, getDoc, getDocs, query, where, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CartItem, OrderType } from '../contexts/CartContext';
import { awardOrderPoints, checkOrderAchievements } from './loyaltyService';

export interface Order {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: CartItem[];
  orderType: OrderType;
  deliveryAddress?: string;
  deliveryInstructions?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  estimatedTime?: string;
  tableNumber?: string;
  phoneNumber?: string;
  paymentMethod?: string;
  paymentIntentId?: string;
}

// Create a new order
export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    const ordersRef = collection(db, 'orders');
    
    // Filter out undefined values to prevent Firestore errors
    const cleanedData = Object.fromEntries(
      Object.entries({
        ...orderData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }).filter(([_, value]) => value !== undefined)
    );
    
    const docRef = await addDoc(ordersRef, cleanedData);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Get order by ID
export async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (orderSnap.exists()) {
      return {
        id: orderSnap.id,
        ...orderSnap.data(),
        createdAt: orderSnap.data().createdAt.toDate(),
        updatedAt: orderSnap.data().updatedAt.toDate(),
      } as Order;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
}

// Get user orders
export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      } as Order);
    });
    
    // Sort by createdAt descending
    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Timestamp.now(),
    });

    // Award loyalty points when order is completed
    if (status === 'completed') {
      const order = await getOrder(orderId);
      if (order) {
        await awardOrderPoints(order.userId, order.total);
        
        // Get user's total order count and spending
        const userOrders = await getUserOrders(order.userId);
        const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
        
        await checkOrderAchievements(order.userId, userOrders.length, totalSpent);
      }
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// Get all orders (for admin)
export async function getAllOrders(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersRef);
    
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      } as Order);
    });
    
    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error getting all orders:', error);
    throw error;
  }
}
