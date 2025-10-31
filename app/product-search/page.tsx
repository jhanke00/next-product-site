import { Metadata } from 'next';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Providers } from '../providers';
import ProductsSearch from '@/src/components/organisms/ProductSearch';
import { getProducts, getRecommendedProducts } from '@/src/services/product';
import { Product } from '@/src/type/products';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}): Promise<Metadata> {
  const queryParams = await searchParams;
  const query = Array.isArray(queryParams.q) ? queryParams.q[0] : queryParams.q || '';
  const title = query ? `Search results for "${query}"` : 'Recommended Products';

  return {
    title,
    description: `Browse products ${query ? `matching "${query}"` : ''}`,
    openGraph: {
      title,
      description: `Browse products ${query ? `matching "${query}"` : ''}`,
    },
  };
}

export default async function ProductsSearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const queryParams = await searchParams;
  const query = Array.isArray(queryParams.q) ? queryParams.q[0] : queryParams.q || '';

  const serverQueryClient = new QueryClient();

  await serverQueryClient.prefetchQuery<Product[], Error>({
    queryKey: ['products', 'search', query],
    queryFn: () => (query === '' ? getRecommendedProducts() : getProducts(query)),
    staleTime: 60 * 1000,
  });

  const dehydratedState = dehydrate(serverQueryClient);

  return (
    <Providers dehydratedState={dehydratedState}>
      <ProductsSearch initialQuery={query} />
    </Providers>
  );
}
