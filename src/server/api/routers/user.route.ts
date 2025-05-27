import { createTRPCRouter } from '@/src/server/api/trpc';
import { protectedProcedure } from '@/src/server/procedures/protected.procedure';

export const userRoute = createTRPCRouter({
  self: protectedProcedure.query(async ({ ctx }) => {
    return {
      user: ctx.user,
    };
  }),
});
