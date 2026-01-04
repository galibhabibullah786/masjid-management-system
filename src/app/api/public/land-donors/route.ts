import { NextRequest, NextResponse } from 'next/server';
import { connectDB, LandDonor } from '@/lib/db';

function publicResponse<T>(data: T, message = 'Success', meta?: { page: number; limit: number; total: number; totalPages: number }) {
  const response: { success: boolean; message: string; data: T; meta?: typeof meta } = { success: true, message, data };
  if (meta) response.meta = meta;
  return NextResponse.json(response);
}

function publicError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// GET /api/public/land-donors - Get public land donors list
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
    const skip = (page - 1) * limit;

    // Only show verified land donors
    const query = { verified: true };

    const [landDonors, total] = await Promise.all([
      LandDonor.find(query)
        .select('name landAmount unit location quote date photo')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      LandDonor.countDocuments(query),
    ]);

    const data = landDonors.map((ld) => ({
      id: ld._id,
      name: ld.name,
      landAmount: ld.landAmount,
      unit: ld.unit,
      location: ld.location,
      quote: ld.quote,
      date: ld.date,
      photo: ld.photo,
    }));

    return publicResponse(data, 'Land donors retrieved successfully', {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get public land donors error:', error);
    return publicError('Internal server error', 500);
  }
}
