import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

import { defineConfig } from 'drizzle-kit';
import { serverEnv } from '@/src/config/env';

const host = serverEnv.NODE_ENV === 'production' ? serverEnv.POSTGRES_HOST : 'localhost';

export default defineConfig({
  out: './migrations',
  schema: './src/server/repositories/**/*.schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host,
    user: serverEnv.POSTGRES_USER,
    password: serverEnv.POSTGRES_PASSWORD,
    database: serverEnv.POSTGRES_DB,
    port: serverEnv.POSTGRES_PORT,
    ssl: false,
  },
});
