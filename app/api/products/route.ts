import { NextResponse } from 'next/server';
import { getProducts } from '@/src/utils/products';

export const dynamic = 'force-dynamic';

// Common CORS headers for this route
const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageParam = searchParams.get('page');
    const pageSizeParam = searchParams.get('pageSize');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const pageSize = pageSizeParam ? Math.max(1, Math.min(100, parseInt(pageSizeParam, 10))) : 20;

    const result = await getProducts({ page, pageSize, search, category });
    return NextResponse.json(result, { status: 200, headers: CORS_HEADERS });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
