import { NextResponse } from 'next/server';
import { getProducts } from '@utils/products/getProducts';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    /*if (!q) {
      return NextResponse.json(
        { message: "Missing search query." },
        { status: 400 }
      );
    }*/
    const products = getProducts(q);

    if (!products.length) {
      return NextResponse.json({ message: 'No products found.' }, { status: 404 });
    }

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);

    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}
