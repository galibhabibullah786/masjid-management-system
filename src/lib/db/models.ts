import mongoose, { Schema, Document, Model } from 'mongoose';

// ============================================
// ENUMS
// ============================================
export const UserRole = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  PHOTOGRAPHER: 'photographer',
} as const;

export const ContributionType = {
  CASH: 'Cash',
  MATERIAL: 'Material',
} as const;

export const ContributionStatus = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
} as const;

export const CommitteeType = {
  PAST: 'past',
  CURRENT: 'current',
} as const;

export const MemberDesignation = {
  PRESIDENT: 'president',
  VICE_PRESIDENT: 'vice_president',
  SECRETARY: 'secretary',
  TREASURER: 'treasurer',
  MEMBER: 'member',
} as const;

export const GalleryCategory = {
  FOUNDATION: 'Foundation',
  CONSTRUCTION: 'Construction',
  EVENTS: 'Events',
  FINAL_LOOK: 'FinalLook',
  CEREMONY: 'Ceremony',
} as const;

export const ActivityType = {
  CONTRIBUTION: 'contribution',
  COMMITTEE: 'committee',
  GALLERY: 'gallery',
  SETTINGS: 'settings',
  USER: 'user',
  DELETE: 'delete',
} as const;

// ============================================
// USER MODEL
// ============================================
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: (typeof UserRole)[keyof typeof UserRole];
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: Object.values(UserRole), default: UserRole.PHOTOGRAPHER },
    avatar: { type: String },
    phone: { type: String },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

// ============================================
// REFRESH TOKEN MODEL
// ============================================
export interface IRefreshToken extends Document {
  token: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

RefreshTokenSchema.index({ userId: 1 });
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken: Model<IRefreshToken> =
  mongoose.models.RefreshToken || mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);

// ============================================
// COMMITTEE MODEL
// ============================================
export interface ICommitteeMember {
  _id?: mongoose.Types.ObjectId;
  name: string;
  designation: (typeof MemberDesignation)[keyof typeof MemberDesignation];
  designationLabel: string;
  photo?: string;
  phone?: string;
  email?: string;
  bio?: string;
  order: number;
}

export interface ICommittee extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  term: string;
  description?: string;
  type: (typeof CommitteeType)[keyof typeof CommitteeType];
  members: ICommitteeMember[];
  createdAt: Date;
  updatedAt: Date;
}

const CommitteeMemberSchema = new Schema<ICommitteeMember>({
  name: { type: String, required: true },
  designation: { type: String, enum: Object.values(MemberDesignation), required: true },
  designationLabel: { type: String, required: true },
  photo: { type: String },
  phone: { type: String },
  email: { type: String },
  bio: { type: String },
  order: { type: Number, default: 0 },
});

const CommitteeSchema = new Schema<ICommittee>(
  {
    name: { type: String, required: true },
    term: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: Object.values(CommitteeType), default: CommitteeType.CURRENT },
    members: [CommitteeMemberSchema],
  },
  { timestamps: true }
);

export const Committee: Model<ICommittee> =
  mongoose.models.Committee || mongoose.model<ICommittee>('Committee', CommitteeSchema);

// ============================================
// CONTRIBUTION MODEL
// ============================================
export interface IContribution extends Document {
  _id: mongoose.Types.ObjectId;
  contributorName: string;
  type: (typeof ContributionType)[keyof typeof ContributionType];
  amount: number;
  date: Date;
  anonymous: boolean;
  purpose?: string;
  notes?: string;
  receiptNumber: string;
  status: (typeof ContributionStatus)[keyof typeof ContributionStatus];
  createdAt: Date;
  updatedAt: Date;
}

