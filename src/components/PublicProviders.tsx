'use client';

import { useEffect, useState, ReactNode } from 'react';

interface SiteSettings {
  favicon?: string;
}

export function PublicProviders({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/public/settings');
        const data = await response.json();
        if (data.success && data.data) {
          setSettings({
            favicon: data.data.favicon,
          });
          
          // Update favicon in document head
          if (data.data.favicon) {
            updateFavicon(data.data.favicon);
          }
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      }
    };
    
    fetchSettings();
  }, []);

  return <>{children}</>;
}

function updateFavicon(faviconUrl: string) {
  if (typeof document === 'undefined') return;
  
  // Remove existing favicons
  const existingLinks = document.querySelectorAll('link[rel*="icon"]');
  existingLinks.forEach(link => link.remove());
  
  // Add new favicon
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = faviconUrl;
  document.head.appendChild(link);
}
