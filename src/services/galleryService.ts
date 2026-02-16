import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: string;
  type: 'image' | 'video';
  uploadedAt: Date;
  uploadedBy: string;
}

interface GalleryItemData {
  url: string;
  title: string;
  category: string;
  type: 'image' | 'video';
  uploadedAt: Timestamp;
  uploadedBy: string;
}

/**
 * Upload a file (image or video) to Firebase Storage and save metadata to Firestore
 */
export async function uploadGalleryItem(
  file: File,
  title: string,
  category: string,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      throw new Error('Invalid file type. Only images and videos are allowed.');
    }

    // Validate file size (max 50MB for images, 100MB for videos)
    const maxSize = isVideo ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size is ${isVideo ? '100MB' : '50MB'}.`);
    }

    // Create unique filename
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${timestamp}_${sanitizedFilename}`;
    const folder = isVideo ? 'videos' : 'images';
    const storageRef = ref(storage, `gallery/${folder}/${filename}`);

    // Upload file with progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            // Get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Save metadata to Firestore
            const galleryRef = collection(db, 'gallery');
            const docRef = await addDoc(galleryRef, {
              url: downloadURL,
              title,
              category,
              type: isVideo ? 'video' : 'image',
              uploadedAt: Timestamp.now(),
              uploadedBy: userId,
              storagePath: `gallery/${folder}/${filename}`
            });

            console.log('Gallery item uploaded successfully:', docRef.id);
            resolve(docRef.id);
          } catch (error) {
            console.error('Error saving metadata:', error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error uploading gallery item:', error);
    throw error;
  }
}

/**
 * Get all gallery items from Firestore
 */
export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  try {
    const galleryRef = collection(db, 'gallery');
    const q = query(galleryRef, orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const items: GalleryItem[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as GalleryItemData;
      items.push({
        id: doc.id,
        url: data.url,
        title: data.title,
        category: data.category,
        type: data.type,
        uploadedAt: data.uploadedAt.toDate(),
        uploadedBy: data.uploadedBy
      });
    });

    return items;
  } catch (error) {
    console.error('Error getting gallery items:', error);
    throw error;
  }
}

/**
 * Delete a gallery item (both from Storage and Firestore)
 */
export async function deleteGalleryItem(itemId: string, storagePath?: string): Promise<void> {
  try {
    // Delete from Firestore
    await deleteDoc(doc(db, 'gallery', itemId));

    // Delete from Storage if path is provided
    if (storagePath) {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    }

    console.log('Gallery item deleted successfully');
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    throw error;
  }
}

/**
 * Get gallery items by category
 */
export async function getGalleryItemsByCategory(category: string): Promise<GalleryItem[]> {
  try {
    const allItems = await getAllGalleryItems();
    return allItems.filter(item => item.category === category);
  } catch (error) {
    console.error('Error getting gallery items by category:', error);
    throw error;
  }
}
