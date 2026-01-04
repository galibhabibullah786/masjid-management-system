'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { HandCoins } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import type { Committee, CommitteeMember } from '@/lib/types';

interface MemberAvatarProps {
  member: CommitteeMember;
  size: 'lg' | 'md' | 'sm';
  onSelect: (member: CommitteeMember, element: HTMLButtonElement) => void;
}

function MemberAvatar({ member, size, onSelect }: MemberAvatarProps) {
  const ref = useRef<HTMLButtonElement>(null);
  
  const sizeClasses = {
    lg: 'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36',
    md: 'w-[72px] h-[72px] sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28',
    sm: 'w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-22 lg:h-22',
  };

  const ringColors = {
    president: 'ring-primary-600 ring-[3px] sm:ring-4 md:ring-[5px]',
    'vice-president': 'ring-primary-500 ring-[3px] sm:ring-4',
    secretary: 'ring-primary-400 ring-2 sm:ring-[3px]',
    treasurer: 'ring-primary-400 ring-2 sm:ring-[3px]',
    member: 'ring-primary-300 ring-2',
  };

  const textSizes = {
    lg: 'text-xl sm:text-2xl md:text-3xl',
    md: 'text-lg sm:text-xl md:text-2xl',
    sm: 'text-base sm:text-lg md:text-xl',
  };

  const handleClick = () => {
    if (ref.current) {
      onSelect(member, ref.current);
    }
  };

  return (
    <motion.button
      ref={ref}
      onClick={handleClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${sizeClasses[size]} 
        ${ringColors[member.designation]}
        relative rounded-full overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200
        shadow-lg hover:shadow-xl transition-all duration-300
        focus:outline-none focus:ring-offset-2 focus:ring-offset-white
        cursor-pointer group
      `}
      aria-label={`View ${member.name}'s profile`}
    >
      {/* Placeholder with initials */}
      <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800 text-white font-bold ${textSizes[size]}`}>
        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
      
      {/* Actual image */}
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
      
      {/* Hover overlay with "View Profile" text */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 group-active:bg-black/40 transition-colors duration-300 flex items-center justify-center">
        <span className="text-white text-[10px] sm:text-xs font-medium opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 px-2 py-1 rounded-full bg-black/20 backdrop-blur-sm">
          View Profile
        </span>
      </div>
    </motion.button>
  );
}

interface ProfileCardProps {
  member: CommitteeMember;
  onClose: () => void;
}

function ProfileCard({ member, onClose }: ProfileCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Close handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Delay adding listener to prevent immediate close on touch
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

  const designationColors = {
    president: 'bg-primary-700',
    'vice-president': 'bg-primary-600',
    secretary: 'bg-primary-500',
    treasurer: 'bg-primary-500',
    member: 'bg-primary-400',
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      className="fixed z-[60] bg-white rounded-2xl shadow-2xl overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] sm:w-80 max-h-[calc(100vh-32px)] overflow-y-auto"
    >
      {/* Header with gradient */}
      <div className="relative h-20 sm:h-24 bg-gradient-to-r from-primary-600 to-primary-800">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors z-10"
          aria-label="Close profile"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="1" fill="white" />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Profile photo */}
        <div className="absolute -bottom-10 sm:-bottom-12 left-1/2 -translate-x-1/2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 relative">
            <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
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

      {/* Content */}
      <div className="pt-12 sm:pt-14 pb-5 sm:pb-6 px-4 sm:px-6 text-center">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${designationColors[member.designation]}`}>
          {member.designationLabel}
        </span>
        
        {member.bio && (
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed">{member.bio}</p>
        )}

        {/* Contact Info */}
        {(member.phone || member.email) && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 space-y-2">
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-primary-700 transition-colors py-1"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="truncate">{member.phone}</span>
              </a>
            )}
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-primary-700 transition-colors py-1"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{member.email}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function CurrentCommitteeSection() {
  const [selectedMember, setSelectedMember] = useState<{ member: CommitteeMember; element: HTMLButtonElement } | null>(null);
  const [currentCommittee, setCurrentCommittee] = useState<Committee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommittee = async () => {
      try {
        const data = await api.getCurrentCommittee();
        if (data) {
          setCurrentCommittee(data);
        }
      } catch (error) {
        console.error('Failed to fetch current committee:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommittee();
  }, []);

  // Derive members from current committee
  const members = currentCommittee?.members || [];

  // Sort and categorize members
  const { president, vicePresident, secretary, treasurer, otherMembers } = useMemo(() => {
    const designationOrder = ['president', 'vice-president', 'secretary', 'treasurer', 'member'];
    const sortedMembers = [...members].sort((a, b) => 
      designationOrder.indexOf(a.designation) - designationOrder.indexOf(b.designation)
    );

    return {
      president: sortedMembers.find(m => m.designation === 'president'),
      vicePresident: sortedMembers.find(m => m.designation === 'vice-president'),
      secretary: sortedMembers.find(m => m.designation === 'secretary'),
      treasurer: sortedMembers.find(m => m.designation === 'treasurer'),
      otherMembers: sortedMembers.filter(m => m.designation === 'member'),
    };
  }, [members]);

  const handleSelectMember = (member: CommitteeMember, element: HTMLButtonElement) => {
    setSelectedMember({ member, element });
  };

  const handleClose = () => {
    setSelectedMember(null);
  };

  function LoadingCommittee() {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
      </div>
    );
  }

  function NoCommitteeFound () {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <HandCoins className='w-10 h-10 text-gray-400' />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No Committee found</h3>
      </motion.div>
    );
  }

  return (
    <section id="committee" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            Our Current Committee
          </h2>
          
          {
            currentCommittee &&
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Meet the dedicated team leading our community — {currentCommittee.term}
            </p>
          }
        </motion.div>

        {
          loading ? <LoadingCommittee /> :
          (
            (!currentCommittee || !members.length) ? <NoCommitteeFound /> :
            <>
              {/* Committee Members Layout */}
              <div className="max-w-4xl mx-auto">
                {/* President - Center Top */}
                {president && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center mb-6 sm:mb-8"
                  >
                    <MemberAvatar 
                      member={president} 
                      size="lg" 
                      onSelect={handleSelectMember}
                    />
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-semibold text-primary-700">{president.designationLabel}</p>
                    <p className="text-xs sm:text-sm text-gray-600 text-center max-w-[120px] sm:max-w-none">{president.name}</p>
                  </motion.div>
                )}

                {/* Vice President, Secretary, Treasurer - Second Row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex justify-center items-start gap-4 sm:gap-8 md:gap-12 lg:gap-16 mb-6 sm:mb-8"
                >
                  {vicePresident && (
                    <div className="flex flex-col items-center flex-1 max-w-[90px] sm:max-w-[120px] md:max-w-none md:flex-none">
                      <MemberAvatar 
                        member={vicePresident} 
                        size="md" 
                        onSelect={handleSelectMember}
                      />
                      <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs md:text-sm font-semibold text-primary-600 text-center leading-tight">
                        {vicePresident.designationLabel}
                      </p>
                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 text-center leading-tight">
                        {vicePresident.name}
                      </p>
                    </div>
                  )}
                  {secretary && (
                    <div className="flex flex-col items-center flex-1 max-w-[90px] sm:max-w-[120px] md:max-w-none md:flex-none">
                      <MemberAvatar 
                        member={secretary} 
                        size="md" 
                        onSelect={handleSelectMember}
                      />
                      <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs md:text-sm font-semibold text-primary-600 text-center leading-tight">
                        {secretary.designationLabel}
                      </p>
                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 text-center leading-tight">
                        {secretary.name}
                      </p>
                    </div>
                  )}
                  {treasurer && (
                    <div className="flex flex-col items-center flex-1 max-w-[90px] sm:max-w-[120px] md:max-w-none md:flex-none">
                      <MemberAvatar 
                        member={treasurer} 
                        size="md" 
                        onSelect={handleSelectMember}
                      />
                      <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs md:text-sm font-semibold text-primary-600 text-center leading-tight">
                        {treasurer.designationLabel}
                      </p>
                      <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 text-center leading-tight">
                        {treasurer.name}
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Other Members - Third Row */}
                {otherMembers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex justify-center items-start flex-wrap gap-3 sm:gap-5 md:gap-6 lg:gap-8"
                  >
                    {otherMembers.map((member) => (
                      <div key={member.id} className="flex flex-col items-center w-[70px] sm:w-[80px] md:w-auto">
                        <MemberAvatar 
                          member={member} 
                          size="sm" 
                          onSelect={handleSelectMember}
                        />
                        <p className="mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] md:text-xs font-medium text-primary-500 text-center leading-tight">
                          {member.designationLabel}
                        </p>
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 text-center leading-tight">
                          {member.name}
                        </p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </>
          )
        }

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8 sm:mt-10 md:mt-12"
        >
          <Link
            href="/committees"
            className="inline-flex items-center gap-2 text-sm sm:text-base text-primary-700 hover:text-primary-800 font-semibold transition-colors group"
          >
            <span>View Complete Committee History</span>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
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

      {/* Floating Profile Card */}
      <AnimatePresence>
        {selectedMember && (
          <>
            {/* Backdrop - z-[55] to cover navbar (z-50) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[55]"
              onClick={handleClose}
            />
            <ProfileCard
              member={selectedMember.member}
              onClose={handleClose}
            />
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
