'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  HandCoins,
  Users,
  Images,
  MapPin,
  UserCog,
  Activity,
  Settings,
  ChevronLeft,
  X,
} from 'lucide-react';
import { NAV_ITEMS, ROUTES } from '@/lib/constants';
import { useSidebar, useAuth, useSiteSettings } from '@/lib/context';
import { hasPermission, type Permission } from '@/lib/permissions';
import { cn } from '@/lib/utils';

const iconMap = {
  LayoutDashboard,
  HandCoins,
  Users,
  Images,
  MapPin,
  UserCog,
  Activity,
  Settings,
};

// Map routes to required permissions
const routePermissions: Record<string, Permission> = {
  [ROUTES.ADMIN_CONTRIBUTIONS]: 'manage_contributions',
  [ROUTES.ADMIN_COMMITTEES]: 'manage_committees',
  [ROUTES.ADMIN_LAND_DONORS]: 'manage_land_donors',
  [ROUTES.ADMIN_GALLERY]: 'manage_gallery',
  [ROUTES.ADMIN_USERS]: 'manage_users',
  [ROUTES.ADMIN_ACTIVITY]: 'view_activity',
  [ROUTES.ADMIN_SETTINGS]: 'manage_settings',
};

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, isMobile, toggle, close } = useSidebar();
  const { user } = useAuth();
  const { settings: siteSettings } = useSiteSettings();

  // Filter nav items based on user's role permissions
  const filteredNavItems = NAV_ITEMS.filter(item => {
    // Dashboard is always visible
    if (item.href === ROUTES.DASHBOARD) return true;
    
    const requiredPermission = routePermissions[item.href];
    if (!requiredPermission) return true;
    
    return user?.role && hasPermission(user.role, requiredPermission);
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          {siteSettings.logo ? (
            <div className="relative w-8 h-8 rounded-lg overflow-hidden">
              <Image 
                src={siteSettings.logo} 
                alt={siteSettings.siteName || 'Logo'} 
                fill 
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-bold text-gray-900"
            >
              Admin Panel
            </motion.span>
          )}
        </Link>
        {isMobile && (
          <button onClick={close} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
        {!isMobile && (
          <button onClick={toggle} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ChevronLeft className={cn('w-5 h-5 text-gray-500 transition-transform', !isOpen && 'rotate-180')} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map(item => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          // For dashboard, only match exact path. For others, match prefix
          const isActive = item.href === '/admin/dashboard' 
            ? pathname === item.href 
            : pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && close()}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'text-primary-600')} />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium text-sm"
                >
                  {item.name}
                </motion.span>
              )}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {isOpen ? (
          <div className="text-xs text-gray-500 text-center">
            © 2024 Amanat-E-Nazirpara
          </div>
        ) : (
          <div className="w-2 h-2 mx-auto rounded-full bg-emerald-500" />
        )}
      </div>
    </div>
  );

  // Desktop sidebar
  if (!isMobile) {
    return (
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40 transition-all duration-300',
          isOpen ? 'w-64' : 'w-20'
        )}
      >
        <SidebarContent />
      </aside>
    );
  }

  // Mobile sidebar with overlay
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={close}
          />
          {/* Sidebar */}
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50"
          >
            <SidebarContent />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
