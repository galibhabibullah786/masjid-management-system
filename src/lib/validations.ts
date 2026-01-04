import { z } from 'zod';

// ============================================
// AUTH SCHEMAS
// ============================================
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// ============================================
// USER SCHEMAS
// ============================================
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['super_admin', 'admin', 'photographer']).optional(),
  phone: z.string().optional(),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  role: z.enum(['super_admin', 'admin', 'photographer']).optional(),
  phone: z.string().optional(),
  isActive: z.boolean().optional(),
});

// ============================================
// CONTRIBUTION SCHEMAS
// ============================================
export const createContributionSchema = z.object({
  contributorName: z.string().min(2, 'Contributor name is required'),
  type: z.enum(['Cash', 'Material']),
  amount: z.number().positive('Amount must be positive'),
  date: z.string().or(z.date()),
  anonymous: z.boolean().optional(),
  purpose: z.string().optional(),
  notes: z.string().optional(),
});

export const updateContributionSchema = z.object({
  contributorName: z.string().min(2).optional(),
  type: z.enum(['Cash', 'Material']).optional(),
  amount: z.number().positive().optional(),
  date: z.string().or(z.date()).optional(),
  anonymous: z.boolean().optional(),
  purpose: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['pending', 'verified', 'rejected']).optional(),
});

export const updateContributionStatusSchema = z.object({
  status: z.enum(['pending', 'verified', 'rejected']),
  notes: z.string().optional(),
});

// ============================================
// COMMITTEE SCHEMAS
// ============================================
export const committeeMemberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  designation: z.enum(['president', 'vice_president', 'secretary', 'treasurer', 'member']),
  designationLabel: z.string().min(1, 'Designation label is required'),
  photo: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  bio: z.string().optional(),
  order: z.number().optional(),
});

export const createCommitteeSchema = z.object({
  name: z.string().min(2, 'Committee name is required'),
  term: z.string().min(1, 'Term is required'),
  description: z.string().optional(),
  type: z.enum(['past', 'current']).optional(),
  members: z.array(committeeMemberSchema).optional(),
});

export const updateCommitteeSchema = z.object({
  name: z.string().min(2).optional(),
  term: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['past', 'current']).optional(),
});

// ============================================
// LAND DONOR SCHEMAS
// ============================================
export const createLandDonorSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  landAmount: z.number().positive('Land amount must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  location: z.string().min(1, 'Location is required'),
  date: z.string().or(z.date()),
  quote: z.string().optional(),
  notes: z.string().optional(),
  photo: z.string().optional(),
});

export const updateLandDonorSchema = z.object({
  name: z.string().min(2).optional(),
  landAmount: z.number().positive().optional(),
  unit: z.string().optional(),
  location: z.string().optional(),
  date: z.string().or(z.date()).optional(),
  quote: z.string().optional(),
  notes: z.string().optional(),
  photo: z.string().optional(),
  verified: z.boolean().optional(),
});

// ============================================
// GALLERY SCHEMAS
// ============================================
export const createGalleryImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  publicId: z.string().min(1, 'Public ID is required'),
  category: z.enum(['Foundation', 'Construction', 'Events', 'FinalLook', 'Ceremony']),
  alt: z.string().min(1, 'Alt text is required'),
  description: z.string().optional(),
  date: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

export const updateGalleryImageSchema = z.object({
  category: z.enum(['Foundation', 'Construction', 'Events', 'FinalLook', 'Ceremony']).optional(),
  alt: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  featured: z.boolean().optional(),
  order: z.number().optional(),
});

// ============================================
// SETTINGS SCHEMAS
// ============================================
export const updateSettingsSchema = z.object({
  siteName: z.string().optional(),
  tagline: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  facebookUrl: z.string().url().optional().or(z.literal('')),
  youtubeUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  showAnonymousDonors: z.boolean().optional(),
  enableGallery: z.boolean().optional(),
});

export const updatePrayerTimesSchema = z.object({
  prayerFajr: z.string().optional(),
  prayerDhuhr: z.string().optional(),
  prayerAsr: z.string().optional(),
  prayerMaghrib: z.string().optional(),
  prayerIsha: z.string().optional(),
});

// ============================================
// EXPORT TYPES
// ============================================
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateContributionInput = z.infer<typeof createContributionSchema>;
export type UpdateContributionInput = z.infer<typeof updateContributionSchema>;
export type CreateCommitteeInput = z.infer<typeof createCommitteeSchema>;
export type UpdateCommitteeInput = z.infer<typeof updateCommitteeSchema>;
export type CommitteeMemberInput = z.infer<typeof committeeMemberSchema>;
export type CreateLandDonorInput = z.infer<typeof createLandDonorSchema>;
export type UpdateLandDonorInput = z.infer<typeof updateLandDonorSchema>;
export type CreateGalleryImageInput = z.infer<typeof createGalleryImageSchema>;
export type UpdateGalleryImageInput = z.infer<typeof updateGalleryImageSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
