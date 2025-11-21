import { NextRequest, NextResponse } from 'next/server';
import {
  getAllLearningResources,
  createLearningResource,
  getLearningResourcesByProductId,
} from '@/src/utils/learning-resources';
import { CreateLearningResourceInput } from '@/src/type/learning-resources';

/**
 * GET /api/learning-resources
 * Get all learning resources or filter by productId query parameter
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('productId');

    if (productId) {
      const resources = getLearningResourcesByProductId(productId);
      return NextResponse.json({ data: resources, count: resources.length });
    }

    const resources = getAllLearningResources();
    return NextResponse.json({ data: resources, count: resources.length });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch learning resources' }, { status: 500 });
  }
}

/**
 * POST /api/learning-resources
 * Create a new learning resource
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateLearningResourceInput = await request.json();

    // Validate required fields
    if (!body.productId || !body.title || !body.url || !body.type) {
      return NextResponse.json({ error: 'Missing required fields: productId, title, url, type' }, { status: 400 });
    }

    // Validate type
    const validTypes = ['guide', 'tutorial', 'video', 'documentation'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json({ error: `Invalid type. Must be one of: ${validTypes.join(', ')}` }, { status: 400 });
    }

    const resource = createLearningResource(body);
    return NextResponse.json({ data: resource }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create learning resource' }, { status: 500 });
  }
}
