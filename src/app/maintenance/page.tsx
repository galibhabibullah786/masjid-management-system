'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import IslamicPattern from '@/components/ui/IslamicPattern';
import MosqueSilhouette from '@/components/ui/MosqueSilhouette';

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-stone-950 text-white flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <IslamicPattern variant="complex" fixed opacity={0.1} />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl" />
      
      {/* Mosque Silhouette */}
      <MosqueSilhouette 
        className="fixed -right-[302px] xs:-right-[362px] sm:-right-[485px] md:-right-[605px] lg:-right-[727px] xl:-right-[854px] 2xl:-right-[957px] bottom-0 w-[500px] xs:w-[600px] sm:w-[800px] md:w-[1000px] lg:w-[1200px] xl:w-[1400px] 2xl:w-[1600px] h-[300px] xs:h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px]"
        opacity={0.15}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-primary-500/20 to-primary-600/20 rounded-full flex items-center justify-center border border-primary-400/30"
          >
            <svg className="w-12 h-12 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Under <span className="text-primary-300">Maintenance</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-primary-100/80 mb-8 leading-relaxed"
          >
            We are currently performing scheduled maintenance to improve your experience. 
            Please check back soon. JazakAllah for your patience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-all hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin Login
            </Link>
          </motion.div>

          {/* Decorative Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 mb-6 h-px bg-gradient-to-r from-transparent via-primary-400/50 to-transparent"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-sm text-primary-200/60"
          >
            © {new Date().getFullYear()} Amanat-E-Nazirpara. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}
