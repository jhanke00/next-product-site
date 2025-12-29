import { NextRequest } from 'next/server';
import usersData from '@/src/mock/small/users.json';
import { successResponse, notFoundResponse, errorResponse } from '@/src/utils/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/users/[id]
 * Get a single user by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const user = usersData.find((u) => u.id === id);

    if (!user) {
      return notFoundResponse('User');
    }

    return successResponse(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return errorResponse('Failed to fetch user', 500);
  }
}
