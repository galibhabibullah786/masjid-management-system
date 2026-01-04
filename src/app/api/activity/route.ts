import { NextRequest } from 'next/server';
import { connectDB, ActivityLog } from '@/lib/db';
import {
  withAuth,
  successResponse,
  errorResponse,
  getPaginationParams,
  getPaginationMeta,
} from '@/lib/api-utils';
import type { TokenPayload } from '@/lib/auth';

// GET /api/activity - List all activity logs
async function getHandler(request: NextRequest, _auth: TokenPayload) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const { page, limit, skip, sortOrder } = getPaginationParams(searchParams);
    const type = searchParams.get('type');

    // Build query
    const query: Record<string, unknown> = {};
    if (type) query.type = type;

    // Get activities and total count
    const [activities, total] = await Promise.all([
      ActivityLog.find(query)
        .sort({ timestamp: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments(query),
    ]);

    return successResponse(activities, 'Activities retrieved successfully', getPaginationMeta(total, page, limit));
  } catch (error) {
    console.error('Get activities error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler, 'view_activity');
