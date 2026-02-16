# 🛡️ Admin Access Guide - SMOKEVILLE

## ✅ Your Admin Setup is Complete!

**Your Admin User ID**: `iHnO8vOgbWUqvglNJioU5KMH6IB3`

This has been added to `/services/adminService.ts` - you are now an admin! 🎉

---

## 🚀 How to Access the Admin Dashboard

### **Desktop Access**
1. Make sure you're **logged in** to your account
2. Look at the **top navigation bar**
3. You'll see a **🛡️ Shield icon** with "Admin" text next to your Profile icon
4. Click it to access the admin dashboard

### **Mobile Access**
1. Make sure you're **logged in** to your account
2. Tap the **☰ Menu icon** (hamburger menu)
3. Scroll down - you'll see **"Admin Dashboard"** option
4. Tap it to access the admin dashboard

---

## 🔍 If You Don't See the Admin Button

### **Troubleshooting Steps:**

1. **Verify You're Logged In**
   - Check if you see "Profile" button/link
   - If not, log in first with your account

2. **Confirm Your UID is Correct**
   - Go to Firebase Console → Authentication
   - Find your account
   - Verify the UID matches: `iHnO8vOgbWUqvglNJioU5KMH6IB3`

3. **Restart Dev Server**
   - Stop your development server (Ctrl+C)
   - Start it again: `npm run dev` (or your start command)
   - Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)

4. **Clear Browser Cache**
   - Press F12 to open DevTools
   - Right-click the refresh button → "Empty Cache and Hard Reload"

5. **Check Console for Errors**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for any Firebase or authentication errors
   - If you see Firebase connection errors, you need to add Firebase credentials to `/config/firebase.ts`

---

## 📊 What You Can Do in Admin Dashboard

### **Dashboard Tab**
- View real-time statistics
- Total orders and revenue
- Active bookings count
- User registrations
- Newsletter subscribers

### **Orders Tab**
- View all customer orders
- Update order status:
  - Pending → Confirmed → Preparing → Ready → Completed
  - Or mark as Cancelled
- Delete orders (with confirmation)
- See order details: items, prices, delivery info, customer details

### **Bookings Tab**
- View all table reservations
- Update booking status:
  - Pending → Confirmed → Completed
  - Or mark as Cancelled
- Delete bookings (with confirmation)
- See reservation details: date, time, guests, special requests

### **Reviews Tab**
- View all customer reviews
- See detailed ratings (service, food, ambience, value)
- Delete inappropriate reviews (with confirmation)
- Monitor verified reviews

### **Newsletter Tab**
- View all email subscribers
- See subscription dates
- Export subscriber list (for email campaigns)

---

## 🔒 Security Features

- ✅ Only users with UIDs in `ADMIN_USER_IDS` can access admin dashboard
- ✅ Regular users see "Access Denied" page
- ✅ Admin button only visible to admin users
- ✅ All delete actions require confirmation
- ✅ All admin actions are tracked in Firebase

---

## 👥 Adding More Admins

To add more admin users:

1. Have them sign up on the website
2. Go to Firebase Console → Authentication
3. Copy their User ID (UID)
4. Open `/services/adminService.ts`
5. Add their UID to the array:

```typescript
const ADMIN_USER_IDS = [
  'iHnO8vOgbWUqvglNJioU5KMH6IB3', // Your admin ID
  'ANOTHER_USER_UID_HERE',        // ← Add new admin UIDs here
  'YET_ANOTHER_UID',
];
```

6. Save the file
7. Restart dev server

---

## ⚠️ Important Notes

1. **Firebase Must Be Connected**
   - Admin dashboard requires Firebase to be configured
   - Update `/config/firebase.ts` with your actual Firebase credentials
   - See `FIREBASE_SETUP.md` for full setup instructions

2. **Admin UIDs Are Hardcoded**
   - Admin status is determined by the `ADMIN_USER_IDS` array
   - This is intentional for security
   - Don't expose this list publicly

3. **Production Security**
   - For production, consider moving admin UIDs to environment variables
   - Implement additional security layers
   - Use Firebase security rules to double-check admin permissions

---

## 🧪 Test Your Admin Access

### Quick Test:
1. ✅ Log in to your account
2. ✅ Look for Admin button (Shield icon) in nav
3. ✅ Click Admin button
4. ✅ Should see "ADMIN DASHBOARD" page
5. ✅ Try switching between tabs: Dashboard, Orders, Bookings, Reviews, Newsletter

### If Dashboard Shows "0" for Everything:
- This is normal! You haven't created any orders/bookings yet
- Create a test order:
  1. Go to Menu page
  2. Add items to cart
  3. Go to Order page
  4. Fill in details and place order
  5. Return to Admin dashboard - you'll see it!

---

## 📞 Need Help?

If you're still not seeing the admin button:
1. Check that Firebase is properly connected
2. Verify you're logged in with the correct account
3. Check browser console for errors
4. Try a different browser
5. Make sure dev server has been restarted after changes

**Your Admin Dashboard is Ready!** 🎉

