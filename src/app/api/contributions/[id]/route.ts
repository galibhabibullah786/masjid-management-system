import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectDB, Contribution, ActivityLog } from '@/lib/db';
import {
  withAuth,
  validateRequest,
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api-utils';
import { updateContributionSchema } from '@/lib/validations';
import type { TokenPayload } from '@/lib/auth';

interface Params {
  id: string;
}

// GET /api/contributions/[id] - Get a single contribution
async function getHandler(_request: NextRequest, _auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('Contribution');
    }

    const contribution = await Contribution.findById(params.id);
    if (!contribution) {
      return notFoundResponse('Contribution');
    }

    return successResponse(contribution, 'Contribution retrieved successfully');
  } catch (error) {
    console.error('Get contribution error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// PUT /api/contributions/[id] - Update a contribution
async function putHandler(request: NextRequest, auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('Contribution');
    }

    const validation = await validateRequest(request, updateContributionSchema);
    if (validation.error) return validation.error;

    const contribution = await Contribution.findById(params.id);
    if (!contribution) {
      return notFoundResponse('Contribution');
    }

    // Update contribution
    if (validation.data.date) {
      validation.data.date = new Date(validation.data.date).toISOString();
    }
    Object.assign(contribution, validation.data);
    await contribution.save();

    // Log activity
    await ActivityLog.create({
      action: `Updated contribution from ${contribution.contributorName}`,
      type: 'contribution',
      entityId: contribution._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(contribution, 'Contribution updated successfully');
  } catch (error) {
    console.error('Update contribution error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// DELETE /api/contributions/[id] - Delete a contribution
async function deleteHandler(_request: NextRequest, auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('Contribution');
    }

    const contribution = await Contribution.findById(params.id);
    if (!contribution) {
      return notFoundResponse('Contribution');
    }

    await Contribution.findByIdAndDelete(params.id);

    // Log activity
    await ActivityLog.create({
      action: `Deleted contribution from ${contribution.contributorName}`,
      type: 'delete',
      entityId: contribution._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(null, 'Contribution deleted successfully');
  } catch (error) {
    console.error('Delete contribution error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler, 'manage_contributions');
export const PUT = withAuth(putHandler, 'manage_contributions');
export const DELETE = withAuth(deleteHandler, 'manage_contributions');
