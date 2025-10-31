import { NextResponse } from 'next/server';
import { getQueryRecommendedProducts } from '@server/services/product';
import { Product } from '@/src/type/products';

export async function GET() {
  try {
    const products = getQueryRecommendedProducts() as unknown as Product[];

    if (!products.length) {
      return NextResponse.json({ message: 'No products found.', data: [] }, { status: 404 });
    }

    return NextResponse.json({ message: 'success', data: products }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Failed to fetch products', data: [] }, { status: 500 });
  }
}
