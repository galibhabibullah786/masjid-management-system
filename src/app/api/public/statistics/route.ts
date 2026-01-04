import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Contribution, LandDonor, Committee, GalleryImage, SiteSettings } from '@/lib/db';

// Helper for public API responses
function publicResponse<T>(data: T, message = 'Success') {
  return NextResponse.json({ success: true, message, data });
}

function publicError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// GET /api/public/statistics - Get public statistics
export async function GET() {
  try {
    await connectDB();

    const [totalFunds, landDonated, totalContributors, settings] = await Promise.all([
      Contribution.aggregate([
        { $match: { status: 'verified' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      LandDonor.aggregate([
        { $match: { verified: true } },
        { $group: { _id: null, total: { $sum: '$landAmount' } } },
      ]),
      Contribution.countDocuments({ status: 'verified', anonymous: false }),
      SiteSettings.findOne(),
    ]);

    return publicResponse({
      totalFunds: totalFunds[0]?.total || 0,
      landDonated: landDonated[0]?.total || 0,
      totalContributors,
      siteName: settings?.siteName || 'Amanat-E-Nazirpara',
      tagline: settings?.tagline,
    });
  } catch (error) {
    console.error('Get public statistics error:', error);
    return publicError('Internal server error', 500);
  }
}
