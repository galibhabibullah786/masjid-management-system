'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { SiteSettings } from '@/lib/types';
import IslamicPattern from '../ui/IslamicPattern';

export default function ContactSection() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    contributionType: 'Cash',
    amount: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      await api.sendContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        contributionType: formData.contributionType,
        amount: formData.amount || undefined,
        message: formData.message || undefined,
      });
      
      setSubmitMessage('Thank you for your interest! We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        contributionType: 'Cash',
        amount: '',
        message: '',
      });
    } catch (error) {
      console.error('Failed to send contact form:', error);
      setSubmitMessage('Failed to send your message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      label: 'Email',
      value: settings?.email || 'contact@amanat.org',
      href: `mailto:${settings?.email || 'contact@amanat.org'}`,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
      label: 'Phone',
      value: settings?.phone || '+880 1XXX-XXXXXX',
      href: `tel:${settings?.phone || '+8801XXX-XXXXXX'}`,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      label: 'Address',
      value: settings?.address || 'Nazirpara, Bangladesh',
      href: '#',
    },
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Make Your Contribution
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">
            Every contribution brings us closer to our goal. Reach out to us and be part of this blessed journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative bg-gradient-to-br from-primary-700 to-primary-900 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 text-white h-full overflow-hidden">
              <IslamicPattern variant="simple" fixed opacity={0.1} />
              <h3 className="relative z-10 text-lg sm:text-xl font-bold mb-4 sm:mb-6">Get In Touch</h3>
              <p className="relative z-10 mb-6 sm:mb-8 text-sm sm:text-base text-primary-50">
                We welcome all forms of contributions - cash, land, materials, or volunteer work.
                Contact us to discuss how you can help.
              </p>

              <div className="relative z-10 space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start space-x-3 sm:space-x-4 group hover:translate-x-2 transition-transform"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-colors">
                      <span className="[&_svg]:w-5 [&_svg]:h-5 sm:[&_svg]:w-6 sm:[&_svg]:h-6">{info.icon}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-primary-200 text-xs sm:text-sm mb-0.5 sm:mb-1">{info.label}</p>
                      <p className="font-semibold text-sm sm:text-base break-words">{info.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Decorative Elements */}
              <div className="relative mt-8 sm:mt-12 hidden sm:block">
                <div className="absolute -bottom-4 -right-4 w-24 sm:w-32 h-24 sm:h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -top-4 -left-4 w-16 sm:w-24 h-16 sm:h-24 bg-white/10 rounded-full blur-xl" />
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>

                <div>
                  <label htmlFor="contributionType" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Contribution Type *
                  </label>
                  <select
                    id="contributionType"
                    name="contributionType"
                    value={formData.contributionType}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Land">Land</option>
                    <option value="Material">Material</option>
                    <option value="Volunteer">Volunteer Work</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="amount" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Amount / Details
                </label>
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                  placeholder="e.g., 10,000 BDT or 2 decimal land"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your contribution or ask any questions..."
                />
              </div>

              {submitMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 sm:p-4 bg-primary-50 border border-primary-200 rounded-lg text-primary-800 text-xs sm:text-sm"
                >
                  {submitMessage}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-700 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-primary-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Inquiry</span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
