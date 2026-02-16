import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Image as ImageIcon, Video } from 'lucide-react';
import { uploadGalleryItem } from '../services/galleryService';
import { toast } from 'sonner@2.0.3';

interface GalleryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  userId: string;
}

export function GalleryUploadModal({ isOpen, onClose, onUploadSuccess, userId }: GalleryUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Event');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = [
    'Event',
    'Food',
    'Drinks',
    'Interior',
    'Team',
    'Special Occasion',
    'Customer Moments'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const isImage = selectedFile.type.startsWith('image/');
    const isVideo = selectedFile.type.startsWith('video/');

    if (!isImage && !isVideo) {
      toast.error('Invalid file type. Only images and videos are allowed.');
      return;
    }

    // Validate file size
    const maxSize = isVideo ? 100 * 1024 * 1024 : 50 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error(`File too large. Maximum size is ${isVideo ? '100MB' : '50MB'}.`);
      return;
    }

    setFile(selectedFile);

    // Create preview
    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast.error('Please select a file and enter a title');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      await uploadGalleryItem(
        file,
        title.trim(),
        category,
        userId,
        (progress) => {
          setUploadProgress(Math.round(progress));
        }
      );

      toast.success('File uploaded successfully!');
      handleClose();
      onUploadSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    if (uploading) return;
    setFile(null);
    setPreview(null);
    setTitle('');
    setCategory('Event');
    setUploadProgress(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#1a1a1a] rounded-2xl max-w-2xl w-full p-6 border border-[#CBA135]/20"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-[#F5F5F5]">Upload to Gallery</h2>
            <button
              onClick={handleClose}
              disabled={uploading}
              className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center hover:bg-[#3a3a3a] transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-[#F5F5F5]" />
            </button>
          </div>

          {/* Upload Area */}
          {!file ? (
            <label className="block">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              <div className="border-2 border-dashed border-[#CBA135]/30 rounded-xl p-12 text-center cursor-pointer hover:border-[#CBA135]/60 transition-colors">
                <Upload className="w-12 h-12 text-[#CBA135] mx-auto mb-4" />
                <p className="text-[#F5F5F5] mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-[#F5F5F5]/60 text-sm">
                  Images (max 50MB) or Videos (max 100MB)
                </p>
              </div>
            </label>
          ) : (
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative rounded-xl overflow-hidden bg-[#0a0a0a] aspect-video">
                {file.type.startsWith('image/') ? (
                  <img
                    src={preview!}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video
                    src={preview!}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
                <div className="absolute top-2 left-2 bg-[#CBA135] text-[#121212] px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="w-4 h-4" />
                  ) : (
                    <Video className="w-4 h-4" />
                  )}
                  {file.type.startsWith('image/') ? 'Image' : 'Video'}
                </div>
                {!uploading && (
                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-[#F5F5F5] mb-2">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title..."
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#CBA135]/20 rounded-lg text-[#F5F5F5] placeholder:text-[#F5F5F5]/40 focus:outline-none focus:border-[#CBA135] transition-colors disabled:opacity-50"
                />
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-[#F5F5F5] mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#CBA135]/20 rounded-lg text-[#F5F5F5] focus:outline-none focus:border-[#CBA135] transition-colors disabled:opacity-50"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[#F5F5F5] text-sm">Uploading...</span>
                    <span className="text-[#CBA135] text-sm">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="h-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E]"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClose}
                  disabled={uploading}
                  className="flex-1 px-6 py-3 border-2 border-[#CBA135]/30 text-[#F5F5F5] rounded-lg hover:border-[#CBA135] transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !title.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#CBA135] to-[#B36A2E] text-[#121212] rounded-lg hover:from-[#B36A2E] hover:to-[#CBA135] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
