'use client';

import { motion } from 'framer-motion';

interface ContributionFiltersProps {
  dateFrom: string;
  dateTo: string;
  type: string;
  searchQuery: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onTypeChange: (type: string) => void;
  onSearchChange: (query: string) => void;
  onReset: () => void;
  filteredCount: number;
  totalCount: number;
}

export default function ContributionFilters({
  dateFrom,
  dateTo,
  type,
  searchQuery,
  onDateFromChange,
  onDateToChange,
  onTypeChange,
  onSearchChange,
  onReset,
  filteredCount,
  totalCount,
}: ContributionFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-5 sm:p-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Date From */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            From Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-sm bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            To Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-sm bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Contribution Type
          </label>
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-sm bg-gray-50 focus:bg-white appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem',
            }}
          >
            <option value="all">All Types</option>
            <option value="Cash">Cash</option>
            <option value="Land">Land</option>
            <option value="Material">Material</option>
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Search Contributor
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Enter name..."
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all text-sm bg-gray-50 focus:bg-white"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Stats & Reset */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-5 pt-5 border-t border-gray-100 gap-3">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold text-primary-600">{filteredCount}</span> of{' '}
          <span className="font-semibold">{totalCount}</span> contributions
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
          className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm"
        >
          Reset Filters
        </motion.button>
      </div>
    </motion.div>
  );
}
