import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';

import * as route from '../app/api/products/[productId]/resources/route';

const ORIGINAL_PATH = process.env.LEARNING_RESOURCES_PATH;

const createTempStore = async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'api-learning-'));
  const filePath = path.join(dir, 'resources.json');
  await fs.writeFile(filePath, JSON.stringify([], null, 2));
  return { dir, filePath };
};

describe('API: /api/products/:productId/resources', () => {
  let tmpDir: string | undefined;

  beforeEach(async () => {
    const tmp = await createTempStore();
    tmpDir = tmp.dir;
    process.env.LEARNING_RESOURCES_PATH = tmp.filePath;
  });

  afterEach(async () => {
    process.env.LEARNING_RESOURCES_PATH = ORIGINAL_PATH;
    if (tmpDir) {
      await fs.rm(tmpDir, { recursive: true, force: true });
    }
  });

  it('GET returns empty resources list when none exist', async () => {
    const req = new Request('http://localhost/api/products/abc/resources');
    const res = await route.GET(req as any, { params: Promise.resolve({ productId: 'abc' }) } as any);
    expect(res).toBeDefined();
    const body = await res.json();
    expect(body).toHaveProperty('resources');
    expect(Array.isArray(body.resources)).toBe(true);
    expect(body.resources).toHaveLength(0);
  });

  it('POST creates a resource and GET returns it', async () => {
    const payload = { title: 'API Guide', url: 'https://example.com/api-guide' };
    const postReq = new Request('http://localhost/api/products/p1/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const postRes = await route.POST(postReq as any, { params: Promise.resolve({ productId: 'p1' }) } as any);
    expect(postRes).toBeDefined();
    expect(postRes.status).toBe(201);
    const postBody = await postRes.json();
    expect(postBody).toHaveProperty('resource');
    expect(postBody.resource.title).toBe('API Guide');

    const getReq = new Request('http://localhost/api/products/p1/resources');
    const getRes = await route.GET(getReq as any, { params: Promise.resolve({ productId: 'p1' }) } as any);
    const getBody = await getRes.json();
    expect(getBody.resources).toHaveLength(1);
    expect(getBody.resources[0].title).toBe('API Guide');
  });

  it('POST with invalid payload returns 400', async () => {
    const badPayload = { title: 'Broken', url: 'not-a-url' };
    const postReq = new Request('http://localhost/api/products/p2/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(badPayload),
    });

    const postRes = await route.POST(postReq as any, { params: Promise.resolve({ productId: 'p2' }) } as any);
    expect(postRes.status).toBe(400);
    const body = await postRes.json();
    expect(body).toHaveProperty('error');
  });
});
