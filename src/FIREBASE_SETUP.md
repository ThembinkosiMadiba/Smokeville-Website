# Firebase Backend Setup Guide for SMOKEVILLE

This guide will help you set up Firebase as the backend for your SMOKEVILLE restaurant website.

## 📋 Prerequisites

- A Google account
- Node.js installed on your machine

## 🚀 Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `smokeville-restaurant` (or your preferred name)
4. Enable/Disable Google Analytics (optional)
5. Click **"Create project"**

## 🔧 Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (`</>`) to add a web app
2. Register app with nickname: `Smokeville Web App`
3. Check **"Also set up Firebase Hosting"** (optional)
4. Click **"Register app"**
5. Copy the Firebase configuration object - you'll need this!

## 🔑 Step 3: Configure Firebase in Your Project

1. Open `/config/firebase.ts` in your project
2. Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 🔐 Step 4: Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click **"Get started"**
3. Enable the following sign-in methods:
   - **Email/Password**: Click "Enable" toggle and save
   - **Google**: Click "Enable" toggle, add support email, and save

## 💾 Step 5: Set Up Firestore Database

1. In Firebase Console, go to **Build > Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll set up rules next)
4. Choose your database location (closest to your users)
5. Click **"Enable"**

## 🔒 Step 6: Configure Firestore Security Rules

1. In Firestore Database, go to **"Rules"** tab
2. Replace the rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders collection
    match /orders/{orderId} {
      // Users can create orders and read their own orders
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid);
      // Only admins can update/delete (you'll need to add admin logic)
      allow update, delete: if request.auth != null;
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      // Users can create bookings and read their own bookings
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
                     (resource.data.userId == request.auth.uid);
      // Users can update/cancel their own bookings
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      // Anyone can read reviews
      allow read: if true;
      // Only authenticated users can create reviews
      allow create: if request.auth != null;
      // Users can update/delete their own reviews
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **"Publish"**

## 📦 Step 7: Set Up Storage (Optional)

If you want to allow users to upload images (e.g., profile pictures, event photos):

1. In Firebase Console, go to **Build > Storage**
2. Click **"Get started"**
3. Start in production mode
4. Set up storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📚 Step 8: Create Firestore Collections

The collections will be created automatically when you first add data, but here's the structure:

### Users Collection
```
users/{userId}
  - uid: string
  - email: string
  - displayName: string
  - phoneNumber: string
  - createdAt: timestamp
  - orderHistory: array
  - reservations: array
```

### Orders Collection
```
orders/{orderId}
  - userId: string
  - userEmail: string
  - userName: string
  - items: array of CartItem
  - orderType: 'eat-in' | 'takeaway' | 'delivery'
  - deliveryAddress?: string
  - deliveryInstructions?: string
  - subtotal: number
  - deliveryFee: number
  - total: number
  - status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  - createdAt: timestamp
  - updatedAt: timestamp
  - phoneNumber?: string
  - tableNumber?: string
```

### Bookings Collection
```
bookings/{bookingId}
  - userId: string
  - userEmail: string
  - userName: string
  - phoneNumber: string
  - date: timestamp
  - time: string
  - guests: number
  - occasion?: string
  - specialRequests?: string
  - status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  - createdAt: timestamp
  - updatedAt: timestamp
```

### Reviews Collection
```
reviews/{reviewId}
  - userId: string
  - userName: string
  - userEmail: string
  - ratings: {
      service: number,
      food: number,
      ambience: number,
      value: number
    }
  - overallRating: number
  - comment: string
  - verified: boolean
  - helpful: number
  - createdAt: timestamp
  - updatedAt: timestamp
```

## 🧪 Step 9: Test Your Setup

1. Start your development server
2. Try signing up with a new account
3. Check Firebase Console > Authentication to see if the user was created
4. Check Firestore Database to see if the user document was created

## 🔧 Using Firebase Services in Your App

### Authentication
The `AuthContext` provides these methods:
- `signup(email, password, name, phone?)` - Create new account
- `login(email, password)` - Login with email/password
- `loginWithGoogle()` - Login with Google
- `logout()` - Sign out
- `currentUser` - Currently authenticated user
- `userData` - User data from Firestore

### Orders
Use functions from `/services/orderService.ts`:
- `createOrder(orderData)` - Create new order
- `getOrder(orderId)` - Get order by ID
- `getUserOrders(userId)` - Get all user orders
- `updateOrderStatus(orderId, status)` - Update order status
- `getAllOrders()` - Get all orders (admin)

### Bookings
Use functions from `/services/bookingService.ts`:
- `createBooking(bookingData)` - Create new booking
- `getBooking(bookingId)` - Get booking by ID
- `getUserBookings(userId)` - Get all user bookings
- `updateBooking(bookingId, updates)` - Update booking
- `cancelBooking(bookingId)` - Cancel booking
- `checkAvailability(date, time)` - Check table availability

### Reviews
Use functions from `/services/reviewService.ts`:
- `createReview(reviewData)` - Create new review
- `getAllReviews()` - Get all reviews
- `getTopReviews(count)` - Get top-rated reviews
- `getUserReviews(userId)` - Get user's reviews
- `markReviewHelpful(reviewId)` - Mark review as helpful
- `getAverageRatings()` - Get average ratings

## 📱 Next Steps

1. **Update OrderPage** to save orders to Firebase when checkout is clicked
2. **Update BookingsPage** to save bookings to Firebase
3. **Update Footer Review Section** to fetch and display real reviews from Firebase
4. **Add User Profile Page** to display order history and bookings
5. **Create Admin Dashboard** to manage orders, bookings, and reviews

## ⚠️ Important Security Notes

- Never commit your Firebase config with real API keys to public repositories
- Use environment variables for sensitive data in production
- Implement proper admin checks before allowing order/booking modifications
- Regularly review your Firestore security rules
- Enable Firebase App Check for additional security in production

## 🆘 Troubleshooting

### "Permission denied" errors
- Check your Firestore security rules
- Ensure user is authenticated
- Verify the user has permission to access the document

### Authentication errors
- Verify Firebase config is correct
- Check that authentication methods are enabled in Firebase Console
- Clear browser cache and try again

### Data not appearing
- Check Firestore Console to verify data exists
- Check browser console for errors
- Verify collection and document paths are correct

## 📞 Support

For Firebase-specific issues, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow - Firebase Tag](https://stackoverflow.com/questions/tagged/firebase)

---

**Ready to cook up something special! 🔥👨‍🍳**