const ContributionSchema = new Schema<IContribution>(
  {
    contributorName: { type: String, required: true },
    type: { type: String, enum: Object.values(ContributionType), required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    anonymous: { type: Boolean, default: false },
    purpose: { type: String },
    notes: { type: String },
    receiptNumber: { type: String, required: true, unique: true },
    status: { type: String, enum: Object.values(ContributionStatus), default: ContributionStatus.PENDING },
  },
  { timestamps: true }
);

ContributionSchema.index({ date: -1 });
ContributionSchema.index({ status: 1 });
ContributionSchema.index({ type: 1 });
ContributionSchema.index({ receiptNumber: 1 });

export const Contribution: Model<IContribution> =
  mongoose.models.Contribution || mongoose.model<IContribution>('Contribution', ContributionSchema);

// ============================================
// LAND DONOR MODEL
// ============================================
export interface ILandDonor extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  landAmount: number;
  unit: string;
  location: string;
  quote?: string;
  date: Date;
  notes?: string;
  verified: boolean;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LandDonorSchema = new Schema<ILandDonor>(
  {
    name: { type: String, required: true },
    landAmount: { type: Number, required: true },
    unit: { type: String, required: true, default: 'decimal' },
    location: { type: String, required: true },
    quote: { type: String },
    date: { type: Date, required: true },
    notes: { type: String },
    verified: { type: Boolean, default: false },
    photo: { type: String },
  },
  { timestamps: true }
);

export const LandDonor: Model<ILandDonor> =
  mongoose.models.LandDonor || mongoose.model<ILandDonor>('LandDonor', LandDonorSchema);

// ============================================
// GALLERY IMAGE MODEL
// ============================================
export interface IGalleryImage extends Document {
  _id: mongoose.Types.ObjectId;
  url: string;
  publicId: string; // Cloudinary public ID for deletion
  category: (typeof GalleryCategory)[keyof typeof GalleryCategory];
  alt: string;
  description?: string;
  date?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema = new Schema<IGalleryImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    category: { type: String, enum: Object.values(GalleryCategory), required: true },
    alt: { type: String, required: true },
    description: { type: String },
    date: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

GalleryImageSchema.index({ category: 1 });
GalleryImageSchema.index({ featured: 1 });

export const GalleryImage: Model<IGalleryImage> =
  mongoose.models.GalleryImage || mongoose.model<IGalleryImage>('GalleryImage', GalleryImageSchema);

// ============================================
// ACTIVITY LOG MODEL
// ============================================
export interface IActivityLog extends Document {
  _id: mongoose.Types.ObjectId;
  action: string;
  type: (typeof ActivityType)[keyof typeof ActivityType];
  entityId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  details?: string;
  timestamp: Date;
  read: boolean;
}

const ActivityLogSchema = new Schema<IActivityLog>({
  action: { type: String, required: true },
  type: { type: String, enum: Object.values(ActivityType), required: true },
  entityId: { type: Schema.Types.ObjectId },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

ActivityLogSchema.index({ timestamp: -1 });
ActivityLogSchema.index({ type: 1 });

export const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);

// ============================================
// SITE SETTINGS MODEL
// ============================================
export interface ISiteSettings extends Document {
  _id: mongoose.Types.ObjectId;
  siteName: string;
  tagline?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  twitterUrl?: string;
  prayerFajr?: string;
  prayerDhuhr?: string;
  prayerAsr?: string;
  prayerMaghrib?: string;
  prayerIsha?: string;
  logo?: string;
  logoPublicId?: string;
  favicon?: string;
  faviconPublicId?: string;
  maintenanceMode: boolean;
  showAnonymousDonors: boolean;
  enableGallery: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: { type: String, default: 'Amanat-E-Nazirpara' },
    tagline: { type: String },
    description: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    facebookUrl: { type: String },
    youtubeUrl: { type: String },
    twitterUrl: { type: String },
    prayerFajr: { type: String },
    prayerDhuhr: { type: String },
    prayerAsr: { type: String },
    prayerMaghrib: { type: String },
    prayerIsha: { type: String },
    logo: { type: String },
    logoPublicId: { type: String },
    favicon: { type: String },
    faviconPublicId: { type: String },
    maintenanceMode: { type: Boolean, default: false },
    showAnonymousDonors: { type: Boolean, default: true },
    enableGallery: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

// ============================================
// STATISTICS CACHE MODEL
// ============================================
export interface IStatisticsCache extends Document {
  _id: mongoose.Types.ObjectId;
  totalFunds: number;
  landDonated: number;
  totalContributors: number;
  pendingContributions: number;
  totalCommittees: number;
  galleryImages: number;
  lastUpdated: Date;
}

const StatisticsCacheSchema = new Schema<IStatisticsCache>({
  totalFunds: { type: Number, default: 0 },
  landDonated: { type: Number, default: 0 },
  totalContributors: { type: Number, default: 0 },
  pendingContributions: { type: Number, default: 0 },
  totalCommittees: { type: Number, default: 0 },
  galleryImages: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

export const StatisticsCache: Model<IStatisticsCache> =
  mongoose.models.StatisticsCache || mongoose.model<IStatisticsCache>('StatisticsCache', StatisticsCacheSchema);
