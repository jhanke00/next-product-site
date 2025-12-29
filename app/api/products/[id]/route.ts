import { NextRequest } from 'next/server';
import productsData from '@/src/mock/small/products.json';
import { successResponse, notFoundResponse, errorResponse } from '@/src/utils/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products/[id]
 * Get a single product by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const product = productsData.find((p) => p.id === id);

    if (!product) {
      return notFoundResponse('Product');
    }

    return successResponse(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return errorResponse('Failed to fetch product', 500);
  }
}
