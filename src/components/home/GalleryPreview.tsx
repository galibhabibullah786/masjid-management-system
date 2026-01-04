'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { GalleryImage } from '@/lib/types';
import { Images } from 'lucide-react';

export default function GalleryPreview() {
  const [previewImages, setPreviewImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await api.getFeaturedImages();
        setPreviewImages(data.slice(0, 6));
      } catch (error) {
        console.error('Failed to fetch gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedImage) return;
    
    if (e.key === 'Escape') {
      setSelectedImage(null);
    } else if (e.key === 'ArrowLeft') {
      const newIndex = currentIndex === 0 ? previewImages.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedImage(previewImages[newIndex]);
    } else if (e.key === 'ArrowRight') {
      const newIndex = currentIndex === previewImages.length - 1 ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedImage(previewImages[newIndex]);
    }
  }, [selectedImage, currentIndex, previewImages]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  const openModal = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? previewImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(previewImages[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex === previewImages.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedImage(previewImages[newIndex]);
  };

  function LoadingGallery() {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`bg-gray-200 rounded-xl ${i === 0 ? 'col-span-2 row-span-2 h-96' : 'h-48'}`}></div>
          ))}
        </div>
      </div>
    );
  }
  
  function NoCapturesFound () {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Images className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No Captures found</h3>
      </motion.div>
    );
  }

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-primary-50 to-stone-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Moments Worth Sharing
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Capturing our journey from foundation to completion
          </p>
        </motion.div>

        {
          loading ? <LoadingGallery /> :
          (
            (previewImages.length === 0) ? <NoCapturesFound /> :
            <>
              {/* Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {previewImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    onClick={() => openModal(image, index)}
                    className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer group ${
                      index === 0 ? 'col-span-2 row-span-2' : ''
                    }`}
                    style={{
                      height: index === 0 ? '400px' : '192px',
                    }}
                  >
                    {/* Placeholder - Replace with actual images */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                      <div className="text-white text-center p-4">
                        <svg
                          className="w-12 h-12 mx-auto mb-2 opacity-80"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm font-medium">{image.category}</p>
                      </div>
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                      <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                        View Photo
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700">
                      {image.category}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )
        }

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-60 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-6 md:p-8"
              onClick={closeModal}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Previous Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-2 sm:left-4 md:left-8 z-50 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white top-1/2 -translate-y-1/2"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-2 sm:right-4 md:right-8 z-50 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white top-1/2 -translate-y-1/2"
                aria-label="Next image"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Modal Content */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-5xl max-h-[85vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] rounded-lg sm:rounded-xl overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800">
                  {/* Placeholder - Replace with actual image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      <svg
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 opacity-80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-lg sm:text-xl md:text-2xl font-medium">{selectedImage.category}</p>
                      <p className="text-sm sm:text-base text-white/70 mt-2">{selectedImage.alt}</p>
                    </div>
                  </div>
                </div>

                {/* Image Info */}
                <div className="mt-4 text-center">
                  <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold text-white">
                    {selectedImage.category}
                  </span>
                  <p className="text-white/60 text-xs sm:text-sm mt-2">
                    {currentIndex + 1} / {previewImages.length}
                  </p>
                </div>

                {/* Thumbnail Navigation */}
                <div className="mt-4 flex gap-2 overflow-x-auto overflow-y-hidden pt-4 pb-4 max-w-full px-4">
                  {previewImages.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(idx);
                        setSelectedImage(img);
                      }}
                      className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg overflow-hidden transition-all ${
                        idx === currentIndex
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-black/90 scale-110'
                          : 'opacity-50 hover:opacity-80'
                      }`}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-white/80"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Keyboard Hint */}
                <p className="hidden sm:block text-white/40 text-xs mt-4">
                  Use ← → arrows to navigate • ESC to close
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link
            href="/gallery"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-700 text-white rounded-full font-semibold hover:bg-primary-800 transition-all hover:shadow-lg hover:scale-105 group"
          >
            <span>View Complete Gallery</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
