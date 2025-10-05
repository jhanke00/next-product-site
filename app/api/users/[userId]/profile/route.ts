import { NextRequest, NextResponse } from 'next/server';
import { UserLearningProfile, ApiResponse } from '@/src/types/learning';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PROFILES_FILE = path.join(DATA_DIR, 'user-profiles.json');

// Utility function to ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Load user profiles from JSON file
async function loadProfiles(): Promise<UserLearningProfile[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(PROFILES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save user profiles to JSON file
async function saveProfiles(profiles: UserLearningProfile[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PROFILES_FILE, JSON.stringify(profiles, null, 2));
}

// GET /api/users/[userId]/profile - Get user learning profile
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;
    const profiles = await loadProfiles();
    const profile = profiles.find((p) => p.userId === userId);

    if (!profile) {
      // Create a default profile if none exists
      const now = new Date().toISOString();
      const defaultProfile: UserLearningProfile = {
        userId,
        preferredLanguage: 'en',
        preferredDifficulty: ['beginner', 'intermediate'],
        interests: ['tutorial', 'training'],
        learningGoals: [],
        totalResourcesCompleted: 0,
        totalTimeSpent: 0,
        currentStreak: 0,
        longestStreak: 0,
        certificates: [],
        badges: [],
        emailNotifications: true,
        progressReminders: true,
        createdAt: now,
        updatedAt: now,
      };

      profiles.push(defaultProfile);
      await saveProfiles(profiles);

      const response: ApiResponse<UserLearningProfile> = {
        success: true,
        data: defaultProfile,
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json(response, { status: 201 });
    }

    const response: ApiResponse<UserLearningProfile> = {
      success: true,
      data: profile,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching user profile:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch user profile',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// PUT /api/users/[userId]/profile - Update user learning profile
export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;
    const body = await request.json();
    const profiles = await loadProfiles();
    const profileIndex = profiles.findIndex((p) => p.userId === userId);

    if (profileIndex === -1) {
      const errorResponse: ApiResponse<null> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User profile not found',
          details: { userId },
        },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const currentProfile = profiles[profileIndex];
    const now = new Date().toISOString();

    // Update profile with new data
    const updatedProfile: UserLearningProfile = {
      ...currentProfile,
      ...body,
      userId, // Ensure userId cannot be changed
      createdAt: currentProfile.createdAt, // Preserve creation date
      updatedAt: now,
    };

    profiles[profileIndex] = updatedProfile;
    await saveProfiles(profiles);

    const response: ApiResponse<UserLearningProfile> = {
      success: true,
      data: updatedProfile,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating user profile:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: 'Failed to update user profile',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
