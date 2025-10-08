import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { addLearningResource, getResourcesForProduct, listAllResources } from '@utils/learningResources/store';

const ORIGINAL_PATH = process.env.LEARNING_RESOURCES_PATH;

const createTempStore = async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'learning-resources-'));
  const filePath = path.join(dir, 'resources.json');
  await fs.writeFile(filePath, JSON.stringify([], null, 2));
  return { dir, filePath };
};

describe('learning resources store', () => {
  let tempDir: string;

  beforeEach(async () => {
    const { dir, filePath } = await createTempStore();
    tempDir = dir;
    process.env.LEARNING_RESOURCES_PATH = filePath;
  });

  afterEach(async () => {
    process.env.LEARNING_RESOURCES_PATH = ORIGINAL_PATH;
    if (tempDir) {
      await fs.rm(tempDir, { recursive: true, force: true });
    }
  });

  it('returns an empty list when no records exist', async () => {
    const resources = await getResourcesForProduct('test-product');
    expect(resources).toEqual([]);
  });

  it('creates and retrieves a new resource', async () => {
    const resource = await addLearningResource({
      productId: 'product-123',
      title: 'Setup Guide',
      url: 'https://example.com/setup',
      type: 'Guide',
      description: 'Step-by-step tutorial',
      estimatedMinutes: 12,
    });

    expect(resource.id).toBeDefined();
    expect(resource.productId).toBe('product-123');
    expect(resource.title).toBe('Setup Guide');

    const resources = await getResourcesForProduct('product-123');
    expect(resources).toHaveLength(1);
    expect(resources[0].url).toBe('https://example.com/setup');
  });

  it('throws on invalid URLs', async () => {
    await expect(
      addLearningResource({ productId: 'product-456', title: 'Broken Link', url: 'not-a-url' })
    ).rejects.toThrow('url must be a valid absolute URL');
  });

  it('sorts resources newest first', async () => {
    await addLearningResource({
      productId: 'sorted',
      title: 'First',
      url: 'https://example.com/first',
    });

    await addLearningResource({
      productId: 'sorted',
      title: 'Second',
      url: 'https://example.com/second',
    });

    const resources = await getResourcesForProduct('sorted');
    expect(resources[0].title).toBe('Second');
    expect(resources[1].title).toBe('First');

    const allResources = await listAllResources();
    expect(allResources).toHaveLength(2);
  });

  describe('edge cases', () => {
    it('creates nested store when LEARNING_RESOURCES_PATH points to non-existent path', async () => {
      const { dir } = await createTempStore();
      const nestedPath = path.join(dir, 'nested', 'deep', 'resources.json');
      process.env.LEARNING_RESOURCES_PATH = nestedPath;

      const resource = await addLearningResource({
        productId: 'nested-1',
        title: 'Nested Create',
        url: 'https://example.com/nested',
      });

      expect(resource).toBeDefined();

      const contents = await fs.readFile(nestedPath, 'utf-8');
      const parsed = JSON.parse(contents) as any[];
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBe(1);
      expect(parsed[0].title).toBe('Nested Create');
    });

    it('throws when the backing JSON file is malformed', async () => {
      const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'malformed-'));
      const filePath = path.join(tmp, 'resources.json');
      await fs.writeFile(filePath, 'this is not json');
      process.env.LEARNING_RESOURCES_PATH = filePath;

      await expect(getResourcesForProduct('any')).rejects.toThrow(/Unable to parse learning resources/);

      // cleanup
      await fs.rm(tmp, { recursive: true, force: true });
    });

    it('validates estimatedMinutes must be positive', async () => {
      await expect(
        addLearningResource({
          productId: 'p-1',
          title: 'Bad duration',
          url: 'https://example.com/bad',
          estimatedMinutes: -5,
        } as any)
      ).rejects.toThrow('estimatedMinutes must be a positive number');
    });

    it('validates title is required', async () => {
      await expect(
        addLearningResource({ productId: 'p-2', title: '', url: 'https://example.com/x' } as any)
      ).rejects.toThrow('title is required');
    });

    it('allows concurrent writes (two resources added in parallel)', async () => {
      const { dir, filePath } = await createTempStore();
      process.env.LEARNING_RESOURCES_PATH = filePath;

      const addA = addLearningResource({ productId: 'concurrent', title: 'A', url: 'https://example.com/a' });
      const addB = addLearningResource({ productId: 'concurrent', title: 'B', url: 'https://example.com/b' });

      const [a, b] = await Promise.all([addA, addB]);
      expect(a).toBeDefined();
      expect(b).toBeDefined();

      const resources = await getResourcesForProduct('concurrent');
      // both should be present
      expect(resources.map((r) => r.title).sort()).toEqual(['A', 'B'].sort());
    });
  });
});
