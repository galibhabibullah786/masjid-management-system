import { NextRequest } from 'next/server';
import { connectDB, User } from '@/lib/db';
import {
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  userToAuthUser,
} from '@/lib/auth';
import { validateRequest, successResponse, errorResponse } from '@/lib/api-utils';
import { loginSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const validation = await validateRequest(request, loginSchema);
    if (validation.error) return validation.error;

    const { email, password } = validation.data;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse('Your account has been deactivated', 401);
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return errorResponse('Invalid email or password', 401);
    }

    // Generate tokens
    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const [accessToken, refreshToken] = await Promise.all([
      generateAccessToken(tokenPayload),
      generateRefreshToken(tokenPayload),
    ]);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Set cookies
    await setAuthCookies(accessToken, refreshToken);

    return successResponse(
      {
        user: userToAuthUser(user),
        accessToken,
        refreshToken,
      },
      'Login successful'
    );
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Internal server error', 500);
  }
}
