'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import type { CommitteeMember } from '@/lib/types';

interface MemberAvatarProps {
  member: CommitteeMember;
  size?: 'lg' | 'md' | 'sm';
  onSelect: (member: CommitteeMember) => void;
}

export default function MemberAvatar({ member, size = 'md', onSelect }: MemberAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    lg: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28',
    md: 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20',
    sm: 'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16',
  };

  const textSizes = {
    lg: 'text-lg sm:text-xl md:text-2xl',
    md: 'text-sm sm:text-base md:text-lg',
    sm: 'text-xs sm:text-sm md:text-base',
  };

  const ringColors: Record<string, string> = {
    president: 'ring-amber-500 ring-[3px] sm:ring-4',
    'vice-president': 'ring-primary-500 ring-2 sm:ring-[3px]',
    secretary: 'ring-primary-400 ring-2',
    treasurer: 'ring-emerald-500 ring-2',
    member: 'ring-primary-300 ring-2',
  };

  return (
    <motion.button
      onClick={() => onSelect(member)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      whileHover={{ scale: 1.1, y: -4 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${sizeClasses[size]} 
        ${ringColors[member.designation]}
        relative rounded-full overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200
        shadow-lg hover:shadow-2xl transition-all duration-300
        focus:outline-none cursor-pointer
      `}
      aria-label={`View ${member.name}'s profile`}
    >
      {/* Initials fallback */}
      <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 text-white font-bold ${textSizes[size]}`}>
        {member.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'M'}
      </div>

      {/* Profile image */}
      <Image
        src={member.photo || '/images/default.png'}
        alt={member.name || 'Member'}
        fill
        className="object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Hover overlay with "View Profile" text */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'bg-black/50' : 'bg-transparent'
        }`}
      >
        <span 
          className={`text-white text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm transition-all duration-300 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
        >
          View Profile
        </span>
      </div>
    </motion.button>
  );
}
