import { NextRequest } from 'next/server';
import { connectDB, Contribution, ActivityLog } from '@/lib/db';
import {
  withAuth,
  validateRequest,
  successResponse,
  errorResponse,
  getPaginationParams,
  getPaginationMeta,
  generateReceiptNumber,
} from '@/lib/api-utils';
import { createContributionSchema } from '@/lib/validations';
import type { TokenPayload } from '@/lib/auth';

// GET /api/contributions - List all contributions
async function getHandler(request: NextRequest, _auth: TokenPayload) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const { page, limit, skip, sortBy, sortOrder, search } = getPaginationParams(searchParams);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const anonymous = searchParams.get('anonymous');

    // Build query
    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { contributorName: { $regex: search, $options: 'i' } },
        { receiptNumber: { $regex: search, $options: 'i' } },
      ];
    }
    if (type) query.type = type;
    if (status) query.status = status;
    if (anonymous !== null && anonymous !== '') {
      query.anonymous = anonymous === 'true';
    }

    // Get contributions and total count
    const [contributions, total] = await Promise.all([
      Contribution.find(query)
        .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
        .skip(skip)
        .limit(limit),
      Contribution.countDocuments(query),
    ]);

    return successResponse(contributions, 'Contributions retrieved successfully', getPaginationMeta(total, page, limit));
  } catch (error) {
    console.error('Get contributions error:', error);
    return errorResponse('Internal server error', 500);
  }
}

// POST /api/contributions - Create a new contribution
async function postHandler(request: NextRequest, auth: TokenPayload) {
  try {
    await connectDB();

    const validation = await validateRequest(request, createContributionSchema);
    if (validation.error) return validation.error;

    // Generate receipt number
    const receiptNumber = generateReceiptNumber();

    // Create contribution
    const contribution = await Contribution.create({
      ...validation.data,
      date: new Date(validation.data.date),
      receiptNumber,
    });

    // Log activity
    await ActivityLog.create({
      action: `Added contribution from ${contribution.contributorName}`,
      type: 'contribution',
      entityId: contribution._id,
      userId: auth.userId,
      userName: auth.name,
      details: `Amount: ${contribution.amount}, Type: ${contribution.type}`,
    });

    return successResponse(contribution, 'Contribution created successfully');
  } catch (error) {
    console.error('Create contribution error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler, 'manage_contributions');
export const POST = withAuth(postHandler, 'manage_contributions');
