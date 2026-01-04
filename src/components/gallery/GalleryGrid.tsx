'use client';

import { motion } from 'framer-motion';
import GalleryCard from './GalleryCard';
import type { GalleryImage } from '@/lib/types';
import { Images } from 'lucide-react';

interface GalleryGridProps {
  images: GalleryImage[];
  onImageClick: (image: GalleryImage) => void;
  isLoading?: boolean;
}

export default function GalleryGrid({ images, onImageClick, isLoading = false }: GalleryGridProps) {
  if (isLoading) {
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

  if (images.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <Images className='w-10 h-10 text-gray-400' />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No photos found</h3>
        <p className="text-gray-500">Try selecting a different category</p>
      </motion.div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-5">
      {images.map((image, index) => (
        <div key={image.id} className="mb-4 sm:mb-5 break-inside-avoid">
          <GalleryCard
            image={image}
            index={index}
            onClick={onImageClick}
          />
        </div>
      ))}
    </div>
  );
}
