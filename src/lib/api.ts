import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import type { ApiResponse, AdminUser, Committee, Contribution, LandDonor, GalleryImage, ActivityLog, DashboardStats, SiteSettings, UploadResult } from './types';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(undefined);
    }
  });
  failedQueue = [];
};

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry for auth endpoints
      if (originalRequest.url?.includes('/auth/login') || 
          originalRequest.url?.includes('/auth/refresh') ||
          originalRequest.url?.includes('/auth/logout')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        processQueue();
        return apiClient(originalRequest);
      } catch {
        processQueue(error);
        // Redirect to login on refresh failure
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin/dashboard')) {
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// AUTH API
// ============================================
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<never, ApiResponse<{ user: AdminUser; accessToken: string }>>('/auth/login', { email, password }),

  logout: () => apiClient.post<never, ApiResponse>('/auth/logout'),

  refresh: () => apiClient.post<never, ApiResponse<{ accessToken: string }>>('/auth/refresh'),

  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) =>
    apiClient.post<never, ApiResponse>('/auth/change-password', { currentPassword, newPassword, confirmPassword }),

  getProfile: () => apiClient.get<never, ApiResponse<AdminUser>>('/auth/me'),
};

// ============================================
// USERS API
// ============================================
interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export const usersApi = {
  getAll: (params?: PaginationParams) =>
    apiClient.get<never, ApiResponse<AdminUser[]>>('/users', { params }),

  getById: (id: string) => apiClient.get<never, ApiResponse<AdminUser>>(`/users/${id}`),

  create: (data: { email: string; password: string; name: string; role?: string; phone?: string }) =>
    apiClient.post<never, ApiResponse<AdminUser>>('/users', data),

  update: (id: string, data: Partial<{ email: string; name: string; role: string; phone: string; isActive: boolean }>) =>
    apiClient.put<never, ApiResponse<AdminUser>>(`/users/${id}`, data),

  delete: (id: string) => apiClient.delete<never, ApiResponse>(`/users/${id}`),
};

// ============================================
// COMMITTEES API
// ============================================
export const committeesApi = {
  getAll: (params?: PaginationParams & { type?: string }) =>
    apiClient.get<never, ApiResponse<Committee[]>>('/committees', { params }),

  getById: (id: string) => apiClient.get<never, ApiResponse<Committee>>(`/committees/${id}`),

  create: (data: { name: string; term: string; description?: string; type?: 'past' | 'current'; image?: string }) =>
    apiClient.post<never, ApiResponse<Committee>>('/committees', data),

  update: (id: string, data: Partial<{ name: string; term: string; description: string; type: 'past' | 'current'; isActive: boolean; image: string }>) =>
    apiClient.put<never, ApiResponse<Committee>>(`/committees/${id}`, data),

  delete: (id: string) => apiClient.delete<never, ApiResponse>(`/committees/${id}`),

  addMember: (committeeId: string, data: { name: string; designation: string; designationLabel: string; photo?: string; phone?: string; email?: string; bio?: string; order?: number }) =>
    apiClient.post<never, ApiResponse<Committee>>(`/committees/${committeeId}/members`, data),

  updateMember: (committeeId: string, memberId: string, data: Partial<{ name: string; designation: string; designationLabel: string; photo: string; phone: string; email: string; bio: string; order: number }>) =>
    apiClient.put<never, ApiResponse<Committee>>(`/committees/${committeeId}/members/${memberId}`, data),

  deleteMember: (committeeId: string, memberId: string) =>
    apiClient.delete<never, ApiResponse<Committee>>(`/committees/${committeeId}/members/${memberId}`),

  // Alias for deleteMember
  removeMember: (committeeId: string, memberId: string) =>
    apiClient.delete<never, ApiResponse<Committee>>(`/committees/${committeeId}/members/${memberId}`),
};

