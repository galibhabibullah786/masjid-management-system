import { clearAuthCookies } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function POST() {
  try {
    await clearAuthCookies();
    return successResponse(null, 'Logged out successfully');
  } catch (error) {
    console.error('Logout error:', error);
    return errorResponse('Internal server error', 500);
  }
}
