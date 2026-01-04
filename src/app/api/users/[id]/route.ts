import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import { connectDB, User, ActivityLog } from '@/lib/db';
import { userToAuthUser, hashPassword } from '@/lib/auth';
import {
  withAuth,
  validateRequest,
  successResponse,
  errorResponse,
  notFoundResponse,
} from '@/lib/api-utils';
import { updateUserSchema } from '@/lib/validations';
import type { TokenPayload } from '@/lib/auth';
import { deleteImage } from '@/lib/cloudinary';

interface Params {
  id: string;
}

// GET /api/users/[id] - Get a single user
async function getHandler(_request: NextRequest, _auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('User');
    }

    const user = await User.findById(params.id);
    if (!user) {
      return notFoundResponse('User');
    }

    return successResponse(userToAuthUser(user), 'User retrieved successfully');
  } catch (error) {
    console.error('Get user error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// PUT /api/users/[id] - Update a user
async function putHandler(request: NextRequest, auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('User');
    }

    const validation = await validateRequest(request, updateUserSchema);
    if (validation.error) return validation.error;

    const user = await User.findById(params.id);
    if (!user) {
      return notFoundResponse('User');
    }

    // Check if email is being changed and if it's already taken
    if (validation.data.email && validation.data.email !== user.email) {
      const existingUser = await User.findOne({ email: validation.data.email });
      if (existingUser) {
        return errorResponse('Email already exists', 400);
      }
    }

    // Handle password update - hash it before saving
    const updateData = { ...validation.data };
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    // Update user
    Object.assign(user, updateData);
    await user.save();

    // Log activity
    await ActivityLog.create({
      action: `Updated user: ${user.name}`,
      type: 'user',
      entityId: user._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(userToAuthUser(user), 'User updated successfully');
  } catch (error) {
    console.error('Update user error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// DELETE /api/users/[id] - Delete a user
async function deleteHandler(_request: NextRequest, auth: TokenPayload, rawParams: unknown) {
  const params = rawParams as Params;
  try {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return notFoundResponse('User');
    }

    // Prevent self-deletion
    if (params.id === auth.userId) {
      return errorResponse('You cannot delete your own account', 400);
    }

    const user = await User.findById(params.id);
    if (!user) {
      return notFoundResponse('User');
    }

    // Delete avatar from Cloudinary if exists
    if (user.avatar) {
      // Extract public ID from URL
      const matches = user.avatar.match(/amanat-e-nazirpara\/avatars\/[^.]+/);
      if (matches) {
        await deleteImage(matches[0]);
      }
    }

    await User.findByIdAndDelete(params.id);

    // Log activity
    await ActivityLog.create({
      action: `Deleted user: ${user.name}`,
      type: 'delete',
      entityId: user._id,
      userId: auth.userId,
      userName: auth.name,
    });

    return successResponse(null, 'User deleted successfully');
  } catch (error) {
    console.error('Delete user error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler, 'manage_users');
export const PUT = withAuth(putHandler, 'manage_users');
export const DELETE = withAuth(deleteHandler, 'manage_users');
