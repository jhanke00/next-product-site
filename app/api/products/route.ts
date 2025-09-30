import { NextResponse } from 'next/server';
import { readProductsData } from '../utils';

export async function GET() {
  try {
    const data = readProductsData();
    return NextResponse.json(data.products);
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
