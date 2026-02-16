import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// ⚠️ IMPORTANT: Replace these with your actual Firebase project credentials
// 
// To get your credentials:
// 1. Go to https://console.firebase.google.com/
// 2. Select your Smokeville project
// 3. Click Settings (⚙️) → Project Settings
// 4. Scroll to "Your apps" → Select your web app
// 5. Copy the firebaseConfig values and paste them below
//
// Example:
// apiKey: "AIzaSyC...",
// authDomain: "smokeville-xxxxx.firebaseapp.com",
// projectId: "smokeville-xxxxx",
// etc.
//
const firebaseConfig = {
  apiKey: "AIzaSyDJxsjgMOy8vyBu-DZsohMKlLtP6NyRFS8",
  authDomain: "smokeville-restaurant-af2fa.firebaseapp.com",
  projectId: "smokeville-restaurant-af2fa",
  storageBucket: "smokeville-restaurant-af2fa.firebasestorage.app",
  messagingSenderId: "890057713085",
  appId: "1:890057713085:web:a0bb922e58742fef6bded4",
  measurementId: "G-JCV4SCCB4Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
