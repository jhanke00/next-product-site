import { PrismaClient } from '@/generated/prisma';
import { readFileSync } from 'fs';
import { getProducts } from './service';

const prisma = new PrismaClient();

async function cleanup() {
  await prisma.product.deleteMany();
}

async function genMockProduct() {
  const largeData = JSON.parse(readFileSync('./src/mock/large/products.json', 'utf-8'));
  const smallData = JSON.parse(readFileSync('./src/mock/small/products.json', 'utf-8'));
  const products = [...largeData, ...smallData];

  for (const product of products.slice(0, 15)) {
    await prisma.product.create({
      data: {
        ...product,
        category: product.category,
      },
    });
  }
}

describe('products service', () => {
  beforeEach(async () => {
    await genMockProduct();
  });

  afterEach(async () => {
    await cleanup();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should get episode transctipt shorten', async () => {
    const dbProducts1 = await getProducts(1, 10);
    expect(dbProducts1.products.length).toBe(10);
    expect(dbProducts1.totalRecords).toBe(15);
    expect(dbProducts1.totalPages).toBe(2);
    expect(dbProducts1.currentPage).toBe(1);
    expect(dbProducts1.pageSize).toBe(10);

    const dbProducts2 = await getProducts(2, 10);
    expect(dbProducts2.products.length).toBe(5);
    expect(dbProducts2.totalRecords).toBe(15);
    expect(dbProducts2.totalPages).toBe(2);
    expect(dbProducts2.currentPage).toBe(2);
    expect(dbProducts2.pageSize).toBe(10);
  });
});
