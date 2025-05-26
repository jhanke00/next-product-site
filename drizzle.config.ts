import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

import { defineConfig } from 'drizzle-kit';
import { env } from '@/src/config/env';

const host = env.NODE_ENV === 'production' ? env.POSTGRES_HOST : 'localhost';

export default defineConfig({
  out: './migrations',
  schema: './src/server/repositories/**/*.schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
    port: env.POSTGRES_PORT,
    ssl: false,
  },
});
