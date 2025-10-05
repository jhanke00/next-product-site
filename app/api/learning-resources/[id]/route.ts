import { NextRequest, NextResponse } from 'next/server';
import { LearningResource, ApiResponse } from '@/src/types/learning';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const RESOURCES_FILE = path.join(DATA_DIR, 'learning-resources.json');
const ASSIGNMENTS_FILE = path.join(DATA_DIR, 'product-assignments.json');

// Load learning resources from JSON file
async function loadResources(): Promise<LearningResource[]> {
  try {
    const data = await fs.readFile(RESOURCES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save learning resources to JSON file
async function saveResources(resources: LearningResource[]): Promise<void> {
  await fs.writeFile(RESOURCES_FILE, JSON.stringify(resources, null, 2));
}

// Load product assignments
async function loadAssignments(): Promise<any[]> {
  try {
    const data = await fs.readFile(ASSIGNMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save product assignments
async function saveAssignments(assignments: any[]): Promise<void> {
  await fs.writeFile(ASSIGNMENTS_FILE, JSON.stringify(assignments, null, 2));
}

// GET /api/learning-resources/[id] - Get specific learning resource
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const resources = await loadResources();
    const resource = resources.find((r) => r.id === id);

    if (!resource) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Learning resource not found',
          details: { resourceId: id },
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Increment view count
    resource.viewCount += 1;
    resource.updatedAt = new Date().toISOString();
    await saveResources(resources);

    const response: ApiResponse<LearningResource> = {
      success: true,
      data: resource,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching learning resource:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch learning resource',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PUT /api/learning-resources/[id] - Update learning resource
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const resources = await loadResources();
    const resourceIndex = resources.findIndex((r) => r.id === id);

    if (resourceIndex === -1) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Learning resource not found',
          details: { resourceId: id },
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const currentResource = resources[resourceIndex];
    const now = new Date().toISOString();

    // Update resource with new data
    const updatedResource: LearningResource = {
      ...currentResource,
      ...body,
      id, // Ensure ID cannot be changed
      createdAt: currentResource.createdAt, // Preserve creation date
      updatedAt: now,
      // Increment version
      version: incrementVersion(currentResource.version),
    };

    resources[resourceIndex] = updatedResource;
    await saveResources(resources);

    const response: ApiResponse<LearningResource> = {
      success: true,
      data: updatedResource,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating learning resource:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Failed to update learning resource',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// DELETE /api/learning-resources/[id] - Delete learning resource
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const resources = await loadResources();
    const resourceIndex = resources.findIndex((r) => r.id === id);

    if (resourceIndex === -1) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Learning resource not found',
          details: { resourceId: id },
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Remove the resource
    const deletedResource = resources.splice(resourceIndex, 1)[0];
    await saveResources(resources);

    // Also remove any product assignments that reference this resource
    try {
      const assignments = await loadAssignments();
      const filteredAssignments = assignments.filter((assignment) => assignment.resourceId !== id);
      await saveAssignments(filteredAssignments);
    } catch (error) {
      console.warn('Warning: Could not update product assignments after resource deletion:', error);
    }

    const response: ApiResponse<{ deletedResource: LearningResource }> = {
      success: true,
      data: { deletedResource },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting learning resource:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'DELETE_ERROR',
        message: 'Failed to delete learning resource',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Helper function to increment semantic version
function incrementVersion(currentVersion: string): string {
  const parts = currentVersion.split('.');
  const patch = parseInt(parts[2] || '0') + 1;
  return `${parts[0]}.${parts[1]}.${patch}`;
}
