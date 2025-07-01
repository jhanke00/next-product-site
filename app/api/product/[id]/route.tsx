import { NextRequest, NextResponse } from 'next/server';
import { getProductById } from '@/src/utils/products';

type Context = {
  params: {
    id: string;
  };
};

/**
 * API: Get api/products/:id
 * return a single product by ID
 */
export async function GET(_: NextRequest, context: Context) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ error: 'Product Id is required' }, { status: 400 });
    }

    const product = getProductById(id);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ data: product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
