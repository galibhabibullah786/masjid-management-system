import { NextRequest } from 'next/server';
import { connectDB, User, ActivityLog } from '@/lib/db';
import { hashPassword, userToAuthUser } from '@/lib/auth';
import {
  withAuth,
  validateRequest,
  successResponse,
  errorResponse,
  getPaginationParams,
  getPaginationMeta,
} from '@/lib/api-utils';
import { createUserSchema } from '@/lib/validations';
import type { TokenPayload } from '@/lib/auth';

// GET /api/users - List all users
async function getHandler(request: NextRequest, auth: TokenPayload) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const { page, limit, skip, sortBy, sortOrder, search } = getPaginationParams(searchParams);

    // Build query
    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Get users and total count
    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    const data = users.map(userToAuthUser);

    return successResponse(data, 'Users retrieved successfully', getPaginationMeta(total, page, limit));
  } catch (error) {
    console.error('Get users error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// POST /api/users - Create a new user
async function postHandler(request: NextRequest, auth: TokenPayload) {
  try {
    await connectDB();

    const validation = await validateRequest(request, createUserSchema);
    if (validation.error) return validation.error;

    const { email, password, name, role, phone } = validation.data;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse('Email already exists', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: role || 'photographer',
      phone,
    });

    // Log activity
    await ActivityLog.create({
      action: `Created user: ${name}`,
      type: 'user',
      entityId: user._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(userToAuthUser(user), 'User created successfully');
  } catch (error) {
    console.error('Create user error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler, 'manage_users');
export const POST = withAuth(postHandler, 'manage_users');
