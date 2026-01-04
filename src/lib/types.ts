// ============================================
// SHARED TYPES & INTERFACES
// ============================================

export interface BaseEntity {
  _id: string;
  id?: string | number; // Virtual id for compatibility
  createdAt?: string;
  updatedAt?: string;
}

// Authentication
export interface AdminUser extends BaseEntity {
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'photographer';
  avatar?: string;
  phone?: string;
  lastLogin?: string;
  isActive: boolean;
}

// Committee
export interface CommitteeMember {
  _id?: string;
  id?: string | number; // Virtual id for compatibility
  name: string;
  designation: 'president' | 'vice-president' | 'secretary' | 'treasurer' | 'member';
  designationLabel: string;
  photo?: string;
  phone?: string;
  email?: string;
  bio?: string;
  order: number;
}

export interface Committee extends BaseEntity {
  name: string;
  term: string;
  description?: string;
  type: 'past' | 'current';
  members: CommitteeMember[];
}

// Contributions
export interface Contribution extends BaseEntity {
  contributorName: string;
  type: 'Cash' | 'Material';
  amount: number;
  date: string;
  anonymous: boolean;
  purpose?: string;
  notes?: string;
  receiptNumber: string;
  status: 'pending' | 'verified' | 'rejected';
}

// Land Donors
export interface LandDonor extends BaseEntity {
  name: string;
  landAmount: number;
  unit: string;
  location: string;
  quote?: string;
  date: string;
  notes?: string;
  verified: boolean;
  photo?: string;
}

// Gallery
export interface GalleryImage extends BaseEntity {
  url: string;
  publicId: string;
  category: 'Foundation' | 'Construction' | 'Events' | 'Final Look' | 'Ceremony';
  alt: string;
  description?: string;
  date?: string;
  featured: boolean;
  order: number;
}

// Statistics
export interface DashboardStats {
  totalFunds: number;
  landDonated: number;
  totalContributors: number;
  pendingContributions: number;
  monthlyGrowth: number;
  totalCommittees: number;
  galleryImages: number;
  monthlyData?: { month: string; amount: number; count: number }[];
}

// Public statistics (for frontend)
export interface Statistics {
  totalFunds: number;
  landDonated: number;
  totalContributors: number;
  siteName?: string;
  tagline?: string;
}

// Contribution stats for public page
export interface ContributionStats {
  totalAmount: number;
  contributorCount: number;
  landDonated: number;
}

// Activity
export interface ActivityLog extends BaseEntity {
  action: string;
  type: 'contribution' | 'committee' | 'gallery' | 'settings' | 'user' | 'delete';
  entityId?: string;
  userId: string;
  userName: string;
  timestamp: string;
  details?: string;
  read: boolean;
}

// Settings
export interface SiteSettings {
  siteName: string;
  tagline?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  socialLinks: {
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  prayerTimes: {
    fajr?: string;
    dhuhr?: string;
    asr?: string;
    maghrib?: string;
    isha?: string;
  };
  logo?: string;
  favicon?: string;
  maintenanceMode: boolean;
  showAnonymousDonors: boolean;
  enableGallery: boolean;
}

// Table
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  className?: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

// Notification / Toast
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  errors?: Record<string, string[]>;
}

// Upload result
export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}
