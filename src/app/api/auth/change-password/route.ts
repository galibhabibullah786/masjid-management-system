import { NextRequest } from 'next/server';
import { connectDB, User } from '@/lib/db';
import { verifyPassword, hashPassword } from '@/lib/auth';
import { withAuth, validateRequest, successResponse, errorResponse } from '@/lib/api-utils';
import { changePasswordSchema } from '@/lib/validations';
import type { TokenPayload } from '@/lib/auth';

async function handler(request: NextRequest, auth: TokenPayload) {
  try {
    await connectDB();

    const validation = await validateRequest(request, changePasswordSchema);
    if (validation.error) return validation.error;

    const { currentPassword, newPassword } = validation.data;

    // Find user with password
    const user = await User.findById(auth.userId).select('+password');
    if (!user) {
      return errorResponse('User not found', 404);
    }

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.password);
    if (!isValidPassword) {
      return errorResponse('Current password is incorrect', 400);
    }

    // Hash new password
    user.password = await hashPassword(newPassword);
    await user.save();

    return successResponse(null, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const POST = withAuth(handler);
