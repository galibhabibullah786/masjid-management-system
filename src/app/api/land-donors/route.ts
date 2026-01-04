import { NextRequest } from 'next/server';
import { connectDB, LandDonor, ActivityLog } from '@/lib/db';
import {
  withAuth,
  validateRequest,
  successResponse,
  errorResponse,
  getPaginationParams,
  getPaginationMeta,
} from '@/lib/api-utils';
import { createLandDonorSchema } from '@/lib/validations';
import type { TokenPayload } from '@/lib/auth';

// GET /api/land-donors - List all land donors
async function getHandler(request: NextRequest, _auth: TokenPayload) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const { page, limit, skip, sortBy, sortOrder, search } = getPaginationParams(searchParams);
    const verified = searchParams.get('verified');

    // Build query
    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }
    if (verified !== null && verified !== '') {
      query.verified = verified === 'true';
    }

    // Get land donors and total count
    const [landDonors, total] = await Promise.all([
      LandDonor.find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit),
      LandDonor.countDocuments(query),
    ]);

    return successResponse(landDonors, 'Land donors retrieved successfully', getPaginationMeta(total, page, limit));
  } catch (error) {
    console.error('Get land donors error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// POST /api/land-donors - Create a new land donor
async function postHandler(request: NextRequest, auth: TokenPayload) {
  try {
    await connectDB();

    const validation = await validateRequest(request, createLandDonorSchema);
    if (validation.error) return validation.error;

    // Create land donor
    const landDonor = await LandDonor.create({
      ...validation.data,
      date: new Date(validation.data.date),
    });

    // Log activity
    await ActivityLog.create({
      action: `Added land donor: ${landDonor.name}`,
      type: 'contribution',
      entityId: landDonor._id,
      userId: auth.userId,
      userName: auth.name,
      details: `Land: ${landDonor.landAmount} ${landDonor.unit}`,
    });

    return successResponse(landDonor, 'Land donor created successfully');
  } catch (error) {
    console.error('Create land donor error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler, 'manage_land_donors');
export const POST = withAuth(postHandler, 'manage_land_donors');
