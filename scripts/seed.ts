import 'dotenv/config';
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amanat-e-nazirpara';

// ============================================
// SCHEMAS
// ============================================

// User Schema
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ['super_admin', 'admin', 'photographer'], default: 'photographer' },
  avatar: { type: String },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
}, { timestamps: true });

// Site Settings Schema
const SiteSettingsSchema = new Schema({
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
}, { timestamps: true });

// Committee Schema
const CommitteeMemberSchema = new Schema({
  name: { type: String, required: true },
  designation: { type: String, enum: ['president', 'vice_president', 'secretary', 'treasurer', 'member'], required: true },
  designationLabel: { type: String, required: true },
  photo: { type: String },
  phone: { type: String },
  email: { type: String },
  bio: { type: String },
  order: { type: Number, default: 0 },
});

const CommitteeSchema = new Schema({
  name: { type: String, required: true },
  term: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  type: { type: String, enum: ['past', 'current'], default: 'current' },
  isActive: { type: Boolean, default: true },
  members: [CommitteeMemberSchema],
}, { timestamps: true });

// Contribution Schema
const ContributionSchema = new Schema({
  contributorName: { type: String, required: true },
  type: { type: String, enum: ['Cash', 'Material'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  anonymous: { type: Boolean, default: false },
  purpose: { type: String },
  notes: { type: String },
  receiptNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
}, { timestamps: true });

// Land Donor Schema
const LandDonorSchema = new Schema({
  name: { type: String, required: true },
  landAmount: { type: Number, required: true },
  unit: { type: String, required: true, default: 'decimal' },
  location: { type: String, required: true },
  quote: { type: String },
  date: { type: Date, required: true },
  notes: { type: String },
  verified: { type: Boolean, default: false },
  photo: { type: String },
}, { timestamps: true });

// Gallery Image Schema
const GalleryImageSchema = new Schema({
  url: { type: String, required: true },
  publicId: { type: String, required: true },
  category: { type: String, enum: ['Foundation', 'Construction', 'Events', 'FinalLook', 'Ceremony'], required: true },
  alt: { type: String, required: true },
  description: { type: String },
  date: { type: String },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

// Activity Log Schema
const ActivityLogSchema = new Schema({
  action: { type: String, required: true },
  type: { type: String, enum: ['contribution', 'committee', 'gallery', 'settings', 'user', 'delete'], required: true },
  entityId: { type: Schema.Types.ObjectId },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

// ============================================
// MODELS
// ============================================
const User = mongoose.models.User || mongoose.model('User', UserSchema);
const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
const Committee = mongoose.models.Committee || mongoose.model('Committee', CommitteeSchema);
const Contribution = mongoose.models.Contribution || mongoose.model('Contribution', ContributionSchema);
const LandDonor = mongoose.models.LandDonor || mongoose.model('LandDonor', LandDonorSchema);
const GalleryImage = mongoose.models.GalleryImage || mongoose.model('GalleryImage', GalleryImageSchema);
const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);

// ============================================
// HELPER FUNCTIONS
// ============================================
function generateReceiptNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `RCP-${timestamp}-${random}`;
}

// ============================================
// SEED FUNCTION
// ============================================
async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Create super admin user
    console.log('\n📦 Seeding Users...');
    const existingAdmin = await User.findOne({ email: 'admin@amanat.com' });
    
    let adminUser;
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      adminUser = await User.create({
        email: 'admin@amanat.com',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'super_admin',
        isActive: true,
      });
      console.log('   ✓ Created super admin user:', adminUser.email);
    } else {
      adminUser = existingAdmin;
      console.log('   ✓ Super admin user already exists');
    }

    // Create additional sample users
    const sampleUsers = [
      { email: 'admin2@amanat.com', name: 'Admin User', role: 'admin' },
      { email: 'photographer@amanat.com', name: 'Photo Editor', role: 'photographer' },
    ];

    for (const userData of sampleUsers) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        const hashedPassword = await bcrypt.hash('password123', 12);
        await User.create({ ...userData, password: hashedPassword, isActive: true });
        console.log(`   ✓ Created ${userData.role}:`, userData.email);
      }
    }

    // 2. Create default site settings
    console.log('\n📦 Seeding Site Settings...');
    const existingSettings = await SiteSettings.findOne();
    
    if (!existingSettings) {
      await SiteSettings.create({
        siteName: 'Amanat-E-Nazirpara',
        tagline: 'Building our sacred space together',
        description: 'A community-driven initiative to build a mosque through transparency, trust, and collective effort.',
        phone: '+880 1234-567890',
        email: 'info@amanat-nazirpara.org',
        address: 'Nazirpara, Dhaka, Bangladesh',
        facebookUrl: 'https://facebook.com/amanat-nazirpara',
        prayerFajr: '05:00',
        prayerDhuhr: '12:30',
        prayerAsr: '16:00',
        prayerMaghrib: '18:15',
        prayerIsha: '19:45',
        showAnonymousDonors: true,
        enableGallery: true,
        maintenanceMode: false,
      });
      console.log('   ✓ Created default site settings');
    } else {
      console.log('   ✓ Site settings already exist');
    }

    // 3. Create sample committees
    console.log('\n📦 Seeding Committees...');
    const existingCommittees = await Committee.countDocuments();
    
    if (existingCommittees === 0) {
      const committees = [
        {
          name: 'Founding Committee',
          term: '2020-2022',
          description: 'The founding committee that initiated the mosque construction project.',
          type: 'past',
          isActive: true,
          members: [
            { name: 'Mohammad Rahman', designation: 'president', designationLabel: 'President', phone: '+880 1711-111111', order: 1 },
            { name: 'Abdul Karim', designation: 'vice_president', designationLabel: 'Vice President', phone: '+880 1722-222222', order: 2 },
            { name: 'Farid Ahmed', designation: 'secretary', designationLabel: 'Secretary', phone: '+880 1733-333333', order: 3 },
            { name: 'Jamal Hossain', designation: 'treasurer', designationLabel: 'Treasurer', phone: '+880 1744-444444', order: 4 },
          ],
        },
        {
          name: 'Current Executive Committee',
          term: '2023-2025',
          description: 'The current executive committee overseeing ongoing construction and operations.',
          type: 'current',
          isActive: true,
          members: [
            { name: 'Hafiz Abdullah', designation: 'president', designationLabel: 'President', phone: '+880 1811-111111', order: 1 },
            { name: 'Dr. Salim Khan', designation: 'vice_president', designationLabel: 'Vice President', phone: '+880 1822-222222', order: 2 },
            { name: 'Eng. Nasir Uddin', designation: 'secretary', designationLabel: 'General Secretary', phone: '+880 1833-333333', order: 3 },
            { name: 'Md. Rahim Mia', designation: 'treasurer', designationLabel: 'Treasurer', phone: '+880 1844-444444', order: 4 },
            { name: 'Kazi Aminul Islam', designation: 'member', designationLabel: 'Executive Member', phone: '+880 1855-555555', order: 5 },
            { name: 'Moulana Tariqul', designation: 'member', designationLabel: 'Executive Member', phone: '+880 1866-666666', order: 6 },
          ],
        },
      ];

      for (const committee of committees) {
        await Committee.create(committee);
        console.log(`   ✓ Created committee: ${committee.name}`);
      }
    } else {
      console.log('   ✓ Committees already exist');
    }

    // 4. Create sample contributions
    console.log('\n📦 Seeding Contributions...');
    const existingContributions = await Contribution.countDocuments();
    
    if (existingContributions === 0) {
      const contributions = [
        { contributorName: 'Mohammad Ali', type: 'Cash', amount: 50000, date: new Date('2024-01-15'), anonymous: false, purpose: 'Foundation Work', status: 'verified', receiptNumber: generateReceiptNumber() },
        { contributorName: 'Fatima Begum', type: 'Cash', amount: 25000, date: new Date('2024-02-10'), anonymous: false, purpose: 'Building Materials', status: 'verified', receiptNumber: generateReceiptNumber() },
        { contributorName: 'Anonymous', type: 'Cash', amount: 100000, date: new Date('2024-03-05'), anonymous: true, purpose: 'General Fund', status: 'verified', receiptNumber: generateReceiptNumber() },
        { contributorName: 'Abdul Wahab', type: 'Material', amount: 75000, date: new Date('2024-04-20'), anonymous: false, purpose: 'Cement & Bricks', status: 'verified', receiptNumber: generateReceiptNumber() },
        { contributorName: 'Kamal Hossain', type: 'Cash', amount: 30000, date: new Date('2024-05-12'), anonymous: false, purpose: 'Labor Wages', status: 'pending', receiptNumber: generateReceiptNumber() },
        { contributorName: 'Rashida Khatun', type: 'Cash', amount: 15000, date: new Date('2024-06-08'), anonymous: false, purpose: 'Electrical Work', status: 'pending', receiptNumber: generateReceiptNumber() },
        { contributorName: 'Nurul Islam', type: 'Cash', amount: 200000, date: new Date('2024-07-01'), anonymous: false, purpose: 'Dome Construction', status: 'verified', receiptNumber: generateReceiptNumber() },
        { contributorName: 'Anonymous', type: 'Cash', amount: 50000, date: new Date('2024-08-15'), anonymous: true, purpose: 'Minaret', status: 'verified', receiptNumber: generateReceiptNumber() },
        { contributorName: 'Habibur Rahman', type: 'Material', amount: 45000, date: new Date('2024-09-10'), anonymous: false, purpose: 'Tiles & Flooring', status: 'verified', receiptNumber: generateReceiptNumber() },
        { contributorName: 'Salma Akhter', type: 'Cash', amount: 20000, date: new Date('2024-10-05'), anonymous: false, purpose: 'Painting', status: 'pending', receiptNumber: generateReceiptNumber() },
      ];

      for (const contribution of contributions) {
        await Contribution.create(contribution);
      }
      console.log(`   ✓ Created ${contributions.length} sample contributions`);
    } else {
      console.log('   ✓ Contributions already exist');
    }

    // 5. Create sample land donors
    console.log('\n📦 Seeding Land Donors...');
    const existingLandDonors = await LandDonor.countDocuments();
    
    if (existingLandDonors === 0) {
      const landDonors = [
        { name: 'Haji Abdul Majid', landAmount: 10, unit: 'decimal', location: 'Plot A, Nazirpara Main Road', quote: 'This land is dedicated for the sake of Allah.', date: new Date('2020-01-10'), verified: true },
        { name: 'Begum Rahela', landAmount: 5, unit: 'decimal', location: 'Plot B, Adjacent to Main Road', quote: 'In memory of my late husband.', date: new Date('2020-03-15'), verified: true },
        { name: 'Mohammad Ismail Family', landAmount: 8, unit: 'decimal', location: 'Plot C, North Corner', quote: 'A gift from our family to the community.', date: new Date('2020-06-20'), verified: true },
        { name: 'Alhaj Sirajul Islam', landAmount: 3, unit: 'decimal', location: 'Plot D, East Side', date: new Date('2021-02-01'), verified: false },
      ];

      for (const donor of landDonors) {
        await LandDonor.create(donor);
      }
      console.log(`   ✓ Created ${landDonors.length} sample land donors`);
    } else {
      console.log('   ✓ Land donors already exist');
    }

    // 6. Create sample gallery images
    console.log('\n📦 Seeding Gallery Images...');
    const existingGalleryImages = await GalleryImage.countDocuments();
    
    if (existingGalleryImages === 0) {
      const galleryImages = [
        { url: '/images/gallery/foundation-1.jpg', publicId: 'sample-foundation-1', category: 'Foundation', alt: 'Foundation laying ceremony', description: 'The foundation stone being laid by community elders.', date: 'January 2021', featured: true, order: 1 },
        { url: '/images/gallery/foundation-2.jpg', publicId: 'sample-foundation-2', category: 'Foundation', alt: 'Foundation work in progress', description: 'Workers preparing the foundation area.', date: 'February 2021', featured: false, order: 2 },
        { url: '/images/gallery/construction-1.jpg', publicId: 'sample-construction-1', category: 'Construction', alt: 'Wall construction', description: 'Brick walls rising from the foundation.', date: 'June 2021', featured: true, order: 3 },
        { url: '/images/gallery/construction-2.jpg', publicId: 'sample-construction-2', category: 'Construction', alt: 'Dome framework', description: 'Steel framework for the main dome.', date: 'December 2021', featured: false, order: 4 },
        { url: '/images/gallery/events-1.jpg', publicId: 'sample-events-1', category: 'Events', alt: 'Community gathering', description: 'Community members gathered for Eid prayer.', date: 'April 2022', featured: true, order: 5 },
        { url: '/images/gallery/ceremony-1.jpg', publicId: 'sample-ceremony-1', category: 'Ceremony', alt: 'Inauguration ceremony', description: 'Official inauguration of the first phase.', date: 'January 2023', featured: true, order: 6 },
      ];

      for (const image of galleryImages) {
        await GalleryImage.create(image);
      }
      console.log(`   ✓ Created ${galleryImages.length} sample gallery images`);
    } else {
      console.log('   ✓ Gallery images already exist');
    }

    // 7. Create sample activity logs
    console.log('\n📦 Seeding Activity Logs...');
    const existingActivityLogs = await ActivityLog.countDocuments();
    
    if (existingActivityLogs === 0 && adminUser) {
      const activityLogs = [
        { action: 'System initialized', type: 'settings', userId: adminUser._id, userName: adminUser.name, details: 'Initial system setup completed', read: true },
        { action: 'Added new contribution from Mohammad Ali', type: 'contribution', userId: adminUser._id, userName: adminUser.name, details: 'Amount: ৳50,000', read: true },
        { action: 'Created founding committee', type: 'committee', userId: adminUser._id, userName: adminUser.name, details: 'Committee term: 2020-2022', read: false },
        { action: 'Uploaded gallery images', type: 'gallery', userId: adminUser._id, userName: adminUser.name, details: '6 images uploaded', read: false },
        { action: 'Verified land donor Haji Abdul Majid', type: 'contribution', userId: adminUser._id, userName: adminUser.name, details: '10 decimal land verified', read: false },
      ];

      for (const log of activityLogs) {
        await ActivityLog.create({ ...log, timestamp: new Date() });
      }
      console.log(`   ✓ Created ${activityLogs.length} sample activity logs`);
    } else {
      console.log('   ✓ Activity logs already exist');
    }

    console.log('\n' + '═'.repeat(50));
    console.log('✅ Seed completed successfully!');
    console.log('═'.repeat(50));
    console.log('\n📧 Admin Login Credentials:');
    console.log('   Email: admin@amanat.com');
    console.log('   Password: admin123');
    console.log('\n📧 Other Users:');
    console.log('   Admin: admin2@amanat.com / password123');
    console.log('   Photographer: photographer@amanat.com / password123');
    console.log('\n⚠️  Please change the passwords after first login!');

  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

seed();
