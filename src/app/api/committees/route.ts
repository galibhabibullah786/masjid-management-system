import { NextRequest } from 'next/server';
import { connectDB, Committee, ActivityLog } from '@/lib/db';
import {
  withAuth,
  validateRequest,
  successResponse,
  errorResponse,
  getPaginationParams,
  getPaginationMeta,
} from '@/lib/api-utils';
import { createCommitteeSchema } from '@/lib/validations';
import type { TokenPayload } from '@/lib/auth';

// GET /api/committees - List all committees
async function getHandler(request: NextRequest, _auth: TokenPayload) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const { page, limit, skip, sortBy, sortOrder, search } = getPaginationParams(searchParams);
    const type = searchParams.get('type');

    // Build query
    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { term: { $regex: search, $options: 'i' } },
      ];
    }
    if (type) query.type = type;

    // Get committees and total count
    const [committees, total] = await Promise.all([
      Committee.find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit),
      Committee.countDocuments(query),
    ]);

    return successResponse(committees, 'Committees retrieved successfully', getPaginationMeta(total, page, limit));
  } catch (error) {
    console.error('Get committees error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// POST /api/committees - Create a new committee
async function postHandler(request: NextRequest, auth: TokenPayload) {
  try {
    await connectDB();

    const validation = await validateRequest(request, createCommitteeSchema);
    if (validation.error) return validation.error;

    // If this is a current committee, make other current committees past
    if (validation.data.type === 'current') {
      await Committee.updateMany({ type: 'current' }, { type: 'past' });
    }

    // Create committee
    const committee = await Committee.create(validation.data);

    // Log activity
    await ActivityLog.create({
      action: `Created committee: ${committee.name}`,
      type: 'committee',
      entityId: committee._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(committee, 'Committee created successfully');
  } catch (error) {
    console.error('Create committee error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler, 'manage_committees');
export const POST = withAuth(postHandler, 'manage_committees');
