import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectDB, GalleryImage, ActivityLog } from '@/lib/db';
import {
  withAuth,
  validateRequest,
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api-utils';
import { updateGalleryImageSchema } from '@/lib/validations';
import { deleteImage } from '@/lib/cloudinary';
import type { TokenPayload } from '@/lib/auth';

interface Params {
  id: string;
}

// GET /api/gallery/[id] - Get a single gallery image
async function getHandler(_request: NextRequest, _auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('Gallery image');
    }

    const image = await GalleryImage.findById(params.id);
    if (!image) {
      return notFoundResponse('Gallery image');
    }

    return successResponse(image, 'Gallery image retrieved successfully');
  } catch (error) {
    console.error('Get gallery image error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// PUT /api/gallery/[id] - Update a gallery image
async function putHandler(request: NextRequest, auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('Gallery image');
    }

    const validation = await validateRequest(request, updateGalleryImageSchema);
    if (validation.error) return validation.error;

    const image = await GalleryImage.findById(params.id);
    if (!image) {
      return notFoundResponse('Gallery image');
    }

    // Update gallery image
    Object.assign(image, validation.data);
    await image.save();

    // Log activity
    await ActivityLog.create({
      action: `Updated gallery image: ${image.alt}`,
      type: 'gallery',
      entityId: image._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(image, 'Gallery image updated successfully');
  } catch (error) {
    console.error('Update gallery image error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// DELETE /api/gallery/[id] - Delete a gallery image
async function deleteHandler(_request: NextRequest, auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('Gallery image');
    }

    const image = await GalleryImage.findById(params.id);
    if (!image) {
      return notFoundResponse('Gallery image');
    }

    // Delete image from Cloudinary
    if (image.publicId) {
      await deleteImage(image.publicId);
    }

    await GalleryImage.findByIdAndDelete(params.id);

    // Log activity
    await ActivityLog.create({
      action: `Deleted gallery image: ${image.alt}`,
      type: 'delete',
      entityId: image._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(null, 'Gallery image deleted successfully');
  } catch (error) {
    console.error('Delete gallery image error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler, 'manage_gallery');
export const PUT = withAuth(putHandler, 'manage_gallery');
export const DELETE = withAuth(deleteHandler, 'manage_gallery');
