import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function GET(request: NextRequest, { params }: { params: Promise<{ resourceId: string }> }) {
  const { resourceId } = await params;
  const smallPath = path.join(process.cwd(), 'src/mock/small/learning.json');
  const largePath = path.join(process.cwd(), 'src/mock/large/learning.json');
  const smallData = await fs.readFile(smallPath, 'utf-8');
  const largeData = await fs.readFile(largePath, 'utf-8');
  const learningContents = [...JSON.parse(smallData), ...JSON.parse(largeData)];
  const resource = learningContents.find((item: { resourceId: string }) => item.resourceId === resourceId);
  return NextResponse.json({ data: resource || null }, { status: 200 });
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ resourceId: string }> }) {
  try {
    const { resourceId } = await params;
    const updatedResource = await request.json();
    const smallPath = path.join(process.cwd(), 'src/mock/small/learning.json');
    const largePath = path.join(process.cwd(), 'src/mock/large/learning.json');
    const smallData = await fs.readFile(smallPath, 'utf-8');
    const learningContentsSmall = [...JSON.parse(smallData)];
    const indexSmall = learningContentsSmall.findIndex(
      (item: { resourceId: string }) => item.resourceId === resourceId
    );
    if (indexSmall !== -1) {
      learningContentsSmall[indexSmall] = { ...learningContentsSmall[indexSmall], ...updatedResource };
      await fs.writeFile(smallPath, JSON.stringify(learningContentsSmall, null, 2), 'utf-8');
      return NextResponse.json({ message: 'Resource updated successfully' }, { status: 200 });
    }
    const largeData = await fs.readFile(largePath, 'utf-8');
    const learningContentsLarge = [...JSON.parse(largeData)];
    const indexLarge = learningContentsLarge.findIndex(
      (item: { resourceId: string }) => item.resourceId === resourceId
    );
    if (indexLarge !== -1) {
      learningContentsLarge[indexLarge] = { ...learningContentsLarge[indexLarge], ...updatedResource };
      await fs.writeFile(largePath, JSON.stringify(learningContentsLarge, null, 2), 'utf-8');
      return NextResponse.json({ message: 'Resource updated successfully' }, { status: 200 });
    }
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to update resource: ${error.message}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ resourceId: string }> }) {
  try {
    const { resourceId } = await params;
    const smallPath = path.join(process.cwd(), 'src/mock/small/learning.json');
    const largePath = path.join(process.cwd(), 'src/mock/large/learning.json');
    const smallData = await fs.readFile(smallPath, 'utf-8');
    const learningContentsSmall = JSON.parse(smallData);
    const indexSmall = learningContentsSmall.findIndex(
      (item: { resourceId: string }) => item.resourceId === resourceId
    );
    if (indexSmall !== -1) {
      learningContentsSmall.splice(indexSmall, 1);
      await fs.writeFile(smallPath, JSON.stringify(learningContentsSmall, null, 2), 'utf-8');
      return NextResponse.json({ message: 'Resource deleted successfully' }, { status: 200 });
    }
    const largeData = await fs.readFile(largePath, 'utf-8');
    const learningContentsLarge = JSON.parse(largeData);
    const indexLarge = learningContentsLarge.findIndex(
      (item: { resourceId: string }) => item.resourceId === resourceId
    );
    if (indexLarge !== -1) {
      learningContentsLarge.splice(indexLarge, 1);
      await fs.writeFile(largePath, JSON.stringify(learningContentsLarge, null, 2), 'utf-8');
      return NextResponse.json({ message: 'Resource deleted successfully' }, { status: 200 });
    }
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: `Failed to delete resource: ${error.message}` }, { status: 500 });
  }
}
