import { NextRequest, NextResponse } from 'next/server';
import {
  getLearningResourceById,
  updateLearningResource,
  deleteLearningResource,
} from '@/src/utils/learning-resources';
import { UpdateLearningResourceInput } from '@/src/type/learning-resources';

/**
 * GET /api/learning-resources/[id]
 * Get a single learning resource by ID
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const resource = getLearningResourceById(resolvedParams.id);

    if (!resource) {
      return NextResponse.json({ error: 'Learning resource not found' }, { status: 404 });
    }

    return NextResponse.json({ data: resource });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch learning resource' }, { status: 500 });
  }
}

/**
 * PUT /api/learning-resources/[id]
 * Update a learning resource
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body: UpdateLearningResourceInput = await request.json();

    // Validate type if provided
    if (body.type) {
      const validTypes = ['guide', 'tutorial', 'video', 'documentation'];
      if (!validTypes.includes(body.type)) {
        return NextResponse.json({ error: `Invalid type. Must be one of: ${validTypes.join(', ')}` }, { status: 400 });
      }
    }

    const resource = updateLearningResource(resolvedParams.id, body);

    if (!resource) {
      return NextResponse.json({ error: 'Learning resource not found' }, { status: 404 });
    }

    return NextResponse.json({ data: resource });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update learning resource' }, { status: 500 });
  }
}

/**
 * DELETE /api/learning-resources/[id]
 * Delete a learning resource
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const deleted = deleteLearningResource(resolvedParams.id);

    if (!deleted) {
      return NextResponse.json({ error: 'Learning resource not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Learning resource deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete learning resource' }, { status: 500 });
  }
}
