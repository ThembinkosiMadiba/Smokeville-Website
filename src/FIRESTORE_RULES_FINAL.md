# 🔥 FINAL FIRESTORE RULES - COPY THIS EXACTLY!

## ⚡ The Problem You're Seeing

```
AuthContext.tsx:124 Uncaught (in promise) FirebaseError: Missing or insufficient permissions.
```

This happens because the app tries to fetch your user profile data when you log in, but Firestore is blocking it.

---

## ✅ THE COMPLETE FIX

### **1. Go to Firebase Console**
- URL: https://console.firebase.google.com/
- Select your **Smokeville** project
- Click **"Firestore Database"** (left menu)
- Click **"Rules"** tab (top)

### **2. DELETE EVERYTHING and paste this:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========== USERS COLLECTION (CRITICAL!) ==========
    // Users can read and update their own profile
    // Admins can read all user profiles
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create, update: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
    
    // ========== ORDERS COLLECTION ==========
    match /orders/{orderId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow read, write: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
    
    // ========== BOOKINGS COLLECTION ==========
    match /bookings/{bookingId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow read, write: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
    
    // ========== REVIEWS COLLECTION ==========
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
    
    // ========== NEWSLETTER COLLECTION ==========
    match /newsletter/{subscriberId} {
      allow create: if true;
      allow read, delete: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
    
    // ========== MENU COLLECTION ==========
    match /menu/{menuId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
    
    // ========== GALLERY COLLECTION ==========
    match /gallery/{imageId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
  }
}
```

### **3. Click "Publish"**
- Click the green **"Publish"** button at the top right
- Wait for "Rules published successfully"

### **4. Refresh Your App**
- Go back to your Smokeville app
- Press **Ctrl+Shift+R** (hard refresh)
- Or just refresh normally

---

## 🎯 WHAT THIS FIXES

### **Before (Missing Users Rule):**
```
❌ Can't fetch user profile data
❌ AuthContext.tsx throws errors
❌ Login might work but profile data fails
❌ Admin dashboard can't load
```

### **After (With Users Rule):**
```
✅ Users can read their own profile
✅ Users can update their profile
✅ Admins can read all user profiles
✅ Login works completely
✅ Admin dashboard loads
✅ No more permission errors!
```

---

## 🔍 WHY THE ERROR HAPPENED

Your `AuthContext.tsx` has this code:

```typescript
async function fetchUserData(uid: string) {
  const userDocRef = doc(db, 'users', uid);
  const userDocSnap = await getDoc(userDocRef);  // ← This was blocked!
  
  if (userDocSnap.exists()) {
    setUserData(userDocSnap.data() as UserData);
  }
}
```

When you log in, it tries to read from `users/{uid}` but there was **no Firestore rule** for the `users` collection!

Now there is. ✅

---

## 📋 CHECKLIST - IS IT WORKING?

After updating rules and refreshing:

- [ ] No more `AuthContext.tsx` errors in console
- [ ] No more "Missing or insufficient permissions" errors
- [ ] Login works smoothly
- [ ] Debug panel (bottom-right) shows your UID
- [ ] Debug panel shows "IS ADMIN"
- [ ] Admin button visible in navigation
- [ ] Admin dashboard loads without errors
- [ ] Can see orders, bookings, etc.

**If all checked ✅, YOU'RE DONE! 🎉**

---

## 🆘 STILL SEEING ERRORS?

### **Error: "Missing or insufficient permissions"**

**Check:**
1. Did you click **"Publish"** in Firebase Console?
2. Did you copy the **entire** rules code above?
3. Did you include the **users** collection rule?
4. Did you **hard refresh** your app (Ctrl+Shift+R)?

**Still not working?**
1. Open Firebase Console → Firestore → Rules
2. Look at line 8-12 (users collection)
3. Make sure it's there!
4. Click Publish again
5. Wait 30 seconds
6. Hard refresh browser

### **Error from different collections**

If you see errors mentioning other collections (orders, bookings, etc.), make sure you copied **all** the rules above, not just the users part.

---

## 🔐 IMPORTANT: Replace Admin UID

The rules above use this admin UID:
```
'iHnO8vOgbWUqvglNJioU5KMH6IB3'
```

**Is this YOUR UID?**

Check the **Debug Panel** (bottom-right of your app):
- Look at "User ID (UID)"
- Does it match `iHnO8vOgbWUqvglNJioU5KMH6IB3`?

**If NOT:**
1. Copy YOUR actual UID from the debug panel
2. In the rules above, find all instances of `'iHnO8vOgbWUqvglNJioU5KMH6IB3'`
3. Replace with YOUR UID
4. Paste the updated rules into Firebase Console
5. Click Publish

**If YES:**
- You're good! Just use the rules as-is.

---

## 📊 Test It Now

1. **Log out** (if logged in)
2. **Log in** again
3. **Check console** (F12) - no errors?
4. **Check debug panel** - shows admin status?
5. **Click Admin button** in nav - works?
6. **Admin dashboard loads** - shows data?

**All yes? PERFECT! You're all set! 🚀**

---

## 💡 TIP: Bookmark This

If you ever need to reset your Firestore rules or add them to a new project, just copy the rules from this file.

---

**This is the FINAL version with ALL collections including users! 🎯**
