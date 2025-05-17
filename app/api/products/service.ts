import { PrismaClient } from '@/generated/prisma';
const prisma = new PrismaClient();

export async function getProducts(page: number, pageSize = 10) {
  const skip = (page - 1) * pageSize;
  const products = await prisma.product.findMany({
    skip: skip,
    take: pageSize,
  });
  const totalRecords = await prisma.product.count();

  return {
    products,
    totalRecords,
    totalPages: Math.ceil(totalRecords / pageSize),
    currentPage: page,
    pageSize: pageSize,
  };
}
