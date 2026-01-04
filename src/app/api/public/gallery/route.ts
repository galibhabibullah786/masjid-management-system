import { NextRequest, NextResponse } from 'next/server';
import { connectDB, GalleryImage, SiteSettings } from '@/lib/db';

function publicResponse<T>(data: T, message = 'Success', meta?: { page: number; limit: number; total: number; totalPages: number }) {
  const response: { success: boolean; message: string; data: T; meta?: typeof meta } = { success: true, message, data };
  if (meta) response.meta = meta;
  return NextResponse.json(response);
}

function publicError(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// GET /api/public/gallery - Get public gallery images
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Check if gallery is enabled
    const settings = await SiteSettings.findOne();
    if (settings && !settings.enableGallery) {
      return publicResponse([], 'Gallery is currently disabled');
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const skip = (page - 1) * limit;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    // Build query
    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const [images, total] = await Promise.all([
      GalleryImage.find(query)
        .select('url category alt description date featured')
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      GalleryImage.countDocuments(query),
    ]);

    const data = images.map((img) => ({
      id: img._id,
      url: img.url,
      category: img.category,
      alt: img.alt,
      description: img.description,
      date: img.date,
      featured: img.featured,
    }));

    return publicResponse(data, 'Gallery images retrieved successfully', {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get public gallery error:', error);
    return publicError('Internal server error', 500);
  }
}
