'use client';

import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import IslamicPattern from '../ui/IslamicPattern';
import type { CommitteeMember } from '@/lib/types';

interface ProfileModalProps {
  member: CommitteeMember;
  onClose: () => void;
}

export default function ProfileModal({ member, onClose }: ProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }, 100);
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const designationColors: Record<string, string> = {
    president: 'bg-gradient-to-r from-amber-500 to-amber-600',
    'vice-president': 'bg-gradient-to-r from-primary-600 to-primary-700',
    secretary: 'bg-gradient-to-r from-primary-500 to-primary-600',
    treasurer: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
    member: 'bg-gradient-to-r from-primary-400 to-primary-500',
  };

  return (
    <motion.div
      ref={modalRef}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className="fixed z-[60] bg-white rounded-2xl shadow-2xl overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] sm:w-80 max-h-[calc(100vh-32px)] overflow-y-auto"
    >
      <div className="relative h-24 sm:h-28 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800">
        <IslamicPattern variant="simple" size={60} opacity={0.2} />
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors z-10"
          aria-label="Close profile"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 relative">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
              {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            {member.photo && (
              <Image
                src={member.photo}
                alt={member.name}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="pt-14 pb-6 px-5 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-md ${designationColors[member.designation]}`}>
          {member.designationLabel}
        </span>
        
        {member.bio && (
          <p className="mt-4 text-sm text-gray-600 leading-relaxed">{member.bio}</p>
        )}

        {(member.phone || member.email) && (
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary-700 transition-colors py-1.5 rounded-lg hover:bg-primary-50"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{member.phone}</span>
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-primary-700 transition-colors py-1.5 rounded-lg hover:bg-primary-50"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{member.email}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
