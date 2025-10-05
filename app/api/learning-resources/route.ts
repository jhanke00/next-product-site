import { NextRequest, NextResponse } from 'next/server';
import { LearningResource, ResourceSearchFilters, ResourceSearchResponse, ApiResponse } from '@/src/types/learning';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const RESOURCES_FILE = path.join(DATA_DIR, 'learning-resources.json');

// Utility function to ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Load learning resources from JSON file
async function loadResources(): Promise<LearningResource[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(RESOURCES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Save learning resources to JSON file
async function saveResources(resources: LearningResource[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(RESOURCES_FILE, JSON.stringify(resources, null, 2));
}

// Generate unique ID
function generateId(): string {
  return `lr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Filter and search resources
function filterResources(resources: LearningResource[], filters: ResourceSearchFilters): LearningResource[] {
  let filtered = [...resources];

  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(
      (resource) =>
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        resource.author.toLowerCase().includes(query)
    );
  }

  // Type filter
  if (filters.types && filters.types.length > 0) {
    filtered = filtered.filter((resource) => filters.types!.includes(resource.type));
  }

  // Category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter((resource) => filters.categories!.includes(resource.category));
  }

  // Difficulty filter
  if (filters.difficulties && filters.difficulties.length > 0) {
    filtered = filtered.filter((resource) => filters.difficulties!.includes(resource.difficulty));
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((resource) => filters.tags!.some((tag) => resource.tags.includes(tag)));
  }

  // Sort results
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'rating':
          aValue = a.averageRating;
          bValue = b.averageRating;
          break;
        case 'duration':
          aValue = a.duration || 0;
          bValue = b.duration || 0;
          break;
        case 'popularity':
          aValue = a.viewCount + a.completionCount;
          bValue = b.viewCount + b.completionCount;
          break;
        default:
          return 0;
      }

      if (filters.sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      } else {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }
    });
  }

  return filtered;
}

// Paginate results
function paginateResults<T>(items: T[], page: number = 1, limit: number = 10): { items: T[]; pagination: any } {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
      hasNext: endIndex < items.length,
      hasPrev: page > 1,
    },
  };
}

// GET /api/learning-resources - Search and list learning resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse search filters from query parameters
    const filters: ResourceSearchFilters = {
      query: searchParams.get('query') || undefined,
      types: (searchParams.get('types')?.split(',') as any) || undefined,
      categories: (searchParams.get('categories')?.split(',') as any) || undefined,
      difficulties: (searchParams.get('difficulties')?.split(',') as any) || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    };

    const resources = await loadResources();
    const filteredResources = filterResources(resources, filters);
    const { items, pagination } = paginateResults(filteredResources, filters.page, filters.limit);

    const response: ApiResponse<ResourceSearchResponse> = {
      success: true,
      data: {
        resources: items,
        total: pagination.total,
        page: pagination.page,
        totalPages: pagination.totalPages,
        hasMore: pagination.hasNext,
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching learning resources:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch learning resources',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// POST /api/learning-resources - Create new learning resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'type', 'category', 'difficulty', 'author'];
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

    const now = new Date().toISOString();

    // Create new learning resource
    const newResource: LearningResource = {
      id: generateId(),
      title: body.title,
      description: body.description,
      type: body.type,
      category: body.category,
      difficulty: body.difficulty,
      status: body.status || 'draft',

      // Optional content fields
      content: body.content,
      fileUrl: body.fileUrl,
      thumbnailUrl: body.thumbnailUrl,
      duration: body.duration,
      fileSize: body.fileSize,

      // Metadata
      tags: body.tags || [],
      author: body.author,
      createdAt: now,
      updatedAt: now,
      version: '1.0.0',

      // Learning data
      learningObjectives: body.learningObjectives || [],
      prerequisites: body.prerequisites || [],

      // Initialize analytics
      viewCount: 0,
      completionCount: 0,
      averageRating: 0,
      reviewCount: 0,

      // SEO fields
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
      altText: body.altText,
      transcriptUrl: body.transcriptUrl,
    };

    // Load existing resources and add new one
    const resources = await loadResources();
    resources.push(newResource);
    await saveResources(resources);

    const response: ApiResponse<LearningResource> = {
      success: true,
      data: newResource,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating learning resource:', error);

    const errorResponse: ApiResponse<null> = {
      success: false,
      error: {
        code: 'CREATE_ERROR',
        message: 'Failed to create learning resource',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
