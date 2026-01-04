'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import type { Statistics } from '@/lib/types';

export default function StatisticsSection() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await api.getStatistics();
        if (data) {
          setStatistics(data);
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        // Fallback values if API fails
        setStatistics({
          totalFunds: 0,
          landDonated: 0,
          totalContributors: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const stats = [
    {
      id: 1,
      label: 'Total Funds Raised',
      value: loading ? '...' : `৳${((statistics?.totalFunds || 0) / 100000).toFixed(1)}L`,
      description: 'Community contributions',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      color: 'from-primary-600 to-primary-800',
    },
    {
      id: 2,
      label: 'Land Donated',
      value: loading ? '...' : `${statistics?.landDonated || 0}`,
      description: 'Decimal of land',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      color: 'from-amber-600 to-primary-800',
    },
    {
      id: 3,
      label: 'Total Contributors',
      value: loading ? '...' : `${statistics?.totalContributors || 0}+`,
      description: 'Community members',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: 'from-primary-700 to-amber-700',
    },
  ];

  return (
    <section id="statistics" className="py-20 bg-gradient-to-br from-stone-50 via-primary-50 to-amber-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Transparency and accountability are the foundations of our community trust
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 h-full">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}
                >
                  {stat.icon}
                </div>

                {/* Value */}
                <div className="mb-3">
                  <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-lg font-semibold text-gray-700">{stat.label}</p>
                </div>

                {/* Description */}
                <p className="text-gray-500">{stat.description}</p>

                {/* Decorative Element */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -z-10 group-hover:scale-150 transition-transform duration-500`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 text-lg">
            Last updated:{' '}
            <span className="font-semibold text-primary-700">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
