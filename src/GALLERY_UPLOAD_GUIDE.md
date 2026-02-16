# 📸 Gallery Upload Feature - Admin Guide

## 🎉 What's New

Your gallery page now has full admin functionality! Admins can:
- ✅ Upload images (up to 50MB)
- ✅ Upload videos (up to 100MB)
- ✅ Add titles and categories
- ✅ Delete gallery items
- ✅ See real-time upload progress
- ✅ All uploads stored securely in Firebase

## 🚀 Quick Setup Checklist

Before you can upload to the gallery, complete these steps:

### **1. Firestore Rules (Already Done)**
- [x] Updated Firestore rules with `gallery` collection
- [x] Rules allow admins to read/write gallery items

### **2. Firebase Storage Setup (NEW - DO THIS NOW!)**

#### **A. Enable Firebase Storage**
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your Smokeville project
3. Click **"Storage"** in the left sidebar
4. If not enabled:
   - Click **"Get started"**
   - Choose **"Start in test mode"**
   - Select your region (same as Firestore)
   - Click **"Done"**

#### **B. Update Storage Rules**
1. In Storage, click the **"Rules"** tab
2. You'll see a text editor with storage rules
3. **Delete everything** and paste this:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Gallery images and videos - uploaded by admins
    match /gallery/{type}/{filename} {
      // Anyone can view gallery images/videos (public)
      allow read: if true;
      
      // Only admins can upload/delete
      allow write: if request.auth != null && 
                      request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
    
    // Menu images (for future use)
    match /menu/{filename} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.uid == 'iHnO8vOgbWUqvglNJioU5KMH6IB3';
    }
  }
}
```

4. Replace `'iHnO8vOgbWUqvglNJioU5KMH6IB3'` with YOUR admin UID (if different)
5. Click **"Publish"**
6. Wait for "Rules published successfully"

---

## 📖 How to Use the Gallery Upload Feature

### **Step 1: Access the Gallery Page**
1. Log in as admin
2. Navigate to **Gallery** page
3. You should see an **"Upload to Gallery"** button at the top

### **Step 2: Click Upload**
1. Click the **"Upload to Gallery"** button
2. A modal will pop up

### **Step 3: Select File**
1. Click the upload area or drag & drop
2. Choose an image or video:
   - **Images:** JPG, PNG, GIF, WebP (max 50MB)
   - **Videos:** MP4, WebM, MOV (max 100MB)
3. You'll see a preview immediately

### **Step 4: Add Details**
1. **Title** (required): Enter a descriptive title
   - Example: "Khathanga's Annual Birthday Celebration"
   - Example: "Grilled Ribeye Steak Special"
2. **Category** (select from dropdown):
   - Event
   - Food
   - Drinks
   - Interior
   - Team
   - Special Occasion
   - Customer Moments

### **Step 5: Upload**
1. Click the **"Upload"** button
2. Watch the progress bar (0% → 100%)
3. Wait for "File uploaded successfully!" message
4. The modal closes automatically
5. Your new item appears in the gallery!

---

## 🗑️ How to Delete Gallery Items

1. Navigate to **Gallery** page (as admin)
2. Hover over any image/video
3. You'll see a **red trash icon** in the top-left corner
4. Click the trash icon
5. Confirm deletion
6. Item is removed from both Storage and database

---

## 🎨 What Visitors See

**Regular Users (Non-Admins):**
- ✅ View all gallery images/videos
- ✅ Click to open lightbox
- ✅ Navigate between items
- ❌ Cannot upload
- ❌ Cannot delete
- ❌ Don't see upload/delete buttons

**Admins:**
- ✅ Everything above, plus:
- ✅ "Upload to Gallery" button
- ✅ Delete buttons on each item
- ✅ Full upload interface

---

## 📊 Gallery Features

### **For Images:**
- Formats: JPG, PNG, GIF, WebP, AVIF
- Max size: 50MB
- Automatic thumbnail generation
- Lazy loading
- Optimized delivery via Firebase CDN

### **For Videos:**
- Formats: MP4, WebM, MOV
- Max size: 100MB
- Autoplay in lightbox
- Video controls
- Muted preview in grid

### **Organization:**
- Sorted by upload date (newest first)
- Categorized for easy filtering
- Responsive grid layout
- Smooth animations

---

## 🔍 Technical Details

### **Where Files Are Stored:**
```
Firebase Storage:
├── gallery/
│   ├── images/
│   │   ├── 1234567890_event.jpg
│   │   ├── 1234567891_food.png
│   │   └── ...
│   └── videos/
│       ├── 1234567892_celebration.mp4
│       └── ...
```

### **Metadata in Firestore:**
```javascript
Collection: gallery
Document: {
  id: "auto-generated-id",
  url: "https://firebasestorage.googleapis.com/...",
  title: "Khathanga's Birthday",
  category: "Event",
  type: "image" | "video",
  uploadedAt: Timestamp,
  uploadedBy: "admin-uid",
  storagePath: "gallery/images/filename.jpg"
}
```

---

## ⚠️ Troubleshooting

### **"Upload to Gallery" button not visible**
**Cause:** You're not logged in as admin or admin check failed

**Fix:**
1. Check Debug Panel (bottom-right): Are you admin?
2. Log out and log back in
3. Verify your UID is in `/services/adminService.ts`

---

### **Upload fails with "Permission denied"**
**Cause:** Storage rules not set up correctly

**Fix:**
1. Go to Firebase Console → Storage → Rules
2. Copy the Storage rules from above
3. Make sure your UID matches
4. Click Publish
5. Wait 30 seconds and try again

---

### **"Failed to upload file" error**
**Possible causes:**
- File too large
- Invalid file type
- No internet connection
- Firebase config wrong

**Fix:**
1. Check file size (images < 50MB, videos < 100MB)
2. Check file type (images or videos only)
3. Check internet connection
4. Verify Firebase config in `/config/firebase.ts`

---

### **Upload stuck at 0%**
**Cause:** Firebase Storage not enabled

**Fix:**
1. Go to Firebase Console → Storage
2. Click "Get started"
3. Enable Storage
4. Set up rules (see above)
5. Try uploading again

---

### **Images/videos not loading**
**Cause:** Storage rules blocking public read access

**Fix:**
1. In Storage rules, make sure you have:
   ```javascript
   allow read: if true;
   ```
2. This allows anyone to view uploaded files
3. Publish the rules
4. Refresh your app

---

### **Delete button not working**
**Cause:** Missing storage path or permissions

**Fix:**
1. Check Storage rules allow admin to delete
2. Make sure you have this in Storage rules:
   ```javascript
   allow write: if request.auth != null && 
                   request.auth.uid == 'YOUR_ADMIN_UID';
   ```
3. `write` includes both upload and delete

---

## 🎯 Best Practices

### **Image Guidelines:**
- Use high-quality images (1920x1080 or higher)
- Keep file sizes reasonable (compress before upload)
- Use descriptive titles
- Choose appropriate categories
- Avoid copyrighted content

### **Video Guidelines:**
- Keep videos short (under 2 minutes recommended)
- Use web-optimized formats (MP4 works best)
- Compress videos before upload
- Test on mobile devices
- Add captions in title if needed

### **Organization:**
- Use consistent naming conventions
- Update categories as needed
- Delete outdated content
- Review gallery regularly
- Keep most recent content at top

---

## 📱 Mobile Support

The gallery upload feature works on:
- ✅ Desktop browsers
- ✅ Mobile browsers (iOS/Android)
- ✅ Tablets
- ✅ Touch devices

Mobile users can:
- Take photos with camera and upload directly
- Record videos and upload
- Select from camera roll
- Full upload functionality

---

## 🔐 Security

### **Who Can Upload:**
- Only authenticated admin users
- UIDs must be in admin list
- Checked both client-side and server-side

### **File Validation:**
- Type checking (images/videos only)
- Size limits enforced
- Sanitized filenames
- No executable files allowed

### **Storage Security:**
- Files stored in Firebase Cloud Storage
- Served over HTTPS
- CDN-backed for fast delivery
- Automatic backup

---

## 📈 What's Next?

Future improvements you could add:
1. **Bulk Upload** - Upload multiple files at once
2. **Image Editing** - Crop, rotate, filters before upload
3. **Categories Filter** - Filter gallery by category
4. **Search** - Search gallery by title
5. **Sorting** - Sort by date, title, category
6. **Tags** - Add custom tags to items
7. **Comments** - Allow users to comment on items
8. **Likes** - Let users like gallery items

---

## ✅ Final Checklist

Before using gallery uploads:

- [ ] Firebase Storage enabled
- [ ] Storage rules published
- [ ] Firestore rules include gallery collection
- [ ] Logged in as admin
- [ ] "Upload to Gallery" button visible
- [ ] Can select and preview files
- [ ] Upload completes successfully
- [ ] New items appear in gallery
- [ ] Delete function works
- [ ] Regular users can view but not edit

---

## 🆘 Still Need Help?

If you're stuck:
1. Check browser console (F12) for errors
2. Check Firebase Console for quota limits
3. Verify all rules are published
4. Test with smaller file first
5. Try different browser
6. Clear cache and reload

**Tell me:**
- What step are you on?
- What error message do you see?
- Does the Debug Panel show you as admin?
- Can you see the upload button?

---

**Your gallery is now a fully-featured media management system! 🎉**

Upload your best moments, showcase your food, and let your customers see the SMOKEVILLE experience!
