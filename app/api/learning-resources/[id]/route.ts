import { NextRequest, NextResponse } from 'next/server';
import { readResourcesData, writeResourcesData, readAssignmentsData, writeAssignmentsData } from '../../utils';

function removeResourceFromAssignments(resourceId: string): void {
  const assignmentsData = readAssignmentsData();
  let updated = false;

  // Remove resource from all product assignments
  assignmentsData.assignments.forEach((assignment) => {
    const initialLength = assignment.assignedResources.length;
    assignment.assignedResources = assignment.assignedResources.filter((id) => id !== resourceId);

    if (assignment.assignedResources.length !== initialLength) {
      assignment.updatedAt = new Date().toISOString();
      updated = true;
    }
  });

  if (updated) {
    writeAssignmentsData(assignmentsData);
    console.log(`Removed resource ${resourceId} from product assignments`);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: 'Resource ID is required' }, { status: 400 });
    }

    const data = readResourcesData();
    const resourceIndex = data.resources.findIndex((r) => r.id === id);

    if (resourceIndex === -1) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }

    // Remove resource from array
    const deletedResource = data.resources.splice(resourceIndex, 1)[0];

    // CASCADE DELETE: remove resource from all product assignments
    removeResourceFromAssignments(id);

    // Save updated resource data
    writeResourcesData(data);

    return NextResponse.json(
      {
        message: 'Resource deleted successfully and removed from all product assignments',
        resource: deletedResource,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE /api/learning-resources/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete learning resource' }, { status: 500 });
  }
}
