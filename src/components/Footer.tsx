'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import MosqueSilhouette from './ui/MosqueSilhouette';
import IslamicPattern from './ui/IslamicPattern';

interface SiteSettings {
  siteName?: string;
  tagline?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo?: string;
  socialLinks?: {
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const [clipPath, setClipPath] = useState('inset(100% 0 0 0)');
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/public/settings');
        const data = await response.json();
        if (data.success) {
          setSettings(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const updateClipPath = () => {
      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect();
        const top = Math.max(0, rect.top);
        const bottom = Math.max(0, window.innerHeight - rect.bottom);
        setClipPath(`inset(${top}px 0 ${bottom}px 0)`);
      }
    };

    updateClipPath();
    window.addEventListener('scroll', updateClipPath, { passive: true });
    window.addEventListener('resize', updateClipPath);

    return () => {
      window.removeEventListener('scroll', updateClipPath);
      window.removeEventListener('resize', updateClipPath);
    };
  }, []);

  // Build contact links dynamically from settings
  const contactLinks = [
    ...(settings?.email ? [{ 
      name: settings.email, 
      href: `mailto:${settings.email}`, 
      icon: 'email' 
    }] : []),
    ...(settings?.phone ? [{ 
      name: settings.phone, 
      href: `tel:${settings.phone.replace(/[^+\d]/g, '')}`, 
      icon: 'phone' 
    }] : []),
    ...(settings?.address ? [{ 
      name: settings.address, 
      href: '#', 
      icon: 'location' 
    }] : []),
  ];

  const footerLinks = {
    about: [
      { name: 'Our Mission', href: '/about' },
      { name: 'Committees', href: '/committees' },
      { name: 'Gallery', href: '/gallery' },
    ],
    contribute: [
      { name: 'Make a Donation', href: '/#contact' },
      { name: 'View Contributions', href: '/contributions' },
      { name: 'Transparency Report', href: '/contributions' },
    ],
  };

  const siteName = settings?.siteName || 'Amanat-E-Nazirpara';
  const description = settings?.description || 'A community-driven initiative to build and maintain our sacred space through transparency, trust, and collective effort.';

  return (
    <footer ref={footerRef} className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-primary-900 text-white overflow-hidden">
      <IslamicPattern variant="complex" fixed />

      {/* Fixed Mosque Silhouette - Clipped to footer bounds */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{ clipPath, WebkitClipPath: clipPath }}
      >
        <MosqueSilhouette 
          className="fixed -right-[302px] xs:-right-[362px] sm:-right-[485px] md:-right-[605px] lg:-right-[727px] xl:-right-[854px] 2xl:-right-[957px] bottom-0 w-[500px] xs:w-[600px] sm:w-[800px] md:w-[1000px] lg:w-[1200px] xl:w-[1400px] 2xl:w-[1600px] h-[300px] xs:h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] xl:h-[650px] 2xl:h-[700px]"
          opacity={0.15}
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              {settings?.logo ? (
                <div className="relative w-12 h-12">
                  <Image 
                    src={settings.logo} 
                    alt={siteName} 
                    fill 
                    className="object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="relative w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              )}
              <span className="text-lg font-semibold">{siteName}</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* About Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary-500">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contribute Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary-500">Contribute</h3>
            <ul className="space-y-2">
              {footerLinks.contribute.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary-500">Contact</h3>
            <ul className="space-y-3">
              {contactLinks.map((link) => (
                <li key={link.name} className="flex items-start space-x-2">
                  <span className="text-primary-500 mt-1">
                    {link.icon === 'email' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    )}
                    {link.icon === 'phone' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    )}
                    {link.icon === 'location' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {contactLinks.length === 0 && (
                <li className="text-gray-400 text-sm">Contact information not available</li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} {siteName}. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/admin/dashboard"
                className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
              >
                Admin-panel
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-primary-400 transition-colors text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
