import { NextRequest, NextResponse } from 'next/server';
import { getResourcesForProduct, addResourceToProduct } from '@/src/utils/resources';
import { getProductById } from '@/src/utils/products';

function extractProductId(request: NextRequest): string | null {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  const productIndex = segments.findIndex((segment) => segment === 'products');

  if (productIndex === -1 || productIndex + 1 >= segments.length) {
    return null;
  }

  return decodeURIComponent(segments[productIndex + 1]);
}

export async function GET(request: NextRequest) {
  const productId = extractProductId(request);

  if (!productId) {
    return NextResponse.json({ error: 'Product not specified' }, { status: 400 });
  }

  try {
    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const resources = getResourcesForProduct(productId);
    return NextResponse.json({ resources });
  } catch (error) {
    console.error('Failed to fetch learning resources:', error);
    return NextResponse.json({ error: 'Failed to fetch learning resources' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const productId = extractProductId(request);

  if (!productId) {
    return NextResponse.json({ error: 'Product not specified' }, { status: 400 });
  }

  try {
    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const body = await request.json();
    const title = body.title?.toString().trim();
    const description = body.description?.toString().trim();
    const url = body.url?.toString().trim();

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
    }

    try {
      new URL(url);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid URL provided' }, { status: 400 });
    }

    const resource = addResourceToProduct(productId, {
      title,
      description: description ?? '',
      url,
    });

    return NextResponse.json({ resource }, { status: 201 });
  } catch (error) {
    console.error('Failed to create learning resource:', error);
    return NextResponse.json({ error: 'Failed to create learning resource' }, { status: 500 });
  }
}
