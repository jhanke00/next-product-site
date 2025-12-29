import { NextRequest } from 'next/server';
import ordersData from '@/src/mock/small/orders.json';
import { successResponse, notFoundResponse, errorResponse } from '@/src/utils/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/orders/[id]
 * Get a single order by index ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orderIndex = parseInt(id, 10);

    if (isNaN(orderIndex) || orderIndex < 0 || orderIndex >= ordersData.length) {
      return notFoundResponse('Order');
    }

    const order = {
      id: orderIndex,
      ...ordersData[orderIndex],
    };

    return successResponse(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return errorResponse('Failed to fetch order', 500);
  }
}
