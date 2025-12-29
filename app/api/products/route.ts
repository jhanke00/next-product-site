import { NextRequest } from 'next/server';
import productsData from '@/src/mock/small/products.json';
import { getPaginationParams, paginateArray, paginatedResponse, errorResponse } from '@/src/utils/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/products
 * Get all products with optional pagination, search, and filtering
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20, max: 100)
 * - search: Search term for product name or description
 * - category: Filter by category
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 * - minRating: Minimum rating filter
 * - inStock: Filter for in-stock products (true/false)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = getPaginationParams(searchParams);

    // Get filter parameters
    const search = searchParams.get('search')?.toLowerCase();
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const inStock = searchParams.get('inStock');

    // Filter products
    let filteredProducts = [...productsData];

    // Search filter
    if (search) {
      filteredProducts = filteredProducts.filter(
        (product) => product.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search)
      );
    }

    // Category filter
    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Price filters
    if (minPrice) {
      const min = parseFloat(minPrice);
      filteredProducts = filteredProducts.filter((product) => parseFloat(product.price) >= min);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      filteredProducts = filteredProducts.filter((product) => parseFloat(product.price) <= max);
    }

    // Rating filter
    if (minRating) {
      const rating = parseFloat(minRating);
      filteredProducts = filteredProducts.filter((product) => product.rating >= rating);
    }

    // In stock filter
    if (inStock === 'true') {
      filteredProducts = filteredProducts.filter((product) => product.countInStock > 0);
    }

    // Get total count after filtering
    const total = filteredProducts.length;

    // Paginate results
    const paginatedProducts = paginateArray(filteredProducts, skip, limit);

    return paginatedResponse(paginatedProducts, page, limit, total);
  } catch (error) {
    console.error('Error fetching products:', error);
    return errorResponse('Failed to fetch products', 500);
  }
}
