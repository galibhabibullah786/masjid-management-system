import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectDB, LandDonor, ActivityLog } from '@/lib/db';
import {
  withAuth,
  validateRequest,
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api-utils';
import { updateLandDonorSchema } from '@/lib/validations';
import { deleteImage } from '@/lib/cloudinary';
import type { TokenPayload } from '@/lib/auth';

interface Params {
  id: string;
}

// GET /api/land-donors/[id] - Get a single land donor
async function getHandler(_request: NextRequest, _auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('Land donor');
    }

    const landDonor = await LandDonor.findById(params.id);
    if (!landDonor) {
      return notFoundResponse('Land donor');
    }

    return successResponse(landDonor, 'Land donor retrieved successfully');
  } catch (error) {
    console.error('Get land donor error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// PUT /api/land-donors/[id] - Update a land donor
async function putHandler(request: NextRequest, auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('Land donor');
    }

    const validation = await validateRequest(request, updateLandDonorSchema);
    if (validation.error) return validation.error;

    const landDonor = await LandDonor.findById(params.id);
    if (!landDonor) {
      return notFoundResponse('Land donor');
    }

    // Update land donor
    if (validation.data.date) {
      validation.data.date = new Date(validation.data.date).toISOString();
    }
    Object.assign(landDonor, validation.data);
    await landDonor.save();

    // Log activity
    await ActivityLog.create({
      action: `Updated land donor: ${landDonor.name}`,
      type: 'contribution',
      entityId: landDonor._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(landDonor, 'Land donor updated successfully');
  } catch (error) {
    console.error('Update land donor error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// DELETE /api/land-donors/[id] - Delete a land donor
async function deleteHandler(_request: NextRequest, auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('Land donor');
    }

    const landDonor = await LandDonor.findById(params.id);
    if (!landDonor) {
      return notFoundResponse('Land donor');
    }

    // Delete photo from Cloudinary if exists
    if (landDonor.photo) {
      const matches = landDonor.photo.match(/amanat-e-nazirpara\/members\/[^.]+/);
      if (matches) {
        await deleteImage(matches[0]);
      }
    }

    await LandDonor.findByIdAndDelete(params.id);

    // Log activity
    await ActivityLog.create({
      action: `Deleted land donor: ${landDonor.name}`,
      type: 'delete',
      entityId: landDonor._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(null, 'Land donor deleted successfully');
  } catch (error) {
    console.error('Delete land donor error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler, 'manage_land_donors');
export const PUT = withAuth(putHandler, 'manage_land_donors');
export const DELETE = withAuth(deleteHandler, 'manage_land_donors');
