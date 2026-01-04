'use client';

import { motion } from 'framer-motion';
import type { Contribution } from '@/lib/types';

interface ContributionTableProps {
  contributions: Contribution[];
  isLoading?: boolean;
}

function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getTypeColor(type: string): { bg: string; text: string } {
  switch (type) {
    case 'Cash':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    case 'Material':
      return { bg: 'bg-blue-100', text: 'text-blue-700' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700' };
  }
}

function TableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="animate-pulse">
          <td className="px-4 sm:px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </td>
          <td className="px-4 sm:px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </td>
          <td className="px-4 sm:px-6 py-4">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          </td>
          <td className="px-4 sm:px-6 py-4">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </td>
        </tr>
      ))}
    </>
  );
}

export default function ContributionTable({ contributions, isLoading = false }: ContributionTableProps) {
  if (!isLoading && contributions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No contributions found</h3>
        <p className="text-gray-500">Try adjusting your filters</p>
      </motion.div>
    );
  }

  return (
    <div className="overflow-hidden bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-gradient-to-r from-primary-600 to-primary-700">
              <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                Contributor
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <TableSkeleton />
            ) : (
              contributions.map((contribution, index) => {
                const typeColor = getTypeColor(contribution.type);
                return (
                  <motion.tr
                    key={contribution.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="hover:bg-primary-50/50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(contribution.date)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm ${
                          contribution.anonymous ? 'bg-gray-400' : 'bg-gradient-to-br from-primary-500 to-primary-600'
                        }`}>
                          {contribution.anonymous ? '?' : contribution.contributorName.charAt(0)}
                        </div>
                        <span className={`text-sm font-medium ${contribution.anonymous ? 'text-gray-500 italic' : 'text-gray-800'}`}>
                          {contribution.anonymous ? 'Anonymous Donor' : contribution.contributorName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${typeColor.bg} ${typeColor.text}`}>
                        {contribution.type}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="text-sm font-semibold text-gray-800">
                        {formatCurrency(contribution.amount)}
                      </span>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
