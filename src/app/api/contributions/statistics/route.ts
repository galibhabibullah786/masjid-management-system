import { NextRequest } from 'next/server';
import { connectDB, Contribution } from '@/lib/db';
import { withAuth, successResponse, errorResponse } from '@/lib/api-utils';
import type { TokenPayload } from '@/lib/auth';

// GET /api/contributions/statistics - Get contribution statistics
async function getHandler(_request: NextRequest, _auth: TokenPayload) {
  try {
    await connectDB();

    const [
      totalContributions,
      verifiedContributions,
      pendingContributions,
      rejectedContributions,
      totalAmount,
      cashAmount,
      materialAmount,
    ] = await Promise.all([
      Contribution.countDocuments(),
      Contribution.countDocuments({ status: 'verified' }),
      Contribution.countDocuments({ status: 'pending' }),
      Contribution.countDocuments({ status: 'rejected' }),
      Contribution.aggregate([
        { $match: { status: 'verified' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Contribution.aggregate([
        { $match: { status: 'verified', type: 'Cash' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Contribution.aggregate([
        { $match: { status: 'verified', type: 'Material' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    return successResponse({
      totalContributions,
      verifiedContributions,
      pendingContributions,
      rejectedContributions,
      totalAmount: totalAmount[0]?.total || 0,
      cashAmount: cashAmount[0]?.total || 0,
      materialAmount: materialAmount[0]?.total || 0,
    }, 'Statistics retrieved successfully');
  } catch (error) {
    console.error('Get contribution statistics error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler, 'manage_contributions');
