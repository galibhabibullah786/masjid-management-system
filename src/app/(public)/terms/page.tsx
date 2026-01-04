'use client';

import { motion } from 'framer-motion';
import IslamicPattern from '@/components/ui/IslamicPattern';
import BackToTopButton from '@/components/BackToTopButton';

export default function TermsPage() {
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
              Terms of <span className="text-primary-300">Service</span>
            </h1>
            <p className="text-base sm:text-lg text-primary-100 max-w-2xl mx-auto">
              Please read these terms carefully before using our website and services.
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  By accessing and using the Amanat-E-Nazirpara website, you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by these terms, please do not use this website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Purpose of the Website</h2>
                <p className="text-gray-600 leading-relaxed">
                  This website is designed to provide information about the Amanat-E-Nazirpara community initiative, 
                  including details about contributions, committee members, gallery images, and community updates. 
                  The website aims to maintain transparency and trust within the community.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Contributions and Donations</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  All contributions and donations made through or in connection with this initiative are:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Voluntary and made at the discretion of the contributor</li>
                  <li>Non-refundable unless explicitly stated otherwise</li>
                  <li>Subject to proper documentation and transparency as outlined in our policies</li>
                  <li>Used solely for the purpose of the community project as stated</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Conduct</h2>
                <p className="text-gray-600 leading-relaxed">
                  Users of this website agree not to use the site for any unlawful purpose or in any way that could 
                  damage, disable, overburden, or impair the website. Users must not attempt to gain unauthorized 
                  access to any portion of the website or any other systems or networks connected to the website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
                <p className="text-gray-600 leading-relaxed">
                  All content on this website, including text, images, graphics, and other materials, is the property 
                  of Amanat-E-Nazirpara or its content suppliers. This content is protected by applicable intellectual 
                  property laws and may not be reproduced, distributed, or used without prior written permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Disclaimer of Warranties</h2>
                <p className="text-gray-600 leading-relaxed">
                  This website is provided &quot;as is&quot; without any representations or warranties, express or implied. 
                  Amanat-E-Nazirpara makes no representations or warranties in relation to this website or the 
                  information and materials provided on this website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                  Amanat-E-Nazirpara will not be liable to you in relation to the contents of, or use of, or otherwise 
                  in connection with, this website for any indirect, special, or consequential loss; or for any business 
                  losses, loss of revenue, income, profits, or anticipated savings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  Amanat-E-Nazirpara reserves the right to modify these terms at any time. We will notify users of any 
                  significant changes by posting a notice on the website. Your continued use of the website after such 
                  modifications constitutes your acceptance of the updated terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us through the contact 
                  form on our website or reach out to our committee members directly.
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
