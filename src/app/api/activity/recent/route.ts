import { connectDB, ActivityLog } from '@/lib/db';
import { withAuth, successResponse, errorResponse } from '@/lib/api-utils';
import type { TokenPayload } from '@/lib/auth';
import { NextRequest } from 'next/server';

// GET /api/activity/recent - Get recent activity logs
async function getHandler(request: NextRequest, _auth: TokenPayload) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const activities = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(Math.min(limit, 50));

    return successResponse(activities, 'Recent activities retrieved successfully');
  } catch (error) {
    console.error('Get recent activities error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler, 'view_activity');
