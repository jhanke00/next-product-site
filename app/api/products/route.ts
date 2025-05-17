import { NextResponse } from 'next/server';
import { getProducts } from './service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  const products = await getProducts(page, pageSize);
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ youSent: body });
}
