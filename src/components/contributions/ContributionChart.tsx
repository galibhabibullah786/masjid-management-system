'use client';

import { motion } from 'framer-motion';

interface YearlyData {
  year: string;
  amount: number;
}

interface ContributionChartProps {
  yearlyData: YearlyData[];
  typeBreakdown: {
    type: string;
    percentage: number;
    amount: number;
    color: string;
  }[];
}

function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `৳${(amount / 100000).toFixed(1)}L`;
  }
  return `৳${(amount / 1000).toFixed(0)}K`;
}

export default function ContributionChart({ yearlyData, typeBreakdown }: ContributionChartProps) {
  const maxAmount = Math.max(...yearlyData.map((d) => d.amount));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart - Yearly Trends */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8"
      >
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6 text-center">
          Yearly Contribution Trends
        </h3>
        
        <div className="flex items-end justify-around gap-2 sm:gap-4 h-64 sm:h-72 pt-8">
          {yearlyData.map((data, index) => {
            const heightPercent = (data.amount / maxAmount) * 100;
            const isLatest = index === yearlyData.length - 1;
            
            return (
              <div key={data.year} className="flex flex-col items-center flex-1 max-w-24">
                {/* Value Label */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className={`text-xs sm:text-sm font-bold mb-2 ${isLatest ? 'text-amber-600' : 'text-primary-600'}`}
                >
                  {formatCurrency(data.amount)}
                </motion.div>
                
                {/* Bar */}
                <div className="w-full h-full flex items-end justify-center">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${heightPercent}%` }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.1,
                      type: 'spring',
                      stiffness: 50 
                    }}
                    className={`w-full max-w-12 sm:max-w-16 rounded-t-xl ${
                      isLatest 
                        ? 'bg-gradient-to-t from-amber-500 to-amber-400' 
                        : 'bg-gradient-to-t from-primary-600 to-primary-400'
                    } relative group cursor-pointer transition-all hover:opacity-90`}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      ৳{data.amount.toLocaleString()}
                    </div>
                  </motion.div>
                </div>
                
                {/* Year Label */}
                <div className={`mt-3 text-xs sm:text-sm font-semibold ${isLatest ? 'text-amber-600' : 'text-gray-600'}`}>
                  {data.year}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Growth indicator */}
        {yearlyData.length >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="text-sm text-gray-600">
              📈 <span className="font-semibold text-primary-600">
                {Math.round(((yearlyData[yearlyData.length - 1].amount - yearlyData[0].amount) / yearlyData[0].amount) * 100)}% growth
              </span> over {yearlyData.length} years
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Donut Chart - Type Breakdown */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8"
      >
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-6 text-center">
          By Contribution Type
        </h3>
        
        {/* Donut Chart Placeholder */}
        <div className="flex justify-center mb-6">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            {/* SVG Donut Chart */}
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {typeBreakdown.map((item, index) => {
                const prevPercentages = typeBreakdown.slice(0, index).reduce((acc, curr) => acc + curr.percentage, 0);
                const circumference = 2 * Math.PI * 35;
                const offset = (prevPercentages / 100) * circumference;
                const length = (item.percentage / 100) * circumference;
                
                return (
                  <motion.circle
                    key={item.type}
                    cx="50"
                    cy="50"
                    r="35"
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="20"
                    strokeDasharray={`${length} ${circumference - length}`}
                    strokeDashoffset={-offset}
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    whileInView={{ strokeDasharray: `${length} ${circumference - length}` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                );
              })}
            </svg>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl sm:text-3xl font-bold text-gray-800">100%</span>
              <span className="text-xs text-gray-500">Total</span>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="space-y-3">
          {typeBreakdown.map((item, index) => (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div 
                className="w-6 h-6 rounded-lg flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 flex justify-between items-center">
                <span className="font-semibold text-gray-800 text-sm">{item.type}</span>
                <div className="text-right">
                  <span className="font-bold text-sm" style={{ color: item.color }}>{item.percentage}%</span>
                  <p className="text-xs text-gray-500">{formatCurrency(item.amount)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
