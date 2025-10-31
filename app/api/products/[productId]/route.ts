import { NextResponse } from 'next/server';
import { getAllProducts } from '@/src/utils/products';

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

export async function GET(_req: Request, context: { params: { productId: string } }) {
  try {
    const id = context?.params?.productId;
    const products = getAllProducts();
    const product = products.find((p) => String((p as any).id) === String(id));
    if (!product) {
      return NextResponse.json({ error: 'Not Found' }, { status: 404, headers: CORS_HEADERS });
    }
    return NextResponse.json(product, { status: 200, headers: CORS_HEADERS });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
