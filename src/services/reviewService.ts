import { collection, addDoc, doc, getDoc, getDocs, query, where, orderBy, limit, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Review {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  ratings: {
    service: number;
    food: number;
    ambience: number;
    value: number;
  };
  overallRating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  verified?: boolean;
  helpful?: number;
}

// Create a new review
export async function createReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt' | 'helpful'>): Promise<string> {
  try {
    const reviewsRef = collection(db, 'reviews');
    
    // Calculate overall rating
    const overallRating = (
      reviewData.ratings.service +
      reviewData.ratings.food +
      reviewData.ratings.ambience +
      reviewData.ratings.value
    ) / 4;
    
    const docRef = await addDoc(reviewsRef, {
      ...reviewData,
      overallRating,
      helpful: 0,
      verified: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}

// Get review by ID
export async function getReview(reviewId: string): Promise<Review | null> {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    const reviewSnap = await getDoc(reviewRef);
    
    if (reviewSnap.exists()) {
      return {
        id: reviewSnap.id,
        ...reviewSnap.data(),
        createdAt: reviewSnap.data().createdAt.toDate(),
        updatedAt: reviewSnap.data().updatedAt.toDate(),
      } as Review;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting review:', error);
    throw error;
  }
}

// Get all reviews
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
        updatedAt: doc.data().updatedAt.toDate(),
      } as Review);
    });
    
    return reviews;
  } catch (error) {
    console.error('Error getting all reviews:', error);
    throw error;
  }
}

// Get top reviews
export async function getTopReviews(count: number = 3): Promise<Review[]> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      orderBy('overallRating', 'desc'),
      orderBy('helpful', 'desc'),
      limit(count)
    );
    const querySnapshot = await getDocs(q);
    
    const reviews: Review[] = [];
    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      } as Review);
    });
    
    return reviews;
  } catch (error) {
    console.error('Error getting top reviews:', error);
    throw error;
  }
}

// Get user reviews
export async function getUserReviews(userId: string): Promise<Review[]> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const reviews: Review[] = [];
    querySnapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate(),
      } as Review);
    });
    
    return reviews;
  } catch (error) {
    console.error('Error getting user reviews:', error);
    throw error;
  }
}

// Update review
export async function updateReview(reviewId: string, updates: Partial<Review>): Promise<void> {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };
    
    // Recalculate overall rating if ratings were updated
    if (updates.ratings) {
      updateData.overallRating = (
        updates.ratings.service +
        updates.ratings.food +
        updates.ratings.ambience +
        updates.ratings.value
      ) / 4;
    }
    
    await updateDoc(reviewRef, updateData);
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
}

// Delete review
export async function deleteReview(reviewId: string): Promise<void> {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    await deleteDoc(reviewRef);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}

// Mark review as helpful
export async function markReviewHelpful(reviewId: string): Promise<void> {
  try {
    const reviewRef = doc(db, 'reviews', reviewId);
    const reviewSnap = await getDoc(reviewRef);
    
    if (reviewSnap.exists()) {
      const currentHelpful = reviewSnap.data().helpful || 0;
      await updateDoc(reviewRef, {
        helpful: currentHelpful + 1,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    throw error;
  }
}

// Get average ratings
export async function getAverageRatings() {
  try {
    const reviews = await getAllReviews();
    
    if (reviews.length === 0) {
      return {
        overall: 0,
        service: 0,
        food: 0,
        ambience: 0,
        value: 0,
        count: 0,
      };
    }
    
    const totals = reviews.reduce(
      (acc, review) => ({
        overall: acc.overall + review.overallRating,
        service: acc.service + review.ratings.service,
        food: acc.food + review.ratings.food,
        ambience: acc.ambience + review.ratings.ambience,
        value: acc.value + review.ratings.value,
      }),
      { overall: 0, service: 0, food: 0, ambience: 0, value: 0 }
    );
    
    const count = reviews.length;
    
    return {
      overall: totals.overall / count,
      service: totals.service / count,
      food: totals.food / count,
      ambience: totals.ambience / count,
      value: totals.value / count,
      count,
    };
  } catch (error) {
    console.error('Error getting average ratings:', error);
    throw error;
  }
}
