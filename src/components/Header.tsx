'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface SiteSettings {
  siteName?: string;
  logo?: string;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', sectionId: 'hero' },
    { name: 'About', href: '/about', sectionId: 'about' },
    { name: 'Contributions', href: '/contributions', sectionId: 'statistics' },
    { name: 'Committees', href: '/committees', sectionId: 'committee' },
    { name: 'Gallery', href: '/gallery', sectionId: 'gallery' },
  ];

  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Handle navigation - smooth scroll on home page, regular navigation on other pages
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
    if (isHomePage && item.sectionId) {
      e.preventDefault();
      const section = document.getElementById(item.sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setMobileMenuOpen(false);
      }
    } else if (!isHomePage && item.href === '/' && item.sectionId) {
      // If not on home page and clicking home sections, navigate to home
      return;
    }
  };

  // Intersection observer for tracking active section on home page
  useEffect(() => {
    if (!isHomePage) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    const sections = ['hero', 'about', 'statistics', 'committee', 'gallery', 'contact'];
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [isHomePage]);

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return;
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-black/30 backdrop-blur-sm'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            {settings?.logo ? (
              <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
                <Image 
                  src={settings.logo} 
                  alt={settings.siteName || 'Logo'} 
                  fill 
                  className="object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="relative w-10 h-10 transition-transform group-hover:scale-105 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            )}
            <span className={`text-base sm:text-lg md:text-xl font-semibold hidden sm:block ${
              scrolled ? 'text-gray-800' : 'text-white'
            }`}>
              {settings?.siteName || 'Amanat-E-Nazirpara'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = isHomePage 
                ? activeSection === item.sectionId 
                : pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`font-medium transition-colors relative group ${
                    scrolled ? 'text-gray-700 hover:text-primary-700' : 'text-white hover:text-primary-300'
                  } ${isActive ? (scrolled ? 'text-primary-700' : 'text-primary-300') : ''}`}
                >
                  {item.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 transition-all ${isActive ? 'w-full' : 'w-0'} ${
                    scrolled ? 'bg-primary-700' : 'bg-primary-300'
                  }`}></span>
                </Link>
              );
            })}
            <Link
              href="/#contact"
              onClick={(e) => {
                if (isHomePage) {
                  e.preventDefault();
                  const section = document.getElementById('contact');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }
              }}
              className="px-5 py-2 bg-primary-700 text-white rounded-full font-medium hover:bg-primary-800 transition-all hover:shadow-lg hover:scale-105"
            >
              Contribute Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 transition-colors ${
              scrolled ? 'text-gray-700 hover:text-primary-700' : 'text-white hover:text-primary-300'
            }`}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Drawer + Backdrop */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden h-[100vh]"
                onClick={() => setMobileMenuOpen(false)}
                aria-hidden={true}
              />

              {/* Drawer Panel */}
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.28 }}
                className="fixed top-0 right-0 z-50 h-[100vh] w-80 max-w-[90vw] bg-white shadow-xl lg:hidden flex flex-col"
                role="dialog"
                aria-modal="true"
              >
                <div className="flex items-center justify-between px-4 py-4 border-b">
                  <Link href="/" className="flex items-center space-x-3">
                    {settings?.logo ? (
                      <div className="relative w-9 h-9">
                        <Image 
                          src={settings.logo} 
                          alt={settings.siteName || 'Logo'} 
                          fill 
                          className="object-contain rounded-md"
                        />
                      </div>
                    ) : (
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-md flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
                        </svg>
                      </div>
                    )}
                    <span className="font-semibold">{settings?.siteName || 'Amanat-E-Nazirpara'}</span>
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <nav className="flex-1 overflow-auto py-6">
                  <div className="px-4 space-y-1">
                    {navItems.map((item) => {
                      const isActive = isHomePage 
                        ? activeSection === item.sectionId 
                        : pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={(e) => handleNavClick(e, item)}
                          className={`block px-4 py-3 rounded-lg transition-colors font-medium text-gray-800 hover:bg-primary-50 hover:text-primary-700 relative group ${isActive ? 'bg-primary-100 text-primary-700' : ''}`}
                        >
                          {item.name}
                          <span className={`absolute bottom-0 left-0 h-0.5 transition-all ${isActive ? 'w-full' : 'w-0'} ${
                            scrolled ? 'bg-primary-700' : 'bg-primary-300'
                          }`}></span>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="px-4 mt-6">
                    <Link
                      href="/#contact"
                      onClick={(e) => {
                        if (isHomePage) {
                          e.preventDefault();
                          const section = document.getElementById('contact');
                          if (section) {
                            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-center px-4 py-3 bg-primary-700 text-white rounded-full font-semibold hover:bg-primary-800 transition-colors"
                    >
                      Contribute Now
                    </Link>
                  </div>
                </nav>

                <div className="px-4 py-4 text-sm text-gray-500 border-t">
                  <p>© {new Date().getFullYear()} {settings?.siteName || 'Amanat-E-Nazirpara'}</p>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
