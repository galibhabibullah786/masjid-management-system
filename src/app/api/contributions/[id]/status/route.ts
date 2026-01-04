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
import { updateContributionStatusSchema } from '@/lib/validations';
import type { TokenPayload } from '@/lib/auth';

interface Params {
  id: string;
}

// PATCH /api/contributions/[id]/status - Update contribution status
async function patchHandler(request: NextRequest, auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('Contribution');
    }

    const validation = await validateRequest(request, updateContributionStatusSchema);
    if (validation.error) return validation.error;

    const contribution = await Contribution.findById(params.id);
    if (!contribution) {
      return notFoundResponse('Contribution');
    }

    const oldStatus = contribution.status;
    contribution.status = validation.data.status;
    if (validation.data.notes) {
      contribution.notes = validation.data.notes;
    }
    await contribution.save();

    // Log activity
    await ActivityLog.create({
      action: `Changed contribution status from ${oldStatus} to ${validation.data.status}`,
      type: 'contribution',
      entityId: contribution._id,
      userId: auth.userId,
      userName: auth.name,
      details: `Contribution from ${contribution.contributorName}`,
    });

    return successResponse(contribution, 'Contribution status updated successfully');
  } catch (error) {
    console.error('Update contribution status error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const PATCH = withAuth(patchHandler, 'manage_contributions');
