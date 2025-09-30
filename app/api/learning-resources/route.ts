import { NextRequest, NextResponse } from 'next/server';
import { LearningResource } from '@/src/type/products';
import { readResourcesData, writeResourcesData } from '../utils';

export async function GET() {
  try {
    const data = readResourcesData();
    return NextResponse.json(data.resources);
  } catch (error) {
    console.error('GET /api/learning-resources error:', error);
    return NextResponse.json({ error: 'Failed to fetch learning resources' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, type, duration, files } = body;

    // Validate required fields
    if (!title || !description || !type || !files || files.length === 0) {
      return NextResponse.json({ error: 'Missing required fields: title, description, type, files' }, { status: 400 });
    }

    // Validate type
    if (!['training', 'tutorial'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type. Must be "training" or "tutorial"' }, { status: 400 });
    }

    const data = readResourcesData();

    // Function to get next available file
    const getNextAvailableFile = (fileType: string) => {
      if (fileType === 'video') {
        // Use existing video files cyclically
        const existingResources = data.resources.filter((r) => r.type === 'training');
        const nextIndex = (existingResources.length % 3) + 1; // cycle through 1,2,3
        return {
          name: `videoplayback-${nextIndex}.mp4`,
          url: `/media/videoplayback-${nextIndex}.mp4`,
        };
      } else {
        // Use existing PDF files cyclically
        const existingResources = data.resources.filter((r) => r.type === 'tutorial');
        const nextIndex = (existingResources.length % 3) + 1; // cycle through 1,2,3
        return {
          name: `pdf-${nextIndex}.pdf`,
          url: `/media/pdf-${nextIndex}.pdf`,
        };
      }
    };

    // Create new resource
    const newResource: LearningResource = {
      id: `resource-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      type,
      files: files.map((file: any, index: number) => {
        const fileType = file.type || (type === 'training' ? 'video' : 'pdf');
        const availableFile = getNextAvailableFile(fileType);
        return {
          id: `file-${Date.now()}-${index}`,
          name: availableFile.name,
          url: availableFile.url,
          type: fileType === 'video' ? 'video' : 'pdf',
        };
      }),
      duration: duration?.trim() || undefined,
      createdAt: new Date(),
    };

    // Add to existing resources
    data.resources.unshift(newResource); // add to beginning of array

    // Save to file
    writeResourcesData(data);

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    console.error('POST /api/learning-resources error:', error);
    return NextResponse.json({ error: 'Failed to create learning resource' }, { status: 500 });
  }
}
