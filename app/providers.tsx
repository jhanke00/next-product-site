'use client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider, DehydratedState, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

interface ProvidersProps {
  children: ReactNode;
  dehydratedState?: DehydratedState;
}

export function Providers({ children, dehydratedState }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} position='bottom' />}
    </QueryClientProvider>
  );
}
