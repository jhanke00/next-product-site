import { NextResponse } from 'next/server';

/**
 * Standard API response format
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated response format
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Create a success response
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Create a paginated success response
 */
export function paginatedResponse<T>(data: T[], page: number, limit: number, total: number, status = 200) {
  return NextResponse.json<PaginatedResponse<T>>(
    {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
    { status }
  );
}

/**
 * Create an error response
 */
export function errorResponse(message: string, status = 400) {
  return NextResponse.json<ApiResponse<never>>(
    {
      success: false,
      error: message,
    },
    { status }
  );
}

/**
 * Create a not found response
 */
export function notFoundResponse(resource: string) {
  return errorResponse(`${resource} not found`, 404);
}

/**
 * Parse pagination parameters from URL
 */
export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

/**
 * Paginate an array
 */
export function paginateArray<T>(arr: T[], skip: number, limit: number): T[] {
  return arr.slice(skip, skip + limit);
}
