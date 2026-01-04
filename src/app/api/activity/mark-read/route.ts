import { NextRequest } from 'next/server';
import { connectDB, ActivityLog } from '@/lib/db';
import { withAuth, successResponse, errorResponse, validateRequest } from '@/lib/api-utils';
import type { TokenPayload } from '@/lib/auth';
import { z } from 'zod';

const markReadSchema = z.object({
  ids: z.array(z.string()).optional(),
  markAll: z.boolean().optional(),
});

// POST /api/activity/mark-read - Mark activities as read
async function postHandler(request: NextRequest, _auth: TokenPayload) {
  try {
    await connectDB();

    const validation = await validateRequest(request, markReadSchema);
    if (validation.error) return validation.error;

    const { ids, markAll } = validation.data;

    if (markAll) {
      await ActivityLog.updateMany({ read: false }, { read: true });
      return successResponse(null, 'All activities marked as read');
    }

    if (ids && ids.length > 0) {
      await ActivityLog.updateMany(
        { _id: { $in: ids } },
        { read: true }
      );
      return successResponse(null, 'Activities marked as read');
    }

    return errorResponse('Please provide activity IDs or markAll flag', 400);
  } catch (error) {
    console.error('Mark activities read error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const POST = withAuth(postHandler, 'view_activity');
