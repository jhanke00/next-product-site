import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

    REDIS_PASSWORD: z.string().min(1),
    REDIS_USER: z.string().min(1),
    REDIS_USER_PASSWORD: z.string().min(1),
    REDIS_HOST: z.string().min(1).default('localhost'),
    REDIS_PORT: z.coerce.number().default(6379),

    LOCALSTACK_HOST_PORT: z.coerce.number().default(6379),

    AWS_DEFAULT_REGION: z.string().default('us-east-1'),
    AWS_SQS_REVIEWS_QUEUE_URL: z.string(),
    AWS_ACCESS_KEY_ID: z.string().default('test'),
    AWS_SECRET_ACCESS_KEY: z.string().default('test'),
    AWS_SQS_REVIEWS_MAX_NUMBER_OF_MESSAGES: z.coerce.number().default(3),
    AWS_SQS_REVIEWS_WAIT_TIME_SECONDS: z.coerce.number().default(20),
    AWS_SQS_REVIEWS_VISIBILITY_TIMEOUT: z.coerce.number().default(180),

    POSTGRES_USER: z.string().min(1),
    POSTGRES_HOST: z.string().min(1).default('localhost'),
    POSTGRES_PASSWORD: z.string().min(1),
    POSTGRES_DB: z.string().min(1),
    POSTGRES_PORT: z.coerce.number().default(5432),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DB: process.env.POSTGRES_DB,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_HOST: process.env.POSTGRES_HOST,

    LOCALSTACK_HOST_PORT: process.env.LOCALSTACK_HOST_PORT,

    AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION,
    AWS_SQS_REVIEWS_QUEUE_URL: process.env.AWS_SQS_REVIEWS_QUEUE_URL,
    AWS_SQS_REVIEWS_MAX_NUMBER_OF_MESSAGES: process.env.AWS_SQS_REVIEWS_MAX_NUMBER_OF_MESSAGES,
    AWS_SQS_REVIEWS_WAIT_TIME_SECONDS: process.env.AWS_SQS_REVIEWS_WAIT_TIME_SECONDS,
    AWS_SQS_REVIEWS_VISIBILITY_TIMEOUT: process.env.AWS_SQS_REVIEWS_VISIBILITY_TIMEOUT,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_USER: process.env.REDIS_USER,
    REDIS_USER_PASSWORD: process.env.REDIS_USER_PASSWORD,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,

    // Client variables
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
