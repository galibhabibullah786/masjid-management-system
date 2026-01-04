import { connectDB, Contribution, LandDonor, Committee, GalleryImage } from '@/lib/db';
import { withAuth, successResponse, errorResponse } from '@/lib/api-utils';
import type { TokenPayload } from '@/lib/auth';

// GET /api/statistics/dashboard - Get dashboard statistics
async function getHandler() {
  try {
    await connectDB();

    const [
      totalFunds,
      landDonated,
      totalContributors,
      pendingContributions,
      totalCommittees,
      galleryImages,
      monthlyData,
    ] = await Promise.all([
      Contribution.aggregate([
        { $match: { status: 'verified' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      LandDonor.aggregate([
        { $match: { verified: true } },
        { $group: { _id: null, total: { $sum: '$landAmount' } } },
      ]),
      Contribution.countDocuments({ status: 'verified' }),
      Contribution.countDocuments({ status: 'pending' }),
      Committee.countDocuments(),
      GalleryImage.countDocuments(),
      // Get monthly contribution data for the current year
      Contribution.aggregate([
        {
          $match: {
            status: 'verified',
            date: {
              $gte: new Date(new Date().getFullYear(), 0, 1),
              $lte: new Date(new Date().getFullYear(), 11, 31),
            },
          },
        },
        {
          $group: {
            _id: { $month: '$date' },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Format monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyData = months.map((month, index) => {
      const data = monthlyData.find((m: { _id: number }) => m._id === index + 1);
      return {
        month,
        amount: data?.total || 0,
        count: data?.count || 0,
      };
    });

    // Calculate monthly growth
    const currentMonth = new Date().getMonth();
    const currentMonthAmount = formattedMonthlyData[currentMonth]?.amount || 0;
    const previousMonthAmount = formattedMonthlyData[currentMonth - 1]?.amount || 0;
    const monthlyGrowth = previousMonthAmount > 0 
      ? ((currentMonthAmount - previousMonthAmount) / previousMonthAmount) * 100 
      : 0;

    return successResponse({
      totalFunds: totalFunds[0]?.total || 0,
      landDonated: landDonated[0]?.total || 0,
      totalContributors,
      pendingContributions,
      totalCommittees,
      galleryImages,
      monthlyGrowth: Math.round(monthlyGrowth * 100) / 100,
      monthlyData: formattedMonthlyData,
    }, 'Dashboard statistics retrieved successfully');
  } catch (error) {
    console.error('Get dashboard statistics error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export const GET = withAuth(getHandler as unknown as Parameters<typeof withAuth>[0]);
