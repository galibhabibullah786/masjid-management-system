import { NextRequest } from 'next/server';
import { connectDB, User } from '@/lib/db';
import {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
} from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get refresh token from cookies or body
    let refreshToken = request.cookies.get('refresh_token')?.value;

    if (!refreshToken) {
      try {
        const body = await request.json();
        refreshToken = body.refreshToken;
      } catch {
        // No body
      }
    }

    if (!refreshToken) {
      return errorResponse('Refresh token is required', 401);
    }

    // Verify refresh token
    const payload = await verifyToken(refreshToken);
    if (!payload) {
      return errorResponse('Invalid or expired refresh token', 401);
    }

    // Check if user still exists and is active
    const user = await User.findById(payload.userId);
    if (!user || !user.isActive) {
      return errorResponse('User not found or inactive', 401);
    }

    // Generate new tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const [newAccessToken, newRefreshToken] = await Promise.all([
      generateAccessToken(tokenPayload),
      generateRefreshToken(tokenPayload),
    ]);

    // Set cookies
    await setAuthCookies(newAccessToken, newRefreshToken);

    return successResponse(
      {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      'Token refreshed successfully'
    );
  } catch (error) {
    console.error('Token refresh error:', error);
    return errorResponse('Internal server error', 500);
  }
}