// ============================================
// CONTRIBUTIONS API
// ============================================
export const contributionsApi = {
  getAll: (params?: PaginationParams & { type?: string; status?: string; anonymous?: string }) =>
    apiClient.get<never, ApiResponse<Contribution[]>>('/contributions', { params }),

  getById: (id: string) => apiClient.get<never, ApiResponse<Contribution>>(`/contributions/${id}`),

  create: (data: { contributorName: string; type: 'Cash' | 'Material'; amount: number; date: string; anonymous?: boolean; purpose?: string; notes?: string }) =>
    apiClient.post<never, ApiResponse<Contribution>>('/contributions', data),

  update: (id: string, data: Partial<Contribution>) =>
    apiClient.put<never, ApiResponse<Contribution>>(`/contributions/${id}`, data),

  updateStatus: (id: string, status: 'pending' | 'verified' | 'rejected', notes?: string) =>
    apiClient.patch<never, ApiResponse<Contribution>>(`/contributions/${id}/status`, { status, notes }),

  delete: (id: string) => apiClient.delete<never, ApiResponse>(`/contributions/${id}`),

  getStatistics: () => apiClient.get<never, ApiResponse<{ totalContributions: number; verifiedContributions: number; pendingContributions: number; rejectedContributions: number; totalAmount: number; cashAmount: number; landAmount: number; materialAmount: number }>>('/contributions/statistics'),
};

// ============================================
// LAND DONORS API
// ============================================
export const landDonorsApi = {
  getAll: (params?: PaginationParams & { verified?: string }) =>
    apiClient.get<never, ApiResponse<LandDonor[]>>('/land-donors', { params }),

  getById: (id: string) => apiClient.get<never, ApiResponse<LandDonor>>(`/land-donors/${id}`),

  create: (data: { name: string; landAmount: number; unit: string; location: string; date: string; quote?: string; notes?: string; photo?: string }) =>
    apiClient.post<never, ApiResponse<LandDonor>>('/land-donors', data),

  update: (id: string, data: Partial<LandDonor>) =>
    apiClient.put<never, ApiResponse<LandDonor>>(`/land-donors/${id}`, data),

  toggleVerified: (id: string, verified: boolean) =>
    apiClient.patch<never, ApiResponse<LandDonor>>(`/land-donors/${id}/verify`, { verified }),

  delete: (id: string) => apiClient.delete<never, ApiResponse>(`/land-donors/${id}`),
};

// ============================================
// GALLERY API
// ============================================
export const galleryApi = {
  getAll: (params?: PaginationParams & { category?: string; featured?: string }) =>
    apiClient.get<never, ApiResponse<GalleryImage[]>>('/gallery', { params }),

  getById: (id: string) => apiClient.get<never, ApiResponse<GalleryImage>>(`/gallery/${id}`),

  create: (data: { url: string; publicId: string; category: string; alt: string; description?: string; date?: string; featured?: boolean; order?: number }) =>
    apiClient.post<never, ApiResponse<GalleryImage>>('/gallery', data),

  update: (id: string, data: Partial<GalleryImage>) =>
    apiClient.put<never, ApiResponse<GalleryImage>>(`/gallery/${id}`, data),

  toggleFeatured: (id: string, featured: boolean) =>
    apiClient.patch<never, ApiResponse<GalleryImage>>(`/gallery/${id}/featured`, { featured }),

  delete: (id: string) => apiClient.delete<never, ApiResponse>(`/gallery/${id}`),
};

// ============================================
// SETTINGS API
// ============================================
export const settingsApi = {
  get: () => apiClient.get<never, ApiResponse<SiteSettings>>('/settings'),

  update: (data: Partial<SiteSettings>) =>
    apiClient.put<never, ApiResponse<SiteSettings>>('/settings', data),

  updatePrayerTimes: (times: { fajr?: string; dhuhr?: string; asr?: string; maghrib?: string; isha?: string }) =>
    apiClient.patch<never, ApiResponse<SiteSettings>>('/settings/prayer-times', times),
};

// ============================================
// ACTIVITY API
// ============================================
export const activityApi = {
  getAll: (params?: PaginationParams & { type?: string }) =>
    apiClient.get<never, ApiResponse<ActivityLog[]>>('/activity', { params }),

  getRecent: (limit?: number) =>
    apiClient.get<never, ApiResponse<ActivityLog[]>>('/activity/recent', { params: { limit } }),

  markAsRead: (ids?: string[], markAll?: boolean) =>
    apiClient.post<never, ApiResponse>('/activity/mark-read', { ids, markAll }),
};

