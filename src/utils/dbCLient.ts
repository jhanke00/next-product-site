import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function getDbCLient() {
  return prisma;
}
