'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import MosqueSilhouette from '../ui/MosqueSilhouette';
import IslamicPattern from '../ui/IslamicPattern';

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-16 sm:pt-20 scroll-mt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-stone-950">
          <IslamicPattern variant="complex" fixed />

          {/* Mosque Silhouette Overlay - Responsive positioning */}
          <MosqueSilhouette 
            className="fixed -right-[302px] xs:-right-[362px] sm:-right-[485px] md:-right-[605px] lg:-right-[727px] xl:-right-[854px] 2xl:-right-[957px] bottom-0 w-[500px] xs:w-[600px] sm:w-[800px] md:w-[1000px] lg:w-[1200px] xl:w-[1400px] 2xl:w-[1600px] h-[300px] xs:h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px]"
            opacity={0.15}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Content - Left Aligned */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl text-left"
        >
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Building Our Community,
            <br />
            <span className="text-primary-500">Together</span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 leading-relaxed max-w-prose"
          >
            Join us in creating a sacred space for worship, community, and spiritual growth.
            Your contribution makes a lasting difference.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <Link
              href="#contact"
              className="group px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-primary-700 text-white rounded-full font-semibold hover:bg-primary-800 transition-all hover:shadow-2xl hover:scale-105 flex items-center justify-center space-x-2 w-full xs:w-auto text-sm sm:text-base"
            >
              <span>Contribute Now</span>
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

            <Link
              href="/contributions"
              className="px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-semibold hover:bg-white/20 transition-all border-2 border-white/30 hover:border-white/50 w-full xs:w-auto text-center text-sm sm:text-base"
            >
              View Transparency Report
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Positioned at bottom of section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/80 flex flex-col items-center gap-1.5 sm:gap-2"
        >
          <span className="text-xs sm:text-sm font-medium tracking-wide">Scroll to explore</span>
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
