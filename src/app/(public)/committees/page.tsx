'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { HandCoins } from 'lucide-react';
import CommitteeCard from '@/components/committees/CommitteeCard';
import TimelineNode from '@/components/committees/TimelineNode';
import ProfileModal from '@/components/committees/ProfileModal';
import IslamicPattern from '@/components/ui/IslamicPattern';
import { api } from '@/lib/api';
import type { Committee, CommitteeMember } from '@/lib/types';
import { cn } from '@/lib/utils';
import BackToTopButton from '@/components/BackToTopButton';

export default function CommitteesPage() {
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null);
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const data = await api.getAllCommittees();
        setCommittees(data);
      } catch (error) {
        console.error('Failed to fetch committees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommittees();
  }, []);

  // Sort committees in descending order (most recent first by createdAt or _id)
  const sortedCommittees = [...committees].sort((a, b) => {
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return (b._id || '').localeCompare(a._id || '');
  });

  function LoadingCommittee() {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-200 rounded-xl h-84"></div>
        </div>
      </div>
    );
  }
  
  function NoCommitteesFound () {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <HandCoins className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No Committees found</h3>
      </motion.div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-x-hidden">
      {/* Hero Section with Islamic Geometry */}
      <div className="relative inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-stone-950 text-white pt-24 sm:pt-28 md:pb-13 pb-10 overflow-hidden">
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
              Committee <span className="text-primary-300">History</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Celebrating years of dedicated leadership and community service. Each committee has contributed to building our vision.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="max-w-[720px] mx-auto">
          {
            loading ? <LoadingCommittee /> :
            (
              sortedCommittees.length === 0 ? <NoCommitteesFound /> :
              <>
                {/* Tablet Timeline (md-lg) - Left aligned with larger nodes */}
                <div className="relative hidden md:block">
                  {/* Timeline Line */}
                  <div className="absolute left-14 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-200 rounded-full" />
                  
                  {sortedCommittees.map((committee, index) => {
                    const isCurrent = committee.type === 'current';

                    return (
                      <div key={committee.id} className={cn("relative mb-16 last:mb-0 flex items-start gap-8 pl-2", loading && "animate-pulse")}>
                        {/* Timeline Node */}
                        <div className="flex-shrink-0 z-10">
                          <TimelineNode term={committee.term} isCurrent={isCurrent} index={index} />
                        </div>

                        {/* Card */}
                        <div className="flex-1 pt-3">
                          <CommitteeCard
                            committee={committee}
                            isCurrent={isCurrent}
                            onMemberClick={setSelectedMember}
                            isRight={true}
                            index={index}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Timeline (below md) - Compact left-aligned */}
                <div className="md:hidden relative">
                  {/* Timeline Line */}
                  <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-primary-400 to-primary-200" />
                  
                  {sortedCommittees.map((committee, index) => {
                    const isCurrent = committee.type === 'current';

                    return (
                      <motion.div
                        key={committee.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="relative mb-10 last:mb-0 pl-14"
                      >
                        {/* Mobile Timeline Node */}
                        <div className="absolute left-[22px] -translate-x-1/2 top-0 z-10">
                          <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: 'spring', stiffness: 200, delay: index * 0.1 }}
                            className={`w-11 h-11 rounded-full flex flex-col items-center justify-center shadow-lg ${
                              isCurrent 
                                ? 'bg-gradient-to-br from-primary-500 to-primary-700 ring-3 ring-primary-300/50' 
                                : 'bg-white border-3 border-primary-400'
                            }`}
                          >
                            <span className={`text-[10px] font-bold ${isCurrent ? 'text-white' : 'text-primary-700'}`}>
                              {committee.term.split('-')[0]}
                            </span>
                          </motion.div>
                          
                          {isCurrent && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 }}
                              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-amber-500 text-[7px] font-bold text-white rounded-full whitespace-nowrap shadow-sm"
                            >
                              NOW
                            </motion.div>
                          )}
                        </div>

                        {/* Card */}
                        <CommitteeCard
                          committee={committee}
                          isCurrent={isCurrent}
                          onMemberClick={setSelectedMember}
                          isRight={true}
                          index={index}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )
          }
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedMember && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
              onClick={() => setSelectedMember(null)}
            />
            <ProfileModal
              member={selectedMember}
              onClose={() => setSelectedMember(null)}
            />
          </>
        )}
      </AnimatePresence>

      <BackToTopButton />
    </main>
  );
}
