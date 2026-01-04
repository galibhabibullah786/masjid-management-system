'use client';

import { motion } from 'framer-motion';

interface ContributionStatsProps {
  totalFunds: number;
  landDonated: number;
  totalContributors: number;
}

function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `৳${(amount / 100000).toFixed(2)} Lakh`;
  }
  return `৳${amount.toLocaleString('en-BD')}`;
}

export default function ContributionStats({ totalFunds, landDonated, totalContributors }: ContributionStatsProps) {
  const stats = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Total Funds Raised',
      value: formatCurrency(totalFunds),
      color: 'from-primary-500 to-primary-700',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Land Donated',
      value: `${landDonated} Decimals`,
      color: 'from-amber-500 to-amber-700',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      label: 'Total Contributors',
      value: totalContributors.toString(),
      color: 'from-emerald-500 to-emerald-700',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="relative overflow-hidden bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          {/* Background Gradient Decoration */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
          
          <div className="relative p-6 sm:p-8">
            <div className={`inline-flex items-center justify-center w-14 h-14 ${stat.bgColor} ${stat.textColor} rounded-xl mb-4`}>
              {stat.icon}
            </div>
            
            <motion.h3 
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: 'spring' }}
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
            >
              {stat.value}
            </motion.h3>
            
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
