import { NextResponse } from 'next/server';
import { Product } from '@/src/type/products';
import { getQueryProducts } from '@server/services/product';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    const products = getQueryProducts(q) as unknown as Product[];

    if (!products.length) {
      return NextResponse.json({ message: 'No products found.', data: [] }, { status: 404 });
    }

    return NextResponse.json({ message: 'success', data: products }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Failed to fetch products', data: [] }, { status: 500 });
  }
}
