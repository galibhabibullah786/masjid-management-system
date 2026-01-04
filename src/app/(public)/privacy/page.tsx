'use client';

import { motion } from 'framer-motion';
import IslamicPattern from '@/components/ui/IslamicPattern';
import BackToTopButton from '@/components/BackToTopButton';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-stone-950 text-white pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-hidden">
        <IslamicPattern fixed variant="complex" />
        
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-primary-500/20 blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Privacy <span className="text-primary-300">Policy</span>
            </h1>
            <p className="text-base sm:text-lg text-primary-100 max-w-2xl mx-auto">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 md:p-10 space-y-8">
              
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Name and contact information when you submit a contribution or inquiry form</li>
                  <li>Email address when you contact us</li>
                  <li>Phone number for communication purposes</li>
                  <li>Contribution details for transparency records</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>To process and acknowledge contributions</li>
                  <li>To maintain accurate records for transparency</li>
                  <li>To communicate with you about community updates and events</li>
                  <li>To respond to your inquiries and requests</li>
                  <li>To improve our website and services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
                <p className="text-gray-600 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties. 
                  Contributor names may be displayed publicly on our transparency ledger unless you choose 
                  to make an anonymous contribution. We may share aggregated, non-personally identifiable 
                  information for community reporting purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Anonymous Contributions</h2>
                <p className="text-gray-600 leading-relaxed">
                  Contributors have the option to remain anonymous. If you choose anonymous contribution, 
                  your name will not be displayed publicly, but we will maintain private records for 
                  accountability purposes. These private records are only accessible to authorized 
                  committee members.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
                <p className="text-gray-600 leading-relaxed">
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. This includes encryption, 
                  secure servers, and restricted access to personal data. However, no method of transmission 
                  over the Internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies and Tracking</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our website may use cookies to enhance your browsing experience. Cookies are small files 
                  stored on your device that help us understand how you use our website. You can choose to 
                  disable cookies through your browser settings, but this may affect some features of the website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Links</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our website may contain links to third-party websites. We are not responsible for the 
                  privacy practices or content of these external sites. We encourage you to review the 
                  privacy policies of any third-party sites you visit.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Request access to your personal information</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information (subject to legal requirements)</li>
                  <li>Opt out of communications at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to Privacy Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this 
                  page with an updated revision date. We encourage you to review this policy periodically 
                  to stay informed about how we protect your information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact 
                  us through the contact form on our website or reach out to our committee members directly. 
                  We are committed to addressing your concerns promptly.
                </p>
              </section>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Last updated: January 2026
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <BackToTopButton />
    </main>
  );
}
