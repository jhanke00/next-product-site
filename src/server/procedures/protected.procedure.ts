import { trpcContext } from '@/src/server/api/trpc';
import { authenticationMiddleware } from '@/src/server/middlewares/authentication.middleware';

export const protectedProcedure = trpcContext.procedure.use(authenticationMiddleware);
