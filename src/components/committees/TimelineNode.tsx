'use client';

import { motion } from 'framer-motion';
import IslamicPattern from '../ui/IslamicPattern';

interface TimelineNodeProps {
  term: string;
  isCurrent: boolean;
  index: number;
}

export default function TimelineNode({ term, isCurrent, index }: TimelineNodeProps) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: index * 0.1 }}
        className="relative"
      >
        {isCurrent && (
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-primary-400"
            style={{ transform: 'scale(1.6)' }}
          />
        )}
        
        <div className={`relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full flex flex-col items-center justify-center shadow-xl transition-transform hover:scale-105 ${
          isCurrent 
            ? 'bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800 ring-4 ring-primary-300/50' 
            : 'bg-gradient-to-br from-white via-gray-50 to-gray-100 border-4 border-primary-400'
        }`}>
          <div className="absolute inset-3 rounded-full overflow-hidden">
            <IslamicPattern 
              variant="star" 
              color={isCurrent ? 'white' : 'primary'} 
              size={24} 
              opacity={0.15} 
            />
          </div>
          
          <span className={`text-sm sm:text-base lg:text-lg font-bold ${isCurrent ? 'text-white' : 'text-primary-700'}`}>
            {term.split('-')[0]}
          </span>
          <span className={`text-[10px] sm:text-xs ${isCurrent ? 'text-primary-200' : 'text-primary-500'}`}>
            {term.includes('Present') ? 'Present' : term.split('-')[1]}
          </span>
        </div>
        
        {isCurrent && (
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-[10px] sm:text-xs font-bold text-white rounded-full shadow-lg whitespace-nowrap"
          >
            ✨ CURRENT
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
