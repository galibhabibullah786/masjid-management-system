import { NextRequest } from 'next/server';
import { connectDB, User } from '@/lib/db';
import { userToAuthUser } from '@/lib/auth';
import { withAuth, successResponse, errorResponse } from '@/lib/api-utils';
import type { TokenPayload } from '@/lib/auth';

async function handler(_request: NextRequest, auth: TokenPayload) {
  try {
    await connectDB();

    const user = await User.findById(auth.userId);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    return successResponse(userToAuthUser(user), 'Profile retrieved successfully');
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(handler);