// ============================================
// STATISTICS API
// ============================================
export const statisticsApi = {
  getDashboard: () => apiClient.get<never, ApiResponse<DashboardStats>>('/statistics/dashboard'),
};

// ============================================
// UPLOAD API
// ============================================
export const uploadApi = {
  upload: async (file: File, folder: 'gallery' | 'avatars' | 'members' | 'committees' | 'settings'): Promise<ApiResponse<UploadResult>> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/upload/${folder}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ============================================
// PUBLIC API (No auth required)
// ============================================
export const publicApi = {
  getStatistics: () => axios.get<ApiResponse<{ totalFunds: number; landDonated: number; totalContributors: number; siteName: string; tagline?: string }>>('/api/public/statistics').then(res => res.data),

  getContributions: (params?: { page?: number; limit?: number; type?: string }) =>
    axios.get<ApiResponse<Contribution[]>>('/api/public/contributions', { params }).then(res => res.data),

  getCommittees: (params?: { type?: string }) =>
    axios.get<ApiResponse<Committee[]>>('/api/public/committees', { params }).then(res => res.data),

  getCurrentCommittee: () =>
    axios.get<ApiResponse<Committee>>('/api/public/committees/current').then(res => res.data),

  getGallery: (params?: { page?: number; limit?: number; category?: string; featured?: string }) =>
    axios.get<ApiResponse<GalleryImage[]>>('/api/public/gallery', { params }).then(res => res.data),

  getLandDonors: (params?: { page?: number; limit?: number }) =>
    axios.get<ApiResponse<LandDonor[]>>('/api/public/land-donors', { params }).then(res => res.data),

  getSettings: () =>
    axios.get<ApiResponse<SiteSettings>>('/api/public/settings').then(res => res.data),
};

// ============================================
// FRONTEND PUBLIC API (for public pages)
// Wrapper with convenient names matching the frontend code
// ============================================
export const api = {
  // Statistics
  getStatistics: async () => {
    const res = await publicApi.getStatistics();
    return res.data;
  },

  // Contributions
  getContributions: async (params?: { page?: number; limit?: number; type?: string }) => {
    const res = await publicApi.getContributions(params);
    return { data: res.data, total: (res as unknown as { total?: number }).total || 0 };
  },

  getContributionStats: async () => {
    const stats = await publicApi.getStatistics();
    return {
      totalAmount: stats.data?.totalFunds || 0,
      contributorCount: stats.data?.totalContributors || 0,
      landDonated: stats.data?.landDonated || 0,
    };
  },

  // Committees
  getAllCommittees: async () => {
    const res = await publicApi.getCommittees();
    return res.data || [];
  },

  getCurrentCommittee: async () => {
    const res = await publicApi.getCurrentCommittee();
    return res.data;
  },

  // Gallery
  getGalleryImages: async (params?: { page?: number; limit?: number; category?: string }) => {
    const res = await publicApi.getGallery(params);
    return { data: res.data || [], total: (res as unknown as { total?: number }).total || 0 };
  },

  getGalleryCategories: async () => {
    const res = await publicApi.getGallery();
    const categories = [...new Set((res.data || []).map((img: GalleryImage) => img.category))];
    return categories.filter(Boolean).map(cat => ({ category: cat as string }));
  },

  getFeaturedImages: async () => {
    const res = await publicApi.getGallery({ featured: 'true', limit: 6 });
    return res.data || [];
  },

  // Land donors
  getAllLandDonors: async () => {
    const res = await publicApi.getLandDonors({ limit: 100 });
    return res.data || [];
  },

  // Settings
  getSettings: async () => {
    const res = await publicApi.getSettings();
    return res.data;
  },

  // Contact
  sendContactForm: async (data: {
    name: string;
    email: string;
    phone?: string;
    contributionType: string;
    amount?: string;
    message?: string;
  }) => {
    const res = await apiClient.post<never, ApiResponse>('/contact', data);
    return res;
  },
};

export default apiClient;
