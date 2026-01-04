'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import IslamicPattern from '@/components/ui/IslamicPattern';
import ContributionStats from '@/components/contributions/ContributionStats';
import ContributionChart from '@/components/contributions/ContributionChart';
import ContributionFilters from '@/components/contributions/ContributionFilters';
import ContributionTable from '@/components/contributions/ContributionTable';
import LandDonorCard from '@/components/contributions/LandDonorCard';
import { api } from '@/lib/api';
import type { Contribution, LandDonor, ContributionStats as ContributionStatsType } from '@/lib/types';
import BackToTopButton from '@/components/BackToTopButton';

const PAGE_SIZE = 15;

export default function ContributionsPage() {
  const [dateFrom, setDateFrom] = useState('2022-01-01');
  const [dateTo, setDateTo] = useState('2024-12-31');
  const [type, setType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [landDonors, setLandDonors] = useState<LandDonor[]>([]);
  const [stats, setStats] = useState<ContributionStatsType | null>(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contributionsRes, landDonorsData, statsData] = await Promise.all([
          api.getContributions({ limit: 1000 }),
          api.getAllLandDonors(),
          api.getContributionStats(),
        ]);
        setContributions(contributionsRes.data || []);
        setLandDonors(landDonorsData || []);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch contributions data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter contributions
  const filteredContributions = useMemo(() => {
    return contributions.filter((contribution) => {
      // Date filter
      const contributionDate = new Date(contribution.date);
      const fromDate = new Date(dateFrom);
      const toDate = new Date(dateTo);
      if (contributionDate < fromDate || contributionDate > toDate) {
        return false;
      }

      // Type filter
      if (type !== 'all' && contribution.type !== type) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (contribution.anonymous) {
          if (!('anonymous'.includes(query) || 'donor'.includes(query))) {
            return false;
          }
        } else if (!contribution.contributorName.toLowerCase().includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [contributions, dateFrom, dateTo, type, searchQuery]);

  // Sort by date (newest first)
  const sortedContributions = useMemo(() => {
    return [...filteredContributions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [filteredContributions]);

  // Calculate total pages
  const totalPages = Math.ceil(sortedContributions.length / PAGE_SIZE);

  // Paginated contributions
  const displayedContributions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return sortedContributions.slice(startIndex, startIndex + PAGE_SIZE);
  }, [sortedContributions, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFrom, dateTo, type, searchQuery]);

  // Handle filter reset
  const handleReset = useCallback(() => {
    setDateFrom('2022-01-01');
    setDateTo('2024-12-31');
    setType('all');
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  // Calculate totals from API stats
  const totalStats = useMemo(() => {
    if (!stats) {
      return { totalFunds: 0, landDonated: 0, totalContributors: 0 };
    }
    return {
      totalFunds: stats.totalAmount,
      landDonated: stats.landDonated,
      totalContributors: stats.contributorCount,
    };
  }, [stats]);

  // Calculate yearly contributions from data
  const yearlyContributions = useMemo(() => {
    const yearMap = new Map<string, number>();
    contributions.forEach((c) => {
      const year = new Date(c.date).getFullYear().toString();
      yearMap.set(year, (yearMap.get(year) || 0) + c.amount);
    });
    return Array.from(yearMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([year, amount]) => ({ year, amount }));
  }, [contributions]);

  // Calculate type breakdown from data
  const typeBreakdown = useMemo(() => {
    const typeMap = new Map<string, number>();
    let total = 0;
    contributions.forEach((c) => {
      typeMap.set(c.type, (typeMap.get(c.type) || 0) + c.amount);
      total += c.amount;
    });
    const colors: Record<string, string> = {
      Cash: '#10b981',
      Land: '#f59e0b',
      Material: '#3b82f6',
    };
    return Array.from(typeMap.entries()).map(([type, amount]) => ({
      type,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      color: colors[type] || '#6b7280',
    }));
  }, [contributions]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-stone-950 text-white pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden">
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
              Transparency <span className="text-primary-300">Ledger</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Complete accountability for every contribution received. 
              Every donation is documented and traceable.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {
          isLoading ?
            <div className="animate-pulse space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl h-32"></div>
                ))}
              </div>
            </div> :
            <ContributionStats
              totalFunds={totalStats.totalFunds}
              landDonated={totalStats.landDonated}
              totalContributors={totalStats.totalContributors}
            />
        }
      </div>

      {/* Charts Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Contribution <span className="text-primary-600">Breakdown</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Visual representation of how contributions are distributed over time and by type
          </p>
        </motion.div>

        {
          isLoading ?
            <div className="animate-pulse space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-100 rounded-xl h-64"></div>
                <div className="bg-gray-100 rounded-xl h-64"></div>
              </div>
            </div> :
            <ContributionChart
              yearlyData={yearlyContributions}
              typeBreakdown={typeBreakdown}
            />
        }
      </div>

      {/* Land Donors Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 bg-gradient-to-b from-primary-50/50 to-transparent">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              Honoring Our <span className="text-primary-600">Land Donors</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Their sacrifice forms the foundation of our community center
            </p>
          </motion.div>
    
          {
            isLoading ?
              <div className="animate-pulse space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-100 rounded-xl h-64"></div>
                  <div className="bg-gray-100 rounded-xl h-64"></div>
                </div>
              </div> :
              <LandDonorCard donors={landDonors} />
          }
        </div>
      </div>

      {/* Contributions Table Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Complete Contribution <span className="text-primary-600">Records</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Every contribution is documented and traceable for complete transparency
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-6">
          <ContributionFilters
            dateFrom={dateFrom}
            dateTo={dateTo}
            type={type}
            searchQuery={searchQuery}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onTypeChange={setType}
            onSearchChange={setSearchQuery}
            onReset={handleReset}
            filteredCount={sortedContributions.length}
            totalCount={contributions.length}
          />
        </div>

        {/* Table */}
        <ContributionTable
          contributions={displayedContributions}
          isLoading={isLoading}
        />

        {/* Pagination Controls */}
        {totalPages > 1 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8"
          >
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{((currentPage - 1) * PAGE_SIZE) + 1}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * PAGE_SIZE, sortedContributions.length)}</span> of{' '}
              <span className="font-medium">{sortedContributions.length}</span> contributions
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show first, last, current, and adjacent pages
                    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                  })
                  .reduce((acc: (number | string)[], page, idx, arr) => {
                    if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
                      acc.push('...');
                    }
                    acc.push(page);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === '...' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setCurrentPage(item as number)}
                        className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === item
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )
                }
              </div>
              <span className="sm:hidden text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Call to Action Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl p-8 sm:p-12 text-center text-white">
          <IslamicPattern fixed variant="simple" opacity={0.1} />
          
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </motion.div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              Join Our Contributors
            </h2>
            <p className="text-primary-100 max-w-xl mx-auto mb-8">
              Your contribution, no matter the size, makes a lasting difference in our community.
              Be a part of something meaningful.
            </p>
            
            <Link href="/#contact">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 rounded-full font-bold shadow-lg hover:shadow-xl transition-all"
              >
                  <span>Make a Contribution</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.div>

      <BackToTopButton />
    </main>
  );
}
