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
import type { TokenPayload } from '@/lib/auth';

interface Params {
  id: string;
}

// POST /api/committees/[id]/members - Add a member to a committee
async function postHandler(request: NextRequest, auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('Committee');
    }

    const validation = await validateRequest(request, committeeMemberSchema);
    if (validation.error) return validation.error;

    const committee = await Committee.findById(params.id);
    if (!committee) {
      return notFoundResponse('Committee');
    }

    // Add member
    const newMember = {
      ...validation.data,
      _id: new mongoose.Types.ObjectId(),
      order: validation.data.order ?? committee.members.length,
    };
    committee.members.push(newMember);
    await committee.save();

    // Log activity
    await ActivityLog.create({
      action: `Added member ${validation.data.name} to ${committee.name}`,
      type: 'committee',
      entityId: committee._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(committee, 'Member added successfully');
  } catch (error) {
    console.error('Add member error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const POST = withAuth(postHandler, 'manage_committees');
