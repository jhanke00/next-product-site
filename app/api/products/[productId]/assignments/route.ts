import { NextRequest, NextResponse } from 'next/server';
import { ProductResourceAssignment, LearningResource, ApiResponse } from '@/src/types/learning';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const ASSIGNMENTS_FILE = path.join(DATA_DIR, 'product-assignments.json');
const RESOURCES_FILE = path.join(DATA_DIR, 'learning-resources.json');

// Utility function to ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Load assignments from JSON file
async function loadAssignments(): Promise<ProductResourceAssignment[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(ASSIGNMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save assignments to JSON file
async function saveAssignments(assignments: ProductResourceAssignment[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(ASSIGNMENTS_FILE, JSON.stringify(assignments, null, 2));
}

// Load learning resources
async function loadResources(): Promise<LearningResource[]> {
  try {
    const data = await fs.readFile(RESOURCES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Generate unique ID
function generateId(): string {
  return `pa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// GET /api/products/[productId]/assignments - Get learning resource assignments for a product
export async function GET(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const { productId } = params;
    const assignments = await loadAssignments();
    const resources = await loadResources();

    // Get assignments for this product
    const productAssignments = assignments.filter((a) => a.productId === productId);

    // Sort by order index
    productAssignments.sort((a, b) => a.orderIndex - b.orderIndex);

    // Enrich assignments with resource details
    const enrichedAssignments = productAssignments.map((assignment) => {
      const resource = resources.find((r) => r.id === assignment.resourceId);
      return {
        ...assignment,
        resource: resource || null,
      };
    });

    const response: ApiResponse<any[]> = {
      success: true,
      data: enrichedAssignments,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching product assignments:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch product assignments',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/products/[productId]/assignments - Assign learning resource to product
export async function POST(request: NextRequest, { params }: { params: { productId: string } }) {
  try {
    const { productId } = params;
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['resourceId', 'assignedBy'];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          details: { missingFields },
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Check if resource exists
    const resources = await loadResources();
    const resourceExists = resources.some((r) => r.id === body.resourceId);

    if (!resourceExists) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Learning resource not found',
          details: { resourceId: body.resourceId },
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const assignments = await loadAssignments();
    const now = new Date().toISOString();

    // Check if assignment already exists
    const existingAssignment = assignments.find((a) => a.productId === productId && a.resourceId === body.resourceId);

    if (existingAssignment) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'ASSIGNMENT_EXISTS',
          message: 'Resource is already assigned to this product',
          details: { assignmentId: existingAssignment.id },
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 409 });
    }

    // Determine order index (highest + 1)
    const productAssignments = assignments.filter((a) => a.productId === productId);
    const maxOrderIndex = productAssignments.length > 0 ? Math.max(...productAssignments.map((a) => a.orderIndex)) : -1;

    // Create new assignment
    const newAssignment: ProductResourceAssignment = {
      id: generateId(),
      productId,
      resourceId: body.resourceId,
      isRequired: body.isRequired || false,
      orderIndex: body.orderIndex !== undefined ? body.orderIndex : maxOrderIndex + 1,
      customDescription: body.customDescription,
      estimatedCompletionTime: body.estimatedCompletionTime,
      prerequisites: body.prerequisites || [],
      availableFrom: body.availableFrom,
      availableUntil: body.availableUntil,
      assignedBy: body.assignedBy,
      assignedAt: now,
      updatedAt: now,
    };

    assignments.push(newAssignment);
    await saveAssignments(assignments);

    const response: ApiResponse<ProductResourceAssignment> = {
      success: true,
      data: newAssignment,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating product assignment:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Failed to create product assignment',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PUT /api/products/[productId]/assignments - Bulk update assignments for a product
export async function PUT(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params;
    const body = await request.json();

    if (!Array.isArray(body.assignments)) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'assignments must be an array',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    const assignments = await loadAssignments();
    const now = new Date().toISOString();

    // Remove existing assignments for this product
    const filteredAssignments = assignments.filter((a) => a.productId !== productId);

    // Add new assignments
    const newAssignments = body.assignments.map((assignment: any, index: number) => ({
      id: generateId(),
      productId,
      resourceId: assignment.resourceId,
      isRequired: assignment.isRequired || false,
      orderIndex: assignment.orderIndex !== undefined ? assignment.orderIndex : index,
      customDescription: assignment.customDescription,
      estimatedCompletionTime: assignment.estimatedCompletionTime,
      prerequisites: assignment.prerequisites || [],
      availableFrom: assignment.availableFrom,
      availableUntil: assignment.availableUntil,
      assignedBy: assignment.assignedBy || 'system',
      assignedAt: now,
      updatedAt: now,
    }));

    const updatedAssignments = [...filteredAssignments, ...newAssignments];
    await saveAssignments(updatedAssignments);

    const response: ApiResponse<ProductResourceAssignment[]> = {
      success: true,
      data: newAssignments,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating product assignments:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Failed to update product assignments',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
