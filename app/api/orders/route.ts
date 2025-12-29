import { NextRequest } from 'next/server';
import ordersData from '@/src/mock/small/orders.json';
import { getPaginationParams, paginateArray, paginatedResponse, errorResponse } from '@/src/utils/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/orders
 * Get all orders with optional pagination and filtering
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - userId: Filter orders by user ID
 * - minTotal: Minimum order total filter
 * - maxTotal: Maximum order total filter
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);

    // Get filter parameters
    const userId = searchParams.get('userId');
    const minTotal = searchParams.get('minTotal');
    const maxTotal = searchParams.get('maxTotal');

    // Add index-based IDs to orders
    const ordersWithIds = ordersData.map((order, index) => ({
      id: index,
      ...order,
    }));

    // Filter orders
    let filteredOrders = [...ordersWithIds];

    // User ID filter
    if (userId) {
      filteredOrders = filteredOrders.filter((order) => order.user === userId);
    }

    // Total filters
    if (minTotal) {
      const min = parseFloat(minTotal);
      filteredOrders = filteredOrders.filter((order) => order.total >= min);
    }

    if (maxTotal) {
      const max = parseFloat(maxTotal);
      filteredOrders = filteredOrders.filter((order) => order.total <= max);
    }

    // Get total count after filtering
    const total = filteredOrders.length;

    // Paginate results
    const paginatedOrders = paginateArray(filteredOrders, skip, limit);

    return paginatedResponse(paginatedOrders, page, limit, total);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return errorResponse('Failed to fetch orders', 500);
  }
}
