import { PrismaClient, Prisma } from '@/src/generated/prisma';

import largeData from '@/src/mock/large/products.json';

const prisma = new PrismaClient();

const productsData: Prisma.ProductCreateInput[] = largeData.map(({ id, ...data }) => data);

export async function main() {
  for (const product of productsData) {
    await prisma.product.create({ data: product });
  }
}

main();
