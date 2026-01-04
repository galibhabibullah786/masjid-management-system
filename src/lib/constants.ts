// ============================================
// APPLICATION CONSTANTS
// ============================================

export const ROUTES = {
  // Public routes
  HOME: '/',
  CONTRIBUTIONS: '/contributions',
  COMMITTEES: '/committees',
  GALLERY: '/gallery',
  
  // Admin routes
  LOGIN: '/admin/login',
  DASHBOARD: '/admin/dashboard',
  ADMIN_CONTRIBUTIONS: '/admin/dashboard/contributions',
  ADMIN_COMMITTEES: '/admin/dashboard/committees',
  ADMIN_GALLERY: '/admin/dashboard/gallery',
  ADMIN_LAND_DONORS: '/admin/dashboard/land-donors',
  ADMIN_USERS: '/admin/dashboard/users',
  ADMIN_SETTINGS: '/admin/dashboard/settings',
  ADMIN_ACTIVITY: '/admin/dashboard/activity',
} as const;

export const CONTRIBUTION_TYPES = [
  { value: 'Cash', label: 'Cash', color: 'emerald' },
  { value: 'Material', label: 'Material', color: 'blue' },
] as const;

export const CONTRIBUTION_STATUS = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'verified', label: 'Verified', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
] as const;

export const DESIGNATIONS = [
  { value: 'president', label: 'President' },
  { value: 'vice_president', label: 'Vice President' },
  { value: 'secretary', label: 'Secretary' },
  { value: 'treasurer', label: 'Treasurer' },
  { value: 'member', label: 'Executive Member' },
] as const;

export const GALLERY_CATEGORIES = [
  { value: 'Foundation', label: 'Foundation' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Events', label: 'Events' },
  { value: 'FinalLook', label: 'Final Look' },
  { value: 'Ceremony', label: 'Ceremony' },
] as const;

export const USER_ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'photographer', label: 'Photographer' },
] as const;

export const NAV_ITEMS = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
  { name: 'Contributions', href: ROUTES.ADMIN_CONTRIBUTIONS, icon: 'HandCoins' },
  { name: 'Committees', href: ROUTES.ADMIN_COMMITTEES, icon: 'Users' },
  { name: 'Gallery', href: ROUTES.ADMIN_GALLERY, icon: 'Images' },
  { name: 'Land Donors', href: ROUTES.ADMIN_LAND_DONORS, icon: 'MapPin' },
  { name: 'Users', href: ROUTES.ADMIN_USERS, icon: 'UserCog' },
  { name: 'Activity', href: ROUTES.ADMIN_ACTIVITY, icon: 'Activity' },
  { name: 'Settings', href: ROUTES.ADMIN_SETTINGS, icon: 'Settings' },
] as const;

export const LAND_UNITS = [
// Bangladesh standard land units
// 1 Bigha = 20 Katha (in Bangladesh)
// 1 Katha = 1.65 Decimal (approximately)
// 1 Acre = 100 Decimal
// 1 Decimal = 435.6 Square Feet
  { value: 'decimal', label: 'শতাংশ (Decimal)' },
  { value: 'katha', label: 'কাঠা (Katha)' },
  { value: 'bigha', label: 'বিঘা (Bigha)' },
  { value: 'acre', label: 'একর (Acre)' },
  { value: 'sqft', label: 'বর্গফুট (Sq Feet)' },
] as const;

// Standard unit for display is Decimal (most common in Bangladesh)
export const STANDARD_LAND_UNIT = 'decimal';

// Conversion rates to Decimal (the standard unit)
export const LAND_UNIT_TO_DECIMAL: Record<string, number> = {
  decimal: 1,
  katha: 1.65,        // 1 Katha = 1.65 Decimal
  bigha: 33,          // 1 Bigha = 20 Katha = 33 Decimal
  acre: 100,          // 1 Acre = 100 Decimal
  sqft: 0.002296,     // 1 Sq Ft = 0.002296 Decimal (1/435.6)
};
