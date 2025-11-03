import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { LearningResource } from '@/src/type/resources';

const RESOURCES_FILE_PATH = path.join(process.cwd(), 'src', 'mock', 'generated', 'resources.json');

function ensureResourcesFile() {
  const directory = path.dirname(RESOURCES_FILE_PATH);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (!fs.existsSync(RESOURCES_FILE_PATH)) {
    fs.writeFileSync(RESOURCES_FILE_PATH, JSON.stringify([], null, 2));
  }
}

function loadResourcesFromFile(): LearningResource[] {
  ensureResourcesFile();

  try {
    const content = fs.readFileSync(RESOURCES_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(content) as LearningResource[];
    return parsed;
  } catch (error) {
    console.error('Failed to load learning resources:', error);
    return [];
  }
}

function persistResources(resources: LearningResource[]) {
  ensureResourcesFile();

  try {
    fs.writeFileSync(RESOURCES_FILE_PATH, JSON.stringify(resources, null, 2));
  } catch (error) {
    console.error('Failed to persist learning resources:', error);
  }
}

export function getResourcesForProduct(productId: string): LearningResource[] {
  return loadResourcesFromFile().filter((resource) => resource.productId === productId);
}

export function addResourceToProduct(
  productId: string,
  data: Omit<LearningResource, 'id' | 'productId' | 'createdAt' | 'updatedAt'>
): LearningResource {
  const resources = loadResourcesFromFile();

  const newResource: LearningResource = {
    id: randomUUID(),
    productId,
    title: data.title,
    description: data.description,
    url: data.url,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  resources.push(newResource);
  persistResources(resources);

  return newResource;
}

export function listAllResources(): LearningResource[] {
  return loadResourcesFromFile();
}
