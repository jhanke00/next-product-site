import { NextResponse } from 'next/server';
import { getOrdersByUserId } from '@utils/users';
import { getCachedData, setCachedData } from '@utils/cache';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  const cacheKey = `orders_${params.userId}_${page}_${limit}`;
  let paginatedOrders = getCachedData(cacheKey);

  if (!paginatedOrders) {
    paginatedOrders = await getOrdersByUserId(params.userId, page, limit);
    setCachedData(cacheKey, paginatedOrders, 300000); // Cache for 5 minutes
  }

  return NextResponse.json(paginatedOrders);
}
