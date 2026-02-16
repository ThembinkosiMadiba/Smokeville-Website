# 🔒 Fix Firestore Permissions Error

## ⚠️ THE ERROR YOU'RE SEEING

```
FirebaseError: Missing or insufficient permissions
```

This means your **Firestore Security Rules** are blocking access to the database.

---

## ✅ QUICK FIX (2 Minutes)

### **Step 1: Open Firebase Console**

1. Go to: https://console.firebase.google.com/
2. Select your **Smokeville** project
3. Click **"Firestore Database"** (left sidebar)
4. Click the **"Rules"** tab (at the top)

### **Step 2: Copy the Rules**

You'll see a rules editor. **Delete everything** and paste this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection (IMPORTANT - needed for login!)
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create, update: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow read, write: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow read, write: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
    
    // Newsletter collection
    match /newsletter/{subscriberId} {
      allow create: if true;
      allow read, delete: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
    
    // Menu collection
    match /menu/{menuId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
    
    // Gallery collection
    match /gallery/{imageId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
  }
}
```

### **Step 3: Publish**

1. Click the **"Publish"** button (top right)
2. Wait for "Rules published successfully" message
3. Done! ✅

### **Step 4: Test**

1. Go back to your admin dashboard
2. **Refresh the page** (F5 or Ctrl+R)
3. The errors should be **gone**!
4. You should see the admin dashboard data loading

---

## 🎉 WHAT CHANGED?

**Before (Locked Down):**
```javascript
allow read, write: if false; // ❌ Nothing allowed
```

**After (Proper Security):**
```javascript
// ✅ Regular users can see their own data
// ✅ Admins (your UID) can see everything
// ✅ Public data (reviews, menu) is readable by anyone
```

---

## 🔐 WHAT THESE RULES DO

### **Orders**
- ✅ Users can create and view **their own** orders
- ✅ Admins can view and manage **all** orders

### **Bookings**
- ✅ Users can create and view **their own** bookings
- ✅ Admins can view and manage **all** bookings

### **Reviews**
- ✅ **Anyone** can read reviews (public)
- ✅ Logged-in users can create reviews
- ✅ Users can edit/delete **their own** reviews
- ✅ Admins can delete **any** review

### **Newsletter**
- ✅ **Anyone** can subscribe
- ✅ Only admins can see subscriber list

### **Menu**
- ✅ **Anyone** can read the menu (public)
- ✅ Only admins can edit menu items

### **Gallery**
- ✅ **Anyone** can view gallery (public)
- ✅ Only admins can upload/delete images

---

## 🚨 TROUBLESHOOTING

### "Rules still not working after publishing"

**Try:**
1. Wait 30 seconds (rules take a moment to propagate)
2. Hard refresh your app (Ctrl+Shift+R)
3. Check Firebase Console → Firestore → Rules tab
4. Make sure it shows "Last published: just now"

### "Wrong UID in rules"

If you logged in with a different account:

1. Look at the **Debug Panel** (bottom-right of your app)
2. Copy your **User ID (UID)**
3. In Firebase Console → Firestore → Rules
4. Find all instances of `'iHnO8vOgbWUqvglNJioU5KMH6IB3'`
5. Replace with **your actual UID**
6. Click **Publish**

### "Still getting permission errors"

**Check:**
1. ✅ Are you logged in? (Check debug panel)
2. ✅ Did you click "Publish" in Firestore Rules?
3. ✅ Did you refresh your app after publishing?
4. ✅ Is your UID correct in the rules?

---

## 📱 ALSO UPDATE STORAGE RULES (REQUIRED for Gallery Uploads!)

**IMPORTANT:** For the gallery upload feature to work, you MUST set up Storage rules!

1. In Firebase Console, click **"Storage"** (left sidebar)
2. If you haven't enabled Storage yet:
   - Click **"Get started"**
   - Choose **"Start in test mode"**
   - Select your region
   - Click **"Done"**
3. Click the **"Rules"** tab
4. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Gallery images and videos
    match /gallery/{type}/{filename} {
      // Anyone can read
      allow read: if true;
      // Only admins can upload
      allow write: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
    
    // Menu images (for future use)
    match /menu/{filename} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
  }
}
```

5. Click **Publish**
6. Wait for "Rules published successfully"

---

## 🔄 ADDING MORE ADMINS LATER

To add another admin user:

**Option 1: In Firestore Rules**
```javascript
// Instead of single UID check:
request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3'

// Use array check:
request.auth.uid in [
  'iHnO8vOgbWUqvglNJioU5KMH6IB3',
  'SECOND_ADMIN_UID_HERE',
  'THIRD_ADMIN_UID_HERE'
]
```

**Option 2: In Code (Easier)**
- Just update `/services/adminService.ts` to add more UIDs
- This controls the UI (who sees admin button)
- Combine with Option 1 for full security

---

## ✅ FINAL CHECKLIST

After updating Firestore Rules:

- [ ] Rules pasted into Firebase Console
- [ ] "Publish" button clicked
- [ ] "Rules published successfully" message appeared
- [ ] Admin dashboard refreshed (F5)
- [ ] No more permission errors in console
- [ ] Dashboard showing stats/data
- [ ] Orders tab loading
- [ ] Bookings tab loading
- [ ] Reviews tab loading
- [ ] Newsletter tab loading

**If all checked ✅, you're done! Admin dashboard is fully working!** 🎉

---

## 📚 MORE INFO

For detailed rules with comments, see: `/firestore.rules` in your project

For Firebase documentation: https://firebase.google.com/docs/firestore/security/get-started
