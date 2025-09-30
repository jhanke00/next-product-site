import { NextRequest, NextResponse } from 'next/server';
import { ProductAssignment } from '../../../types';
import { readAssignmentsData, writeAssignmentsData } from '../../../utils';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const data = readAssignmentsData();
    const assignment = data.assignments.find((a) => a.productId === productId);

    if (!assignment) {
      // Return empty assignment if not found
      return NextResponse.json({
        productId,
        assignedResources: [],
        customGuide: '',
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(assignment);
  } catch (error) {
    console.error('GET /api/products/[id]/assignments error:', error);
    return NextResponse.json({ error: 'Failed to fetch product assignments' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const productId = parseInt(resolvedParams.id);

    if (isNaN(productId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const body = await request.json();
    const { assignedResources, customGuide } = body;

    // Validation
    if (!Array.isArray(assignedResources)) {
      return NextResponse.json({ error: 'assignedResources must be an array' }, { status: 400 });
    }

    const data = readAssignmentsData();
    const existingIndex = data.assignments.findIndex((a) => a.productId === productId);

    const updatedAssignment: ProductAssignment = {
      productId,
      assignedResources,
      customGuide: customGuide || '',
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // Update existing assignment
      data.assignments[existingIndex] = updatedAssignment;
    } else {
      // Create new assignment
      data.assignments.push(updatedAssignment);
    }

    writeAssignmentsData(data);

    return NextResponse.json(updatedAssignment);
  } catch (error) {
    console.error('PUT /api/products/[id]/assignments error:', error);
    return NextResponse.json({ error: 'Failed to update product assignments' }, { status: 500 });
  }
}
