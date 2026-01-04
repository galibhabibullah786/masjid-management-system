'use client';

import { motion } from 'framer-motion';
import MemberAvatar from './MemberAvatar';
import IslamicPattern from '../ui/IslamicPattern';
import type { CommitteeMember } from '@/lib/types';

interface CommitteeCardProps {
  committee: any;
  isCurrent: boolean;
  onMemberClick: (member: CommitteeMember) => void;
  isRight: boolean;
  index: number;
}

export default function CommitteeCard({ committee, isCurrent, onMemberClick, isRight, index }: CommitteeCardProps) {
  // Handle both memberDetails and members array formats
  const members = committee.memberDetails || committee.members || [];
  
  const designationOrder = ['president', 'vice-president', 'secretary', 'treasurer', 'member'];
  const sortedMembers = [...members].sort((a: any, b: any) => {
    const aDesignation = a.designation || 'member';
    const bDesignation = b.designation || 'member';
    return designationOrder.indexOf(aDesignation) - designationOrder.indexOf(bDesignation);
  });

  const president = sortedMembers.find((m: any) => m.designation === 'president');
  const vicePresident = sortedMembers.find((m: any) => m.designation === 'vice_president' || m.designation === 'vice-president');
  const secretary = sortedMembers.find((m: any) => m.designation === 'secretary');
  const treasurer = sortedMembers.find((m: any) => m.designation === 'treasurer');
  const otherMembers = sortedMembers.filter((m: any) => m.designation === 'member');

  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 60 : -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.12, type: 'spring', stiffness: 80 }}
      className="relative group"
    >
      <div className={`hidden lg:block absolute top-14 ${isRight ? 'right-full mr-0' : 'left-full ml-0'} h-0.5 w-8 xl:w-12`}>
        <div className={`h-full bg-gradient-to-r ${isRight ? 'from-primary-300 to-primary-400' : 'from-primary-400 to-primary-300'}`} />
        <div className={`absolute ${isRight ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary-400 shadow-md`} />
      </div>
      
      <div className={`relative bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 ${
        isCurrent ? 'ring-2 ring-primary-400 ring-offset-2 sm:ring-offset-4' : ''
      }`}>
        
        <div className={`relative p-5 sm:p-6 ${isCurrent ? 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800' : 'bg-gradient-to-br from-gray-50 to-white'} overflow-hidden`}>
          <IslamicPattern 
            variant="simple" 
            color={isCurrent ? 'white' : 'primary'} 
            size={80} 
            opacity={0.07} 
          />
          
          <div className="relative">
            <div className={`flex items-start justify-between gap-3 ${isRight ? 'text-left' : 'lg:text-right'}`}>
              <div className={`flex-1 ${!isRight ? 'lg:order-2' : ''}`}>
                <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${isCurrent ? 'text-white' : 'text-gray-900'}`}>
                  {committee.name}
                </h3>
                <p className={`text-sm sm:text-base leading-relaxed ${isCurrent ? 'text-primary-100' : 'text-gray-600'}`}>
                  {committee.description}
                </p>
              </div>
            </div>
            
            <div className={`lg:hidden mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
              isCurrent ? 'bg-white/20 text-white backdrop-blur-sm' : 'bg-primary-100 text-primary-700'
            }`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {committee.term}
            </div>
          </div>
        </div>

        {members.length > 0 ? (
          <div className="p-5 sm:p-6">
            {president && (
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  <MemberAvatar 
                    member={president} 
                    size="lg"
                    onSelect={onMemberClick}
                  />
                </div>
                <p className="mt-3 text-xs sm:text-sm font-bold text-amber-600">{president.designationLabel}</p>
                <p className="text-xs sm:text-sm text-gray-700">{president.name}</p>
              </div>
            )}

            {(vicePresident || secretary || treasurer) && (
              <div className="flex justify-center items-start gap-3 sm:gap-5 md:gap-6 mb-6 flex-wrap">
                {vicePresident && (
                  <div className="flex flex-col items-center">
                    <MemberAvatar 
                      member={vicePresident} 
                      size="md"
                      onSelect={onMemberClick}
                    />
                    <p className="mt-2 text-[10px] sm:text-xs font-semibold text-primary-600 text-center">
                      {vicePresident.designationLabel}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600 text-center max-w-[80px] sm:max-w-[90px]">
                      {vicePresident.name}
                    </p>
                  </div>
                )}
                {secretary && (
                  <div className="flex flex-col items-center">
                    <MemberAvatar 
                      member={secretary} 
                      size="md"
                      onSelect={onMemberClick}
                    />
                    <p className="mt-2 text-[10px] sm:text-xs font-semibold text-primary-600 text-center">
                      {secretary.designationLabel}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600 text-center max-w-[80px] sm:max-w-[90px]">
                      {secretary.name}
                    </p>
                  </div>
                )}
                {treasurer && (
                  <div className="flex flex-col items-center">
                    <MemberAvatar 
                      member={treasurer} 
                      size="md"
                      onSelect={onMemberClick}
                    />
                    <p className="mt-2 text-[10px] sm:text-xs font-semibold text-emerald-600 text-center">
                      {treasurer.designationLabel}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600 text-center max-w-[80px] sm:max-w-[90px]">
                      {treasurer.name}
                    </p>
                  </div>
                )}
              </div>
            )}

            {otherMembers.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <p className="text-[10px] sm:text-xs font-semibold text-gray-400 mb-3 text-center uppercase tracking-wider">Executive Members</p>
                <div className="flex justify-center items-start flex-wrap gap-3 sm:gap-4">
                  {otherMembers.map((member: any, idx: number) => (
                    <div key={member._id || member.id || idx} className="flex flex-col items-center w-[55px] sm:w-[65px]">
                      <MemberAvatar 
                        member={member} 
                        size="sm"
                        onSelect={onMemberClick}
                      />
                      <p className="mt-1.5 text-[9px] sm:text-[10px] text-gray-600 text-center leading-tight">
                        {member.name?.split(' ').slice(0, 2).join(' ') || 'Member'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-5 sm:p-6 text-center text-gray-500">
            <p className="text-sm">No members information available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
