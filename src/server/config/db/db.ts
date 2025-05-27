import { serverEnv } from '@/src/config/env';
import { productsTable } from '@/src/server/repositories/product/product.schema';

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { usersTable } from '@/src/server/repositories/user/user.schema';

const connectionString = `postgres://${serverEnv.POSTGRES_USER}:${serverEnv.POSTGRES_PASSWORD}@${serverEnv.POSTGRES_HOST}:${serverEnv.POSTGRES_PORT}/${serverEnv.POSTGRES_DB}`;

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(connectionString);

if (serverEnv.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = drizzle(conn, { schema: { productsTable, usersTable }, logger: serverEnv.NODE_ENV !== 'production' });
