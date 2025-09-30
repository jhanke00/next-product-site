/**
 * Utility functions for API file operations
 */

import fs from 'fs';
import path from 'path';
import { LearningResourcesData, ProductsData, AssignmentsData, API_FILE_PATHS } from './types';

// Generic file read/write functions
export function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return defaultValue;
  }
}

export function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    throw new Error('Failed to save data');
  }
}

// Specific data access functions
export function readResourcesData(): LearningResourcesData {
  return readJsonFile(API_FILE_PATHS.LEARNING_RESOURCES, { resources: [] });
}

export function writeResourcesData(data: LearningResourcesData): void {
  writeJsonFile(API_FILE_PATHS.LEARNING_RESOURCES, data);
}

export function readProductsData(): ProductsData {
  return readJsonFile(API_FILE_PATHS.PRODUCTS, { products: [] });
}

export function writeProductsData(data: ProductsData): void {
  writeJsonFile(API_FILE_PATHS.PRODUCTS, data);
}

export function readAssignmentsData(): AssignmentsData {
  return readJsonFile(API_FILE_PATHS.ASSIGNMENTS, { assignments: [] });
}

export function writeAssignmentsData(data: AssignmentsData): void {
  writeJsonFile(API_FILE_PATHS.ASSIGNMENTS, data);
}

// Error response helpers
export function createErrorResponse(message: string, status = 500) {
  return Response.json({ error: message }, { status });
}

export function createSuccessResponse<T>(data: T, status = 200) {
  return Response.json(data, { status });
}
