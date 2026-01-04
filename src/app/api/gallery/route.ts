import { NextRequest } from 'next/server';
import { connectDB, GalleryImage, ActivityLog } from '@/lib/db';
import {
  withAuth,
  validateRequest,
  successResponse,
  errorResponse,
  getPaginationParams,
  getPaginationMeta,
} from '@/lib/api-utils';
import { createGalleryImageSchema } from '@/lib/validations';
import type { TokenPayload } from '@/lib/auth';

// GET /api/gallery - List all gallery images
async function getHandler(request: NextRequest, _auth: TokenPayload) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const { page, limit, skip, sortBy, sortOrder, search } = getPaginationParams(searchParams);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    // Build query
    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { alt: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (featured !== null && featured !== '') {
      query.featured = featured === 'true';
    }

    // Get gallery images and total count
    const [images, total] = await Promise.all([
      GalleryImage.find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit),
      GalleryImage.countDocuments(query),
    ]);

    return successResponse(images, 'Gallery images retrieved successfully', getPaginationMeta(total, page, limit));
  } catch (error) {
    console.error('Get gallery images error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// POST /api/gallery - Create a new gallery image
async function postHandler(request: NextRequest, auth: TokenPayload) {
  try {
    await connectDB();

    const validation = await validateRequest(request, createGalleryImageSchema);
    if (validation.error) return validation.error;

    // Create gallery image
    const image = await GalleryImage.create(validation.data);

    // Log activity
    await ActivityLog.create({
      action: `Added gallery image: ${image.alt}`,
      type: 'gallery',
      entityId: image._id,
      userId: auth.userId,
      userName: auth.name,
      details: `Category: ${image.category}`,
    });

    return successResponse(image, 'Gallery image created successfully');
  } catch (error) {
    console.error('Create gallery image error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler, 'manage_gallery');
export const POST = withAuth(postHandler, 'manage_gallery');
