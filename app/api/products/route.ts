import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/src/utils/products';

/**
 * API: GET /api/products?page=1&limit=20&search=watch
 * Supports pagination and search (optional)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    let search = searchParams.get('search') || '';

    if (limit > 100) {
      return NextResponse.json({ error: 'Limit cannot exceed 100' }, { status: 400 });
    }

    const { results, total, current_page, next_page, total_pages, page_limit } = searchProducts(page, limit, search);
    return NextResponse.json(
      { data: results, pagination: { total, current_page, next_page, total_pages, page_limit } },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
