import { NextRequest, NextResponse } from 'next/server';
import resources from '@/src/mock/small/learning-resources.json';

let inMemoryResources = [...resources];

export async function GET(req: NextRequest, context: { params: Promise<{ productId: string }> }) {
  const { productId } = await context.params;
  const productResources = inMemoryResources.filter((r) => r.productId === productId);
  return NextResponse.json(productResources);
}

export async function POST(req: NextRequest, context: { params: Promise<{ productId: string }> }) {
  const { productId } = await context.params;
  const body = await req.json();
  const newResource = {
    id: `lr-${Date.now()}`,
    productId,
    title: body.title || 'Untitled Resource',
    type: body.type || 'other',
    url: body.url || '',
    description: body.description || '',
    createdAt: new Date().toISOString(),
  };
  inMemoryResources.push(newResource);
  return NextResponse.json(newResource, { status: 201 });
}
