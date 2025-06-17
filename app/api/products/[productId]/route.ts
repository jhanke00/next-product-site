import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@utils/products';

export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
  const { productId } = params;

  const product = await getProductById(productId);

  if (!product) {
    return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}
