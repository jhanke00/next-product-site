import { NextResponse } from 'next/server';
import { getTotalSpentByUserId } from '@utils/users';
import { getCachedData, setCachedData } from '@utils/cache';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const cacheKey = `total_spent_${params.userId}`;
  let totalSpent = getCachedData(cacheKey);

  if (totalSpent === undefined) {
    totalSpent = await getTotalSpentByUserId(params.userId);
    setCachedData(cacheKey, totalSpent, 300000); // Cache for 5 minutes
  }

  return NextResponse.json({ totalSpent });
}
