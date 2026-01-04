'use client';

import { motion } from 'framer-motion';

interface GalleryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function GalleryFilter({ categories, activeCategory, onCategoryChange }: GalleryFilterProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100"
    >
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange('all')}
          className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
            activeCategory === 'all'
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
              : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          All Photos
        </motion.button>
        
        {categories.map((category, index) => (
          <motion.button
            key={category}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryChange(category)}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 ${
              activeCategory === category
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
