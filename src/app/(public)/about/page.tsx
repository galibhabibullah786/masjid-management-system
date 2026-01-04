'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import IslamicPattern from '@/components/ui/IslamicPattern';
import BackToTopButton from '@/components/BackToTopButton';

export default function AboutPage() {
  const timeline = [
    {
      year: '2022',
      title: 'The Vision Begins',
      description: 'Community members came together with a shared vision to establish a place of worship that would serve the spiritual needs of Nazirpara.',
    },
    {
      year: '2023',
      title: 'Land Acquisition',
      description: 'Through generous land donations and community fundraising, we secured the land for our future mosque.',
    },
    {
      year: '2024',
      title: 'Construction Begins',
      description: 'With overwhelming community support, construction of the mosque structure commenced.',
    },
    {
      year: '2025',
      title: 'Growing Together',
      description: 'Our community continues to grow as more families join in supporting this blessed initiative.',
    },
  ];

  const values = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      title: 'Transparency',
      description: 'Every contribution is publicly documented. We believe trust is built through openness and accountability.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Unity',
      description: 'We are stronger together. Our diverse community works hand in hand towards a common goal.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Trust',
      description: 'We honor the trust placed in us by ensuring every contribution is used for its intended purpose.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Service',
      description: 'Our commitment extends beyond construction to serving the community for generations.',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-stone-950 text-white pt-24 sm:pt-28 pb-16 overflow-hidden">
        <IslamicPattern fixed variant="complex" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Building a <span className="text-primary-300">Legacy</span> of Faith
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Amanat-E-Nazirpara is more than a construction project — it&apos;s a community coming together 
              to create a lasting spiritual home for generations to come.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our <span className="text-primary-600">Mission</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Amanat-E-Nazirpara was born from a simple yet powerful idea: that a community united 
                in faith can achieve the extraordinary. Our mission is to establish a mosque that 
                serves not just as a place of prayer, but as a center for community growth, education, 
                and spiritual development.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                We are committed to maintaining complete transparency in all our operations. Every 
                contribution is documented, every expense is accounted for, and every community member 
                has access to our financial records through our transparency ledger.
              </p>
              <p className="text-gray-600 leading-relaxed">
                This initiative is managed by an elected committee of community members who volunteer 
                their time and expertise to ensure the project&apos;s success. Together, we are not just 
                building a structure — we are strengthening the bonds that unite us as a community.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                <svg className="w-48 h-48 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-amber-100 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Core <span className="text-primary-600">Values</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and ensure we stay true to our mission.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-primary-600">Journey</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From vision to reality — the milestones that mark our progress.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative pl-8 pb-8 border-l-2 border-primary-200 last:border-transparent"
              >
                <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-primary-600 border-4 border-white" />
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-2">
                  {item.year}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
                Join Us in This Blessed Journey
                </h2>
                <p className="text-primary-100 max-w-xl mx-auto mb-8">
                    Your contribution, no matter the size, makes a difference. Together, we can build 
                    something that will serve our community for generations.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

                    <Link href="/contributions">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-full font-semibold hover:bg-white/20 transition-all"
                        >
                            <span>View Transparency Report</span>
                        </motion.div>
                    </Link>
                </div>
            </div>
            </div>
        </motion.div>
      {/* <section className="py-16 sm:py-20 bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Join Us in This Blessed Journey
            </h2>
            <p className="text-primary-100 mb-8 text-lg">
              Your contribution, no matter the size, makes a difference. Together, we can build 
              something that will serve our community for generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-4 bg-white text-primary-700 rounded-full font-semibold hover:bg-gray-100 transition-all hover:shadow-lg"
              >
                Make a Contribution
              </Link>
              <Link
                href="/contributions"
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-full font-semibold hover:bg-white/20 transition-all"
              >
                View Transparency Report
              </Link>
            </div>
          </motion.div>
        </div>
      </section> */}

      <BackToTopButton />
    </main>
  );
}
