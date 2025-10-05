import { NextRequest, NextResponse } from 'next/server';
import {
  LearningAnalytics,
  LearningResource,
  UserProgress,
  ApiResponse,
  ResourceCategory,
  DifficultyLevel,
} from '@/src/types/learning';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const RESOURCES_FILE = path.join(DATA_DIR, 'learning-resources.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'user-progress.json');

// Load learning resources
async function loadResources(): Promise<LearningResource[]> {
  try {
    const data = await fs.readFile(RESOURCES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Load user progress
async function loadProgress(): Promise<UserProgress[]> {
  try {
    const data = await fs.readFile(PROGRESS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Calculate completion rate for a resource
function calculateCompletionRate(resourceId: string, progressRecords: UserProgress[]): number {
  const resourceProgress = progressRecords.filter((p) => p.resourceId === resourceId);
  if (resourceProgress.length === 0) return 0;

  const completedCount = resourceProgress.filter((p) => p.status === 'completed').length;
  return (completedCount / resourceProgress.length) * 100;
}

// Get weekly progress data
function getWeeklyProgress(progressRecords: UserProgress[]): Array<{
  week: string;
  completions: number;
  newUsers: number;
  totalTimeSpent: number;
}> {
  const weeklyData = new Map<string, { completions: number; users: Set<string>; timeSpent: number }>();

  progressRecords.forEach((progress) => {
    const date = new Date(progress.lastAccessedAt);
    const weekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0];

    if (!weeklyData.has(weekKey)) {
      weeklyData.set(weekKey, { completions: 0, users: new Set(), timeSpent: 0 });
    }

    const data = weeklyData.get(weekKey)!;

    if (progress.status === 'completed') {
      data.completions++;
    }

    data.users.add(progress.userId);
    data.timeSpent += progress.timeSpent;
  });

  return Array.from(weeklyData.entries())
    .map(([week, data]) => ({
      week,
      completions: data.completions,
      newUsers: data.users.size,
      totalTimeSpent: data.timeSpent,
    }))
    .sort((a, b) => a.week.localeCompare(b.week))
    .slice(-12); // Last 12 weeks
}

// GET /api/analytics/learning - Get learning analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30d'; // 7d, 30d, 90d, 1y
    const category = searchParams.get('category') as ResourceCategory;

    const resources = await loadResources();
    const progressRecords = await loadProgress();

    // Filter progress by timeframe
    const cutoffDate = new Date();
    switch (timeframe) {
      case '7d':
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(cutoffDate.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(cutoffDate.getDate() - 90);
        break;
      case '1y':
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
        break;
    }

    const filteredProgress = progressRecords.filter(
      (p) =>
        new Date(p.lastAccessedAt) >= cutoffDate &&
        (!category || resources.find((r) => r.id === p.resourceId)?.category === category)
    );

    // Calculate top performing resources
    const topPerformingResources = resources
      .map((resource) => {
        const resourceProgress = filteredProgress.filter((p) => p.resourceId === resource.id);
        const completionRate = calculateCompletionRate(resource.id, resourceProgress);

        return {
          resource,
          completionRate,
          averageRating: resource.averageRating,
          totalViews: resource.viewCount,
        };
      })
      .filter((item) => item.totalViews > 0)
      .sort((a, b) => {
        // Sort by completion rate first, then by rating, then by views
        if (a.completionRate !== b.completionRate) {
          return b.completionRate - a.completionRate;
        }
        if (a.averageRating !== b.averageRating) {
          return b.averageRating - a.averageRating;
        }
        return b.totalViews - a.totalViews;
      })
      .slice(0, 10);

    // Calculate user engagement metrics
    const uniqueUsers = new Set(filteredProgress.map((p) => p.userId));
    const totalUsers = uniqueUsers.size;
    const activeUsers = new Set(
      filteredProgress
        .filter((p) => new Date(p.lastAccessedAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .map((p) => p.userId)
    ).size;

    const totalTimeSpent = filteredProgress.reduce((sum, p) => sum + p.timeSpent, 0);
    const avgSessionTime = totalUsers > 0 ? totalTimeSpent / totalUsers : 0;

    // Calculate resources by category
    const resourcesByCategory = resources.reduce(
      (acc, resource) => {
        acc[resource.category] = (acc[resource.category] || 0) + 1;
        return acc;
      },
      {} as Record<ResourceCategory, number>
    );

    // Calculate completion rate by difficulty
    const completionRateByDifficulty = {} as Record<DifficultyLevel, number>;
    ['beginner', 'intermediate', 'advanced', 'expert'].forEach((difficulty) => {
      const difficultyResources = resources.filter((r) => r.difficulty === difficulty);
      const difficultyProgress = filteredProgress.filter((p) => difficultyResources.some((r) => r.id === p.resourceId));

      if (difficultyProgress.length > 0) {
        const completed = difficultyProgress.filter((p) => p.status === 'completed').length;
        completionRateByDifficulty[difficulty as DifficultyLevel] = (completed / difficultyProgress.length) * 100;
      } else {
        completionRateByDifficulty[difficulty as DifficultyLevel] = 0;
      }
    });

    // Get weekly progress trends
    const weeklyProgress = getWeeklyProgress(filteredProgress);

    const analytics: LearningAnalytics = {
      topPerformingResources,
      totalUsers,
      activeUsers,
      avgSessionTime,
      resourcesByCategory,
      completionRateByDifficulty,
      weeklyProgress,
    };

    const response: ApiResponse<LearningAnalytics> = {
      success: true,
      data: analytics,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching learning analytics:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'ANALYTICS_ERROR',
        message: 'Failed to fetch learning analytics',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/analytics/learning/event - Track learning events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = ['userId', 'resourceId', 'eventType'];
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

    // For now, we'll just acknowledge the event
    // In a real implementation, you might want to store these events
    // for more detailed analytics

    const response: ApiResponse<{ acknowledged: boolean }> = {
      success: true,
      data: { acknowledged: true },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error tracking learning event:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'TRACKING_ERROR',
        message: 'Failed to track learning event',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
