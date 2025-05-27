import { trpcContext } from '@/src/server/api/trpc';
import { timingMiddleware } from '@/src/server/middlewares/timing.middleware';

export const publicProcedure = trpcContext.procedure.use(timingMiddleware);
