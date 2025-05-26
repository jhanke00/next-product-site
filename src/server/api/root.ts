import { createCallerFactory, createTRPCRouter } from '@/src/server/api/trpc';
import { productRouter } from '@/src/server/api/routers/product.route';
import { userRoute } from '@/src/server/api/routers/user.route';
import { reviewRouter } from '@/src/server/api/routers/review.route';
import { sqsReviewsService } from '@/src/server/services/queue-reviews.service';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productRouter,
  user: userRoute,
  review: reviewRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

process.on('SIGINT', () => {
  sqsReviewsService.unsubscribe();

  process.exit(0);
});

process.on('SIGTERM', () => {
  sqsReviewsService.unsubscribe();

  process.exit(0);
});

process.on('uncaughtException', () => {
  sqsReviewsService.unsubscribe();

  process.exit(1);
});

sqsReviewsService.subscribe();
