import { z } from 'zod';

import { createTRPCRouter } from '@/src/server/api/trpc';
import { reviewRepository } from '@/src/server/repositories/review/review.repository';
import { publicProcedure } from '@/src/server/procedures/public.procedure';
import { DEFAULT_REVIEWS_PAGINATION } from '@/src/server/constants/reviews';
import { protectedProcedure } from '@/src/server/procedures/protected.procedure';
import { sqsReviewsService } from '@/src/server/services/queue-reviews.service';

export const reviewRouter = createTRPCRouter({
  getReviews: publicProcedure
    .input(
      z.object({
        productId: z.string().uuid(),
        rating: z.number().optional(),
        limit: z.number().default(DEFAULT_REVIEWS_PAGINATION.limit),
        offset: z.number().default(DEFAULT_REVIEWS_PAGINATION.offset),
      })
    )
    .query(async ({ input }) => {
      const { productId, limit, offset, rating } = input;

      const { reviews, count } = await reviewRepository.findManyPaginated({ limit, offset, productId, rating });

      return { reviews, count };
    }),

  createReview: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().min(1).optional().nullable().default(null),
        review: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { productId, rating, review } = input;

      const id = crypto.randomUUID();

      await sqsReviewsService.sendMessage({ message: { rating, review, id, product: productId, user: ctx.user.id } });

      return { status: 'ok' };
    }),
});
