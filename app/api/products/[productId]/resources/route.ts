import { NextRequest, NextResponse } from 'next/server';
import { addLearningResource, getResourcesForProduct } from '@utils/learningResources/store';
import { LearningResourceInput } from '@type/resources';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;

  if (!productId?.trim()) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  try {
    const resources = await getResourcesForProduct(productId);
    return NextResponse.json({ resources });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Unable to load learning resources',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;

  if (!productId?.trim()) {
    return NextResponse.json({ error: 'productId is required' }, { status: 400 });
  }

  let payload: LearningResourceInput;
  try {
    const body = await request.json();
    payload = {
      productId,
      title: body.title,
      url: body.url,
      type: body.type,
      description: body.description,
      estimatedMinutes: body.estimatedMinutes,
    };
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Invalid JSON payload',
        details: (error as Error).message,
      },
      { status: 400 }
    );
  }

  try {
    const resource = await addLearningResource(payload);
    return NextResponse.json({ resource }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Unable to add learning resource',
        details: (error as Error).message,
      },
      { status: 400 }
    );
  }
}
