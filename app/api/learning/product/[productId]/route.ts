import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function GET(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  const smallPath = path.join(process.cwd(), 'src/mock/small/learning.json');
  const largePath = path.join(process.cwd(), 'src/mock/large/learning.json');
  const smallData = await fs.readFile(smallPath, 'utf-8');
  const largeData = await fs.readFile(largePath, 'utf-8');
  const allContents = [...JSON.parse(largeData), ...JSON.parse(smallData)];

  // Deduplicate by resourceId (small file takes precedence)
  const uniqueMap = new Map();
  for (const item of allContents) {
    uniqueMap.set(item.resourceId, item);
  }

  const resources = Array.from(uniqueMap.values()).filter(
    (item: { productId: string }) => item.productId === productId
  );
  return NextResponse.json({ data: resources }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params;
    const updatedResources = await request.json();
    const filePath = path.join(process.cwd(), 'src/mock/small/learning.json');
    const data = await fs.readFile(filePath, 'utf-8');
    let learningContents = JSON.parse(data);

    // Remove all resources for this productId
    learningContents = learningContents.filter((item: { productId: string }) => item.productId !== productId);

    // Add the updated resources
    learningContents.push(...updatedResources);

    await fs.writeFile(filePath, JSON.stringify(learningContents, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Resources updated successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to update resources: ${error.message}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  try {
    const { productId } = await params;
    const filePath = path.join(process.cwd(), 'src/mock/small/learning.json');
    const data = await fs.readFile(filePath, 'utf-8');
    let learningContents = JSON.parse(data);
    const originalLength = learningContents.length;

    // Remove all resources for this productId
    learningContents = learningContents.filter((item: { productId: string }) => item.productId !== productId);

    if (learningContents.length === originalLength) {
      return NextResponse.json({ error: 'No resources found for this product' }, { status: 404 });
    }

    await fs.writeFile(filePath, JSON.stringify(learningContents, null, 2), 'utf-8');
    return NextResponse.json({ message: 'Resources deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to delete resources: ${error.message}` }, { status: 500 });
  }
}
