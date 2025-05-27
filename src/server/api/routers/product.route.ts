import { z } from 'zod';

import { createTRPCRouter } from '@/src/server/api/trpc';
import { productRepository } from '@/src/server/repositories/product/product.repository';
import { cacheKeys } from '@/src/server/utils/cache-keys.util';
import { publicProcedure } from '@/src/server/procedures/public.procedure';

export const productRouter = createTRPCRouter({
  getProductById: publicProcedure.input(z.object({ productId: z.string() })).query(async ({ input, ctx }) => {
    const cacheKey = cacheKeys.generateProductKey(input.productId);

    const product = await ctx.cache.cacheAside({
      key: cacheKey,
      onCacheMiss: async () => {
        const value = await productRepository.findById({ id: input.productId });

        return {
          value,
          expire: ctx.cache.EXPIRE_TIME.hours_12,
        };
      },
    });

    return { product };
  }),
});
