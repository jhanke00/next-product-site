import { PrismaClient } from '../generated/prisma/index.js';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();
const largeData = JSON.parse(readFileSync('./src/mock/large/products.json', 'utf-8'));
const smallData = JSON.parse(readFileSync('./src/mock/small/products.json', 'utf-8'));
const products = [...largeData, ...smallData];

async function main() {
  console.log(`🌱 Start clearing existing data ...`);
  await prisma.product.deleteMany();

  console.log(`🌱 Start seeding ...`);

  const uniqueCategories = new Set();
  let seedCount = 0;

  for (const product of products) {
    uniqueCategories.add(product.category);

    await prisma.product.create({
      data: {
        ...product,
        category: product.category,
        price: parseFloat(product.price),
      },
    });
    seedCount++;
  }
  console.log(`🌱 Seeding finished. Total seeds added: ${seedCount}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
