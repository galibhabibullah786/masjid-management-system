'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutSection() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      title: 'Community Driven',
      description: 'Built by the community, for the community. Every member has a voice in our decisions.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Full Transparency',
      description: 'Every contribution is documented and publicly accessible through our transparency ledger.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Lasting Impact',
      description: 'Your contribution creates a legacy that benefits generations to come.',
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                <svg className="w-32 h-32 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-100 rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-100 rounded-full -z-10" />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              A Sacred Mission of <span className="text-primary-600">Unity & Faith</span>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Amanat-E-Nazirpara is a community-driven initiative dedicated to building and maintaining 
              a place of worship that serves as the spiritual heart of our neighborhood. Our mission is 
              rooted in transparency, trust, and the collective efforts of our community members.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              We believe that every contribution, no matter how small, plays a vital role in creating 
              a legacy that will benefit generations to come. Through our transparent ledger system, 
              we ensure that every donor&apos;s trust is honored and every penny is accounted for.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center p-4"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-all hover:shadow-lg group"
            >
              Learn More About Us
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
