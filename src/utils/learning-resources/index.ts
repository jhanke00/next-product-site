import {
  LearningResource,
  CreateLearningResourceInput,
  UpdateLearningResourceInput,
} from '@/src/type/learning-resources';
import smallData from '@/src/mock/small/learning-resources.json';
import largeData from '@/src/mock/large/learning-resources.json';

// In-memory storage (in a real app, this would be a database)
let learningResources: LearningResource[] = [...smallData, ...largeData] as LearningResource[];

/**
 * Get all learning resources for a specific product
 */
export function getLearningResourcesByProductId(productId: string): LearningResource[] {
  return learningResources.filter((resource) => resource.productId === productId);
}

/**
 * Get a single learning resource by ID
 */
export function getLearningResourceById(id: string): LearningResource | undefined {
  return learningResources.find((resource) => resource.id === id);
}

/**
 * Create a new learning resource
 */
export function createLearningResource(input: CreateLearningResourceInput): LearningResource {
  const newResource: LearningResource = {
    id: `lr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  learningResources.push(newResource);
  return newResource;
}

/**
 * Update an existing learning resource
 */
export function updateLearningResource(id: string, input: UpdateLearningResourceInput): LearningResource | null {
  const index = learningResources.findIndex((resource) => resource.id === id);
  if (index === -1) {
    return null;
  }

  learningResources[index] = {
    ...learningResources[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  return learningResources[index];
}

/**
 * Delete a learning resource
 */
export function deleteLearningResource(id: string): boolean {
  const index = learningResources.findIndex((resource) => resource.id === id);
  if (index === -1) {
    return false;
  }

  learningResources.splice(index, 1);
  return true;
}

/**
 * Get all learning resources (for admin purposes)
 */
export function getAllLearningResources(): LearningResource[] {
  return learningResources;
}
