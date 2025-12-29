import { NextRequest } from 'next/server';
import usersData from '@/src/mock/small/users.json';
import { getPaginationParams, paginateArray, paginatedResponse, errorResponse } from '@/src/utils/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/users
 * Get all users with optional pagination and search
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - search: Search term for name or email
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);

    // Get search parameter
    const search = searchParams.get('search')?.toLowerCase();

    // Filter users
    let filteredUsers = [...usersData];

    // Search filter
    if (search) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(search) ||
          user.lastName.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search)
      );
    }

    // Get total count after filtering
    const total = filteredUsers.length;

    // Paginate results
    const paginatedUsers = paginateArray(filteredUsers, skip, limit);

    return paginatedResponse(paginatedUsers, page, limit, total);
  } catch (error) {
    console.error('Error fetching users:', error);
    return errorResponse('Failed to fetch users', 500);
  }
}
