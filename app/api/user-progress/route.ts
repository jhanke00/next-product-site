import { NextRequest, NextResponse } from 'next/server';
import { UserProgress, ApiResponse } from '@/src/types/learning';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PROGRESS_FILE = path.join(DATA_DIR, 'user-progress.json');

// Utility function to ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Load user progress from JSON file
async function loadProgress(): Promise<UserProgress[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROGRESS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save user progress to JSON file
async function saveProgress(progress: UserProgress[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

// Generate unique ID for progress tracking
function generateProgressId(userId: string, resourceId: string, productId?: string): string {
  const base = `${userId}_${resourceId}`;
  return productId ? `${base}_${productId}` : base;
}

// GET /api/user-progress - Get user progress (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const resourceId = searchParams.get('resourceId');
    const productId = searchParams.get('productId');
    const status = searchParams.get('status');

    if (!userId) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'userId is required',
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    let progressRecords = await loadProgress();

    // Filter by userId
    progressRecords = progressRecords.filter((p) => p.userId === userId);

    // Filter by resourceId if provided
    if (resourceId) {
      progressRecords = progressRecords.filter((p) => p.resourceId === resourceId);
    }

    // Filter by productId if provided
    if (productId) {
      progressRecords = progressRecords.filter((p) => p.productId === productId);
    }

    // Filter by status if provided
    if (status) {
      progressRecords = progressRecords.filter((p) => p.status === status);
    }

    const response: ApiResponse<UserProgress[]> = {
      success: true,
      data: progressRecords,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user progress:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch user progress',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/user-progress - Create or update user progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['userId', 'resourceId', 'status'];
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

    const progressRecords = await loadProgress();
    const now = new Date().toISOString();

    // Find existing progress record
    const existingIndex = progressRecords.findIndex(
      (p) => p.userId === body.userId && p.resourceId === body.resourceId && p.productId === body.productId
    );

    let progressRecord: UserProgress;

    if (existingIndex >= 0) {
      // Update existing record
      const existing = progressRecords[existingIndex];
      progressRecord = {
        ...existing,
        status: body.status,
        progressPercentage: body.progressPercentage ?? existing.progressPercentage,
        timeSpent: body.timeSpent ?? existing.timeSpent,
        lastAccessedAt: now,
        completedAt: body.status === 'completed' ? now : existing.completedAt,
        rating: body.rating ?? existing.rating,
        review: body.review ?? existing.review,
        notes: body.notes ?? existing.notes,
        bookmarked: body.bookmarked ?? existing.bookmarked,
      };

      progressRecords[existingIndex] = progressRecord;
    } else {
      // Create new record
      progressRecord = {
        userId: body.userId,
        resourceId: body.resourceId,
        productId: body.productId,
        status: body.status,
        progressPercentage: body.progressPercentage || 0,
        timeSpent: body.timeSpent || 0,
        lastAccessedAt: now,
        completedAt: body.status === 'completed' ? now : undefined,
        rating: body.rating,
        review: body.review,
        notes: body.notes,
        bookmarked: body.bookmarked || false,
        isPartOfLearningPath: body.isPartOfLearningPath,
        learningPathId: body.learningPathId,
        orderInPath: body.orderInPath,
      };

      progressRecords.push(progressRecord);
    }

    await saveProgress(progressRecords);

    const response: ApiResponse<UserProgress> = {
      success: true,
      data: progressRecord,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error updating user progress:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Failed to update user progress',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
