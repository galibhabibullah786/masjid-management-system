'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IslamicPattern from '@/components/ui/IslamicPattern';
import GalleryFilter from '@/components/gallery/GalleryFilter';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import GalleryLightbox from '@/components/gallery/GalleryLightbox';
import { api } from '@/lib/api';
import type { GalleryImage } from '@/lib/types';
import BackToTopButton from '@/components/BackToTopButton';

const IMAGES_PER_PAGE = 8;

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [displayCount, setDisplayCount] = useState(IMAGES_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [allImages, setAllImages] = useState<GalleryImage[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch gallery images
  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const [imagesRes, catsRes] = await Promise.all([
          api.getGalleryImages({ limit: 100 }),
          api.getGalleryCategories(),
        ]);
        setAllImages(imagesRes.data);
        setCategories(catsRes.map((c) => c.category));
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Filter images based on category
  const filteredImages = useMemo(() => {
    if (activeCategory === 'all') {
      return allImages;
    }
    return allImages.filter((img) => img.category === activeCategory);
  }, [activeCategory, allImages]);

  // Get displayed images with pagination
  const displayedImages = useMemo(() => {
    return filteredImages.slice(0, displayCount);
  }, [filteredImages, displayCount]);

  // Handle category change
  const handleCategoryChange = useCallback((category: string) => {
    setIsLoading(true);
    setActiveCategory(category);
    setDisplayCount(IMAGES_PER_PAGE);
    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 400);
  }, []);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayCount((prev) => prev + IMAGES_PER_PAGE);
      setIsLoading(false);
    }, 500);
  }, []);

  // Handle image click for lightbox
  const handleImageClick = useCallback((image: GalleryImage) => {
    setSelectedImage(image);
  }, []);

  // Lightbox navigation
  const currentImageIndex = selectedImage 
    ? displayedImages.findIndex((img) => img.id === selectedImage.id) 
    : -1;

  const handlePrevImage = useCallback(() => {
    if (currentImageIndex > 0) {
      setSelectedImage(displayedImages[currentImageIndex - 1]);
    }
  }, [currentImageIndex, displayedImages]);

  const handleNextImage = useCallback(() => {
    if (currentImageIndex < displayedImages.length - 1) {
      setSelectedImage(displayedImages[currentImageIndex + 1]);
    }
  }, [currentImageIndex, displayedImages]);

  const hasMore = displayCount < filteredImages.length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-stone-950 text-white pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden">
        <IslamicPattern fixed variant="complex" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Our <span className="text-primary-300">Gallery</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Visualizing every step of our collective effort. From foundation to completion, 
              witness the transformation of our community project.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <GalleryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <GalleryGrid
          images={displayedImages}
          onImageClick={handleImageClick}
          isLoading={isLoading}
        />

        {/* Load More Section */}
        {hasMore && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLoadMore}
              className="group relative px-8 sm:px-10 py-3 sm:py-4 bg-white rounded-full font-semibold text-primary-700 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary-200 hover:border-primary-400"
            >
              <span className="relative z-10 flex items-center gap-2">
                Load More Photos
                <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </motion.button>
            
            <p className="mt-4 text-sm text-gray-500">
              Showing <span className="font-semibold text-primary-600">{displayedImages.length}</span> of{' '}
              <span className="font-semibold">{filteredImages.length}</span> photos
            </p>
          </motion.div>
        )}

        {/* Loading indicator for load more */}
        <AnimatePresence>
          {isLoading && displayCount > IMAGES_PER_PAGE && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-8"
            >
              <div className="flex items-center gap-3 text-primary-600">
                <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="font-medium">Loading more photos...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <GalleryLightbox
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
        hasPrev={currentImageIndex > 0}
        hasNext={currentImageIndex < displayedImages.length - 1}
      />

      <BackToTopButton />
    </main>
  );
}
