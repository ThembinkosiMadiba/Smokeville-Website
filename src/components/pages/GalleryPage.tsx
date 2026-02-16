import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Upload, Trash2, Video } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { GalleryUploadModal } from '../GalleryUploadModal';
import { getAllGalleryItems, deleteGalleryItem, GalleryItem } from '../../services/galleryService';
import { isAdmin } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

export function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { currentUser } = useAuth();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (currentUser) {
        const adminStatus = await isAdmin(currentUser.uid);
        setIsAdminUser(adminStatus);
      } else {
        setIsAdminUser(false);
      }
    };
    checkAdmin();
  }, [currentUser]);

  // Load gallery items
  const loadGallery = async () => {
    try {
      setLoading(true);
      const items = await getAllGalleryItems();
      setGalleryImages(items);
    } catch (error) {
      console.error('Error loading gallery:', error);
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleDelete = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setDeletingId(itemId);
      await deleteGalleryItem(itemId);
      toast.success('Item deleted successfully');
      await loadGallery();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 relative">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="smokeville-logo text-4xl md:text-6xl mb-4 text-[#CBA135]">
            SMOKEVILLE
          </h1>
          <p className="text-xl text-[#F5F5F5]/80 mb-2">Gallery</p>
          <p className="text-[#F5F5F5]/60 max-w-2xl mx-auto mb-6">
            Experience the ambiance, passion, and artistry that goes into every dish at SMOKEVILLE
          </p>

          {/* Admin Upload Button */}
          {isAdminUser && (
            <div>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setIsUploadModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-[#CBA135] to-[#B36A2E] text-[#121212] rounded-lg hover:from-[#B36A2E] hover:to-[#CBA135] transition-all hover:shadow-[0_0_30px_rgba(203,161,53,0.3)] inline-flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Upload to Gallery
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-[#1a1a1a] animate-pulse"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4">
          {galleryImages.length === 0 ? (
            <div className="text-center py-20">
              <ImageIcon className="w-16 h-16 text-[#CBA135]/30 mx-auto mb-4" />
              <p className="text-[#F5F5F5]/60 text-lg">
                No gallery items yet.
                {isAdminUser && ' Click "Upload to Gallery" to add your first item!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative group cursor-pointer rounded-xl overflow-hidden aspect-square"
                  onClick={() => setSelectedImage(index)}
                >
                  {image.type === 'video' ? (
                    <video
                      src={image.url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <ImageWithFallback
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-[#CBA135] text-sm mb-1">{image.category}</div>
                      <div className="text-[#F5F5F5]">{image.title}</div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#CBA135]/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.type === 'video' ? (
                      <Video className="w-5 h-5 text-[#CBA135]" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-[#CBA135]" />
                    )}
                  </div>
                  
                  {/* Admin Delete Button */}
                  {isAdminUser && (
                    <button
                      onClick={(e) => handleDelete(image.id, e)}
                      disabled={deletingId === image.id}
                      className="absolute top-4 left-4 w-10 h-10 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && galleryImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-[#CBA135] flex items-center justify-center hover:bg-[#B36A2E] transition-colors z-10"
            >
              <X className="w-6 h-6 text-[#121212]" />
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#CBA135] flex items-center justify-center hover:bg-[#B36A2E] transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6 text-[#121212]" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#CBA135] flex items-center justify-center hover:bg-[#B36A2E] transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6 text-[#121212]" />
            </button>

            {/* Image/Video */}
            <motion.div
              key={selectedImage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryImages[selectedImage].type === 'video' ? (
                <video
                  src={galleryImages[selectedImage].url}
                  controls
                  autoPlay
                  loop
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <ImageWithFallback
                  src={galleryImages[selectedImage].url}
                  alt={galleryImages[selectedImage].title}
                  className="w-full h-auto rounded-lg"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#121212] to-transparent p-6 rounded-b-lg">
                <div className="text-[#CBA135] text-sm mb-1">
                  {galleryImages[selectedImage].category}
                </div>
                <div className="text-[#F5F5F5] text-xl">
                  {galleryImages[selectedImage].title}
                </div>
                <div className="text-[#F5F5F5]/60 text-sm mt-2">
                  {selectedImage + 1} / {galleryImages.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      {isAdminUser && currentUser && (
        <GalleryUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={() => {
            loadGallery();
            setIsUploadModalOpen(false);
          }}
          userId={currentUser.uid}
        />
      )}

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-4 mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] rounded-2xl p-12 text-center border border-[#CBA135]/20"
        >
          <h2 className="text-3xl text-[#F5F5F5] mb-4">
            Experience SMOKEVILLE
          </h2>
          <p className="text-[#F5F5F5]/60 mb-6 max-w-2xl mx-auto">
            Come visit us and create your own unforgettable moments at SMOKEVILLE. 
            From perfectly grilled meats to artisan pizzas and craft cocktails.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '#bookings'}
              className="px-8 py-3 bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212] rounded-lg transition-all hover:shadow-[0_0_30px_rgba(203,161,53,0.3)]"
            >
              Book a Table
            </button>
            <button
              onClick={() => window.location.href = '#menu'}
              className="px-8 py-3 border-2 border-[#CBA135] text-[#CBA135] rounded-lg hover:bg-[#CBA135] hover:text-[#121212] transition-all"
            >
              View Menu
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
