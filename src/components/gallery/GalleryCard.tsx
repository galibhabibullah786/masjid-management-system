'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { GalleryImage } from '@/lib/types';

interface GalleryCardProps {
  image: GalleryImage;
  index: number;
  onClick: (image: GalleryImage) => void;
}

export default function GalleryCard({ image, index, onClick }: GalleryCardProps) {
  // Generate height variation for masonry effect
  const heights = ['h-48', 'h-56', 'h-64', 'h-72', 'h-80'];
  const heightClass = heights[index % heights.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: (index % 8) * 0.08,
        type: 'spring',
        stiffness: 100
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative ${heightClass} rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl transition-shadow duration-300`}
      onClick={() => onClick(image)}
    >
      {/* Image Placeholder with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-primary-50 to-gray-100">
        {/* SVG Placeholder based on category */}
        <div className="absolute inset-0 flex items-center justify-center">
          {image.category === 'Foundation' && (
            <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 text-primary-300/50">
              <rect x="10" y="60" width="80" height="30" fill="currentColor" />
              <rect x="20" y="50" width="60" height="15" fill="currentColor" opacity="0.7" />
              <rect x="30" y="40" width="40" height="15" fill="currentColor" opacity="0.5" />
            </svg>
          )}
          {image.category === 'Construction' && (
            <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 text-primary-300/50">
              <rect x="30" y="40" width="40" height="50" fill="currentColor" />
              <polygon points="50,15 20,45 80,45" fill="currentColor" opacity="0.8" />
              <rect x="40" y="60" width="20" height="30" fill="white" opacity="0.5" />
            </svg>
          )}
          {image.category === 'Events' && (
            <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 text-primary-300/50">
              <circle cx="30" cy="50" r="15" fill="currentColor" />
              <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.8" />
              <circle cx="70" cy="50" r="15" fill="currentColor" opacity="0.6" />
            </svg>
          )}
          {image.category === 'Final Look' && (
            <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 text-primary-300/50">
              <rect x="25" y="50" width="50" height="40" fill="currentColor" />
              <ellipse cx="50" cy="50" rx="25" ry="15" fill="currentColor" opacity="0.9" />
              <rect x="47" y="25" width="6" height="25" fill="currentColor" opacity="0.7" />
              <circle cx="50" cy="22" r="5" fill="currentColor" opacity="0.8" />
            </svg>
          )}
          {image.category === 'Ceremony' && (
            <svg viewBox="0 0 100 100" className="w-1/2 h-1/2 text-primary-300/50">
              <rect x="20" y="30" width="60" height="50" rx="5" fill="currentColor" />
              <text x="50" y="60" textAnchor="middle" fill="white" fontSize="20">📜</text>
            </svg>
          )}
        </div>
      </div>

      {/* Actual Image - Uncomment when real images are available */}
      {/* <Image
        src={image.url}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
      /> */}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Category Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary-700 shadow-md"
      >
        {image.category}
      </motion.div>

      {/* Hover Content */}
      <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-white font-semibold text-sm sm:text-base mb-1">{image.alt}</p>
        {image.date && (
          <p className="text-white/70 text-xs flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {image.date}
          </p>
        )}
      </div>

      {/* View Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
