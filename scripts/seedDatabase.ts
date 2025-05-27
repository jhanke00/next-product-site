import usersData from '@/src/mock/small/users.json';
import productsData from '@/src/mock/small/products.json';
import { productsTable } from '@/src/server/repositories/product/product.schema';
import { usersTable } from '@/src/server/repositories/user/user.schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '@/src/config/env';
import postgres from 'postgres';

async function main() {
  const connectionString = `postgres://${env.POSTGRES_USER}:${env.POSTGRES_PASSWORD}@localhost:${env.POSTGRES_PORT}/${env.POSTGRES_DB}`;

  const connection = postgres(connectionString);

  const db = drizzle(connection, {
    logger: env.NODE_ENV !== 'production',
  });

  try {
    console.log('Start clearing database tables:');

    await db.delete(usersTable);
    await db.delete(productsTable);

    console.log('Finish clearing database tables:');
  } catch (error) {
    console.error(error);
  }

  try {
    console.log('Start seeding database:');

    const normalizedUsers = usersData.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
    }));

    await db.insert(usersTable).values(normalizedUsers);

    const normalizedProducts = productsData.map((product) => ({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      description: product.description,
      category: product.category,
      rating: product.rating,
      numReviews: product.numReviews,
      countInStock: product.countInStock,
    }));

    await db.insert(productsTable).values(normalizedProducts);

    console.log('Finish seeding database:');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await db.$client.end();

    process.exit(0);
  }
}

main();
