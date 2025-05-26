import { TRPCError } from '@trpc/server';
import { trpcContext } from '@/src/server/api/trpc';
import { userRepository } from '@/src/server/repositories/user/user.repository';

export const authenticationMiddleware = trpcContext.middleware(async ({ next, path }) => {
  const isLoggedIn = true;

  if (!isLoggedIn) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const userFromToken = {
    id: 'fd7398ab-7968-4a1c-adfb-142d30b6a936',
  };

  const user = await userRepository.findById({ id: userFromToken.id });

  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      user,
    },
  });
});
