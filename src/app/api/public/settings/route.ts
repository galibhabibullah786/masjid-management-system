import { NextResponse } from 'next/server';
import { connectDB, SiteSettings } from '@/lib/db';

function publicResponse<T>(data: T, message = 'Success') {
  return NextResponse.json({ success: true, message, data });
}

function publicError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// GET /api/public/settings - Get public site settings
export async function GET() {
  try {
    await connectDB();

    let settings = await SiteSettings.findOne();

    // Create default settings if none exist
    if (!settings) {
      settings = await SiteSettings.create({
        siteName: 'Amanat-E-Nazirpara',
        tagline: 'Building our sacred space together',
        description: 'A community-driven initiative to build a mosque through transparency and collective effort.',
      });
    }

    return publicResponse({
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
      enableGallery: settings.enableGallery,
      showAnonymousDonors: settings.showAnonymousDonors,
      maintenanceMode: settings.maintenanceMode,
    }, 'Settings retrieved successfully');
  } catch (error) {
    console.error('Get public settings error:', error);
    return publicError('Internal server error', 500);
  }
}
