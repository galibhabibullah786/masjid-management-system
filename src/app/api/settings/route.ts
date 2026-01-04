import { NextRequest } from 'next/server';
import { connectDB, SiteSettings, ActivityLog } from '@/lib/db';
import {
  withAuth,
  successResponse,
  errorResponse,
} from '@/lib/api-utils';
import type { TokenPayload } from '@/lib/auth';

// Transform DB format to frontend format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbToFrontend(settings: any) {
  return {
    siteName: settings.siteName,
    tagline: settings.tagline,
    description: settings.description,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    socialLinks: {
      facebook: settings.facebookUrl,
      youtube: settings.youtubeUrl,
      twitter: settings.twitterUrl,
    },
    prayerTimes: {
      fajr: settings.prayerFajr,
      dhuhr: settings.prayerDhuhr,
      asr: settings.prayerAsr,
      maghrib: settings.prayerMaghrib,
      isha: settings.prayerIsha,
    },
    logo: settings.logo,
    favicon: settings.favicon,
    maintenanceMode: settings.maintenanceMode,
    showAnonymousDonors: settings.showAnonymousDonors,
    enableGallery: settings.enableGallery,
  };
}

// Transform frontend format to DB format
function frontendToDb(data: Record<string, unknown>) {
  const result: Record<string, unknown> = {};
  
  // Direct fields
  if (data.siteName !== undefined) result.siteName = data.siteName;
  if (data.tagline !== undefined) result.tagline = data.tagline;
  if (data.description !== undefined) result.description = data.description;
  if (data.phone !== undefined) result.phone = data.phone;
  if (data.email !== undefined) result.email = data.email;
  if (data.address !== undefined) result.address = data.address;
  if (data.logo !== undefined) result.logo = data.logo;
  if (data.favicon !== undefined) result.favicon = data.favicon;
  if (data.maintenanceMode !== undefined) result.maintenanceMode = data.maintenanceMode;
  if (data.showAnonymousDonors !== undefined) result.showAnonymousDonors = data.showAnonymousDonors;
  if (data.enableGallery !== undefined) result.enableGallery = data.enableGallery;
  
  // Nested socialLinks
  if (data.socialLinks && typeof data.socialLinks === 'object') {
    const social = data.socialLinks as Record<string, unknown>;
    if (social.facebook !== undefined) result.facebookUrl = social.facebook;
    if (social.youtube !== undefined) result.youtubeUrl = social.youtube;
    if (social.twitter !== undefined) result.twitterUrl = social.twitter;
  }
  
  // Nested prayerTimes
  if (data.prayerTimes && typeof data.prayerTimes === 'object') {
    const prayer = data.prayerTimes as Record<string, unknown>;
    if (prayer.fajr !== undefined) result.prayerFajr = prayer.fajr;
    if (prayer.dhuhr !== undefined) result.prayerDhuhr = prayer.dhuhr;
    if (prayer.asr !== undefined) result.prayerAsr = prayer.asr;
    if (prayer.maghrib !== undefined) result.prayerMaghrib = prayer.maghrib;
    if (prayer.isha !== undefined) result.prayerIsha = prayer.isha;
  }
  
  return result;
}

// GET /api/settings - Get site settings
async function getHandler(_request: NextRequest, _auth: TokenPayload) {
  try {
    await connectDB();

    let settings = await SiteSettings.findOne();
    if (!settings) {
      // Create default settings
      settings = await SiteSettings.create({});
    }

    return successResponse(dbToFrontend(settings.toObject()), 'Settings retrieved successfully');
  } catch (error) {
    console.error('Get settings error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// PUT /api/settings - Update site settings
async function putHandler(request: NextRequest, auth: TokenPayload) {
  try {
    await connectDB();

    const body = await request.json();
    const dbData = frontendToDb(body);

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(dbData);
    } else {
      Object.assign(settings, dbData);
      await settings.save();
    }

    // Log activity
    await ActivityLog.create({
      action: 'Updated site settings',
      type: 'settings',
      entityId: settings._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(dbToFrontend(settings.toObject()), 'Settings updated successfully');
  } catch (error) {
    console.error('Update settings error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler, 'manage_settings');
export const PUT = withAuth(putHandler, 'manage_settings');
