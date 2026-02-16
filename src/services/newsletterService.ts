import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  name?: string;
  subscribedAt: Date;
  isActive: boolean;
  preferences?: {
    deals: boolean;
    events: boolean;
    news: boolean;
  };
}

// Subscribe to newsletter
export async function subscribeToNewsletter(email: string, name?: string): Promise<string> {
  try {
    // Check if email already exists
    const subscribersRef = collection(db, 'newsletter');
    const q = query(subscribersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('This email is already subscribed to our newsletter');
    }

    const docRef = await addDoc(subscribersRef, {
      email,
      name: name || '',
      subscribedAt: Timestamp.now(),
      isActive: true,
      preferences: {
        deals: true,
        events: true,
        news: true,
      },
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }
}

// Get all subscribers (for admin)
export async function getAllSubscribers(): Promise<NewsletterSubscriber[]> {
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
    console.error('Error getting subscribers:', error);
    throw error;
  }
}
