import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID as nodeRandomUUID } from 'crypto';
import { LearningResource, LearningResourceInput } from '@/src/type/resources';

const DEFAULT_RESOURCES_PATH = path.join(process.cwd(), 'src', 'mock', 'resources.json');

const resolveResourcesPath = () => {
  const overridePath = process.env.LEARNING_RESOURCES_PATH;
  if (overridePath) {
    return path.isAbsolute(overridePath) ? overridePath : path.join(process.cwd(), overridePath);
  }
  return DEFAULT_RESOURCES_PATH;
};

const ensureStoreExists = async (filePath: string) => {
  try {
    await fs.access(filePath);
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify([], null, 2));
    } else {
      throw error;
    }
  }
};

const readAllResources = async (): Promise<LearningResource[]> => {
  const filePath = resolveResourcesPath();
  await ensureStoreExists(filePath);

  const fileContents = await fs.readFile(filePath, 'utf-8');
  try {
    const parsed: LearningResource[] = JSON.parse(fileContents);
    if (!Array.isArray(parsed)) {
      throw new Error('Learning resource store is not an array');
    }
    return parsed;
  } catch (error) {
    throw new Error(`Unable to parse learning resources from ${filePath}: ${(error as Error).message}`);
  }
};

const writeAllResources = async (resources: LearningResource[]): Promise<void> => {
  const filePath = resolveResourcesPath();
  await fs.writeFile(filePath, `${JSON.stringify(resources, null, 2)}\n`, 'utf-8');
};

// Simple in-process mutex per file path to prevent concurrent read-modify-write races.
const locks = new Map<string, Promise<void>>();

const withLock = async <T>(filePath: string, fn: () => Promise<T>): Promise<T> => {
  const prev = locks.get(filePath) ?? Promise.resolve();

  let resolveNext: () => void;
  const next = new Promise<void>((res) => {
    resolveNext = res;
  });

  // Chain execution
  locks.set(
    filePath,
    prev.then(() => next)
  );

  try {
    // wait for previous to finish
    await prev;
    const result = await fn();
    return result;
  } finally {
    // allow the next in chain to run
    resolveNext!();
    // cleanup if this is the last
    const current = locks.get(filePath);
    if (current === next) {
      locks.delete(filePath);
    }
  }
};

const validateResourceInput = (input: LearningResourceInput) => {
  if (!input.productId || input.productId.trim().length === 0) {
    throw new Error('productId is required');
  }
  if (!input.title || input.title.trim().length === 0) {
    throw new Error('title is required');
  }
  if (!input.url || input.url.trim().length === 0) {
    throw new Error('url is required');
  }

  try {
    // eslint-disable-next-line no-new
    new URL(input.url);
  } catch (error) {
    throw new Error('url must be a valid absolute URL');
  }

  if (input.estimatedMinutes !== undefined && input.estimatedMinutes < 0) {
    throw new Error('estimatedMinutes must be a positive number');
  }
};

export const getResourcesForProduct = async (productId: string): Promise<LearningResource[]> => {
  const resources = await readAllResources();
  return resources
    .filter((resource) => resource.productId === productId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const listAllResources = async (): Promise<LearningResource[]> => readAllResources();

export const addLearningResource = async (input: LearningResourceInput): Promise<LearningResource> => {
  validateResourceInput(input);
  const filePath = resolveResourcesPath();

  return withLock(filePath, async () => {
    const resources = await readAllResources();
    const resource: LearningResource = {
      id: globalThis.crypto?.randomUUID?.() ?? nodeRandomUUID(),
      productId: input.productId,
      title: input.title.trim(),
      type: input.type ?? 'Article',
      url: input.url.trim(),
      description: input.description?.trim() || undefined,
      estimatedMinutes: input.estimatedMinutes,
      createdAt: new Date().toISOString(),
    };

    resources.push(resource);
    await writeAllResources(resources);

    return resource;
  });
};
