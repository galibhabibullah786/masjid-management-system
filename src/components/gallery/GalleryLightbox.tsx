'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { GalleryImage } from '@/lib/types';

interface GalleryLightboxProps {
  image: GalleryImage | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function GalleryLightbox({ 
  image, 
  onClose, 
  onPrev, 
  onNext, 
  hasNext, 
  hasPrev 
}: GalleryLightboxProps) {
  if (!image) return null;

  return (
    <AnimatePresence>
      {image && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Lightbox Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            onClick={onClose}
          >
            <div 
              className="relative max-w-5xl w-full max-h-[85vh] bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors group"
              >
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image Container */}
              <div className="relative aspect-video bg-gradient-to-br from-primary-100 via-primary-50 to-gray-100 flex items-center justify-center">
                {/* Placeholder SVG */}
                <div className="w-1/3 h-1/3 text-primary-300/50">
                  {image.category === 'Foundation' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect x="10" y="60" width="80" height="30" fill="currentColor" />
                      <rect x="20" y="50" width="60" height="15" fill="currentColor" opacity="0.7" />
                      <rect x="30" y="40" width="40" height="15" fill="currentColor" opacity="0.5" />
                    </svg>
                  )}
                  {image.category === 'Construction' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect x="30" y="40" width="40" height="50" fill="currentColor" />
                      <polygon points="50,15 20,45 80,45" fill="currentColor" opacity="0.8" />
                      <rect x="40" y="60" width="20" height="30" fill="white" opacity="0.5" />
                    </svg>
                  )}
                  {image.category === 'Events' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="30" cy="50" r="15" fill="currentColor" />
                      <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.8" />
                      <circle cx="70" cy="50" r="15" fill="currentColor" opacity="0.6" />
                    </svg>
                  )}
                  {image.category === 'Final Look' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect x="25" y="50" width="50" height="40" fill="currentColor" />
                      <ellipse cx="50" cy="50" rx="25" ry="15" fill="currentColor" opacity="0.9" />
                      <rect x="47" y="25" width="6" height="25" fill="currentColor" opacity="0.7" />
                    </svg>
                  )}
                  {image.category === 'Ceremony' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <rect x="20" y="30" width="60" height="50" rx="5" fill="currentColor" />
                    </svg>
                  )}
                </div>

                {/* Actual Image - Uncomment when real images are available */}
                {/* <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  priority
                /> */}
              </div>

              {/* Image Info */}
              <div className="p-5 sm:p-6 bg-white">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold mb-2">
                      {image.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{image.alt}</h3>
                    {image.date && (
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {image.date}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              {hasPrev && (
                <button
                  onClick={(e) => { e.stopPropagation(); onPrev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors group"
                >
                  <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {hasNext && (
                <button
                  onClick={(e) => { e.stopPropagation(); onNext(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors group"
                >
                  <svg className="w-6 h-6 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
