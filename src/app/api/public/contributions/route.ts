import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Contribution, SiteSettings } from '@/lib/db';

function publicResponse<T>(data: T, message = 'Success', meta?: { page: number; limit: number; total: number; totalPages: number }) {
  const response: { success: boolean; message: string; data: T; meta?: typeof meta } = { success: true, message, data };
  if (meta) response.meta = meta;
  return NextResponse.json(response);
}

function publicError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// GET /api/public/contributions - Get public contributions list
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const skip = (page - 1) * limit;
    const type = searchParams.get('type');

    // Check if anonymous donors should be shown
    const settings = await SiteSettings.findOne();
    const showAnonymous = settings?.showAnonymousDonors ?? true;

    // Build query - only show verified contributions
    const query: Record<string, unknown> = { status: 'verified' };
    if (type) query.type = type;

    const [contributions, total] = await Promise.all([
      Contribution.find(query)
        .select('contributorName type amount date anonymous purpose')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Contribution.countDocuments(query),
    ]);

    // Transform data to hide anonymous donor names
    const data = contributions.map((c) => ({
      id: c._id,
      contributorName: c.anonymous && !showAnonymous ? 'Anonymous Donor' : c.contributorName,
      type: c.type,
      amount: c.amount,
      date: c.date,
      anonymous: c.anonymous,
      purpose: c.purpose,
    }));

    return publicResponse(data, 'Contributions retrieved successfully', {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get public contributions error:', error);
    return publicError('Internal server error', 500);
  }
}
