'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { AdminUser, Toast } from './types';
import { authApi } from './api';

// ============================================
// AUTH CONTEXT
// ============================================
interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const response = await authApi.getProfile();
        if (isMounted && response.success && response.data) {
          setUser(response.data);
        }
      } catch {
        // Not authenticated - user stays null
      } finally {
        if (isMounted) {
          setIsInitialized(true);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(email, password);
      if (response.success && response.data) {
        setUser(response.data.user);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    } finally {
      setUser(null);
      setIsLoading(false);
      // Redirect to login after logout
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        isLoading,
        isInitialized,
        login, 
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be within AuthProvider');
  return ctx;
}

// ============================================
// TOAST CONTEXT
// ============================================
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be within ToastProvider');
  return ctx;
}

// ============================================
// SIDEBAR CONTEXT
// ============================================
interface SidebarContextType {
  isOpen: boolean;
  isMobile: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) setIsOpen(false);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const toggle = useCallback(() => setIsOpen(p => !p), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <SidebarContext.Provider value={{ isOpen, isMobile, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be within SidebarProvider');
  return ctx;
}

// ============================================
// SITE SETTINGS CONTEXT
// ============================================
interface SiteSettingsState {
  siteName?: string;
  logo?: string;
  favicon?: string;
}

interface SiteSettingsContextType {
  settings: SiteSettingsState;
  updateSettings: (settings: Partial<SiteSettingsState>) => void;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettingsState>({});

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/public/settings');
      const data = await response.json();
      if (data.success && data.data) {
        setSettings({
          siteName: data.data.siteName,
          logo: data.data.logo,
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
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = useCallback((newSettings: Partial<SiteSettingsState>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      // Update favicon if it changed
      if (newSettings.favicon) {
        updateFavicon(newSettings.favicon);
      }
      return updated;
    });
  }, []);

  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
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

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error('useSiteSettings must be within SiteSettingsProvider');
  return ctx;
}

// ============================================
// COMBINED PROVIDER
// ============================================
export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <SiteSettingsProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </SiteSettingsProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
