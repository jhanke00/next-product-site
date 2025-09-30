/**
 * Common types and interfaces for API routes
 */

import { LearningResource, Product } from '@/src/type/products';

// Data wrapper interfaces for file operations
export interface LearningResourcesData {
  resources: LearningResource[];
}

export interface ProductsData {
  products: Product[];
}

export interface ProductAssignment {
  productId: number;
  assignedResources: string[];
  customGuide?: string;
  updatedAt: string;
}

export interface AssignmentsData {
  assignments: ProductAssignment[];
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
}

// Request body types
export interface CreateLearningResourceRequest {
  title: string;
  description: string;
  type: 'training' | 'tutorial';
  duration?: string;
  files: Array<{
    type: 'video' | 'pdf';
  }>;
}

export interface UpdateAssignmentRequest {
  assignedResources: string[];
  customGuide?: string;
}

// API Error types
export interface ApiError {
  error: string;
  code?: string;
  details?: any;
}

// File path constants
export const API_FILE_PATHS = {
  LEARNING_RESOURCES: 'src/data/learning-resources.json',
  PRODUCTS: 'src/data/products.json',
  ASSIGNMENTS: 'src/data/product-assignments.json',
} as const;

export type ApiFilePath = (typeof API_FILE_PATHS)[keyof typeof API_FILE_PATHS];
