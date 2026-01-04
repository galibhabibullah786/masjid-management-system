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
import { committeeMemberSchema } from '@/lib/validations';
import { deleteImage } from '@/lib/cloudinary';
import type { TokenPayload } from '@/lib/auth';

interface Params {
  id: string;
  memberId: string;
}

// PUT /api/committees/[id]/members/[memberId] - Update a member
async function putHandler(request: NextRequest, auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id) || !mongoose.Types.ObjectId.isValid(params.memberId)) {
      return notFoundResponse('Committee or Member');
    }

    const validation = await validateRequest(request, committeeMemberSchema.partial());
    if (validation.error) return validation.error;

    const committee = await Committee.findById(params.id);
    if (!committee) {
      return notFoundResponse('Committee');
    }

    const memberIndex = committee.members.findIndex(
      (m) => m._id?.toString() === params.memberId
    );
    if (memberIndex === -1) {
      return notFoundResponse('Member');
    }

    // Update member
    Object.assign(committee.members[memberIndex], validation.data);
    await committee.save();

    // Log activity
    await ActivityLog.create({
      action: `Updated member ${committee.members[memberIndex].name} in ${committee.name}`,
      type: 'committee',
      entityId: committee._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(committee, 'Member updated successfully');
  } catch (error) {
    console.error('Update member error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// DELETE /api/committees/[id]/members/[memberId] - Remove a member
async function deleteHandler(_request: NextRequest, auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id) || !mongoose.Types.ObjectId.isValid(params.memberId)) {
      return notFoundResponse('Committee or Member');
    }

    const committee = await Committee.findById(params.id);
    if (!committee) {
      return notFoundResponse('Committee');
    }

    const memberIndex = committee.members.findIndex(
      (m) => m._id?.toString() === params.memberId
    );
    if (memberIndex === -1) {
      return notFoundResponse('Member');
    }

    const member = committee.members[memberIndex];

    // Delete member photo from Cloudinary if exists
    if (member.photo) {
      const matches = member.photo.match(/amanat-e-nazirpara\/members\/[^.]+/);
      if (matches) {
        await deleteImage(matches[0]);
      }
    }

    // Remove member
    committee.members.splice(memberIndex, 1);
    await committee.save();

    // Log activity
    await ActivityLog.create({
      action: `Removed member ${member.name} from ${committee.name}`,
      type: 'committee',
      entityId: committee._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(committee, 'Member removed successfully');
  } catch (error) {
    console.error('Delete member error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const PUT = withAuth(putHandler, 'manage_committees');
export const DELETE = withAuth(deleteHandler, 'manage_committees');
