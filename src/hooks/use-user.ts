import { apiClient } from '@/src/config/trpc/react';

export const useUser = () => {
  const { data, isLoading } = apiClient.user.self.useQuery();

  const isLoggedIn = data && !isLoading;

  return {
    user: data,
    isLoading,
    isLoggedIn,
  };
};
