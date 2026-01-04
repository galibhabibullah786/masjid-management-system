import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectDB, Committee, ActivityLog } from '@/lib/db';
import {
  withAuth,
  validateRequest,
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api-utils';
import { updateCommitteeSchema } from '@/lib/validations';
import { deleteImage } from '@/lib/cloudinary';
import type { TokenPayload } from '@/lib/auth';

interface Params {
  id: string;
}

// GET /api/committees/[id] - Get a single committee
async function getHandler(_request: NextRequest, _auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('Committee');
    }

    const committee = await Committee.findById(params.id);
    if (!committee) {
      return notFoundResponse('Committee');
    }

    return successResponse(committee, 'Committee retrieved successfully');
  } catch (error) {
    console.error('Get committee error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// PUT /api/committees/[id] - Update a committee
async function putHandler(request: NextRequest, auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('Committee');
    }

    const validation = await validateRequest(request, updateCommitteeSchema);
    if (validation.error) return validation.error;

    const committee = await Committee.findById(params.id);
    if (!committee) {
      return notFoundResponse('Committee');
    }

    // If changing to current, make other current committees past
    if (validation.data.type === 'current' && committee.type !== 'current') {
      await Committee.updateMany({ type: 'current', _id: { $ne: params.id } }, { type: 'past' });
    }

    // Update committee
    Object.assign(committee, validation.data);
    await committee.save();

    // Log activity
    await ActivityLog.create({
      action: `Updated committee: ${committee.name}`,
      type: 'committee',
      entityId: committee._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(committee, 'Committee updated successfully');
  } catch (error) {
    console.error('Update committee error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// DELETE /api/committees/[id] - Delete a committee
async function deleteHandler(_request: NextRequest, auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('Committee');
    }

    const committee = await Committee.findById(params.id);
    if (!committee) {
      return notFoundResponse('Committee');
    }

    // Delete member photos from Cloudinary
    for (const member of committee.members) {
      if (member.photo) {
        const matches = member.photo.match(/amanat-e-nazirpara\/members\/[^.]+/);
        if (matches) {
          await deleteImage(matches[0]);
        }
      }
    }

    await Committee.findByIdAndDelete(params.id);

    // Log activity
    await ActivityLog.create({
      action: `Deleted committee: ${committee.name}`,
      type: 'delete',
      entityId: committee._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(null, 'Committee deleted successfully');
  } catch (error) {
    console.error('Delete committee error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler, 'manage_committees');
export const PUT = withAuth(putHandler, 'manage_committees');
export const DELETE = withAuth(deleteHandler, 'manage_committees');
