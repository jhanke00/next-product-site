'use client';
import ProductCard from '@/src/components/molecules/ProductCard';
import { Product, ProductsSearchProps } from '@/src/type/products';
import ProductSearchInput from '@/src/components/molecules/ProductSearchInput';
import { formatNumber } from '@/src/utils/common';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import NoProduct from '@/src/components/molecules/NoProducts';
import { getProducts, getRecommendedProducts } from '@/src/services/product';

export default function ProductsSearch({ initialQuery = '' }: ProductsSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'search', query],
    queryFn: () => (query === '' ? getRecommendedProducts() : getProducts(query)),
  });

  const handleSearchQuery = (newQuery: string) => {
    setQuery(newQuery);
    router.push(`?q=${newQuery.toString()}`);
  };

  const totalProducts = products?.length || 0;

  return (
    <main className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/** Product Search bar */}
        <div className='flex w-full p-4 text-gray-700 bg-white shadow-md rounded-xl mb-6'>
          <ProductSearchInput keyword={query} onSearch={handleSearchQuery} showClearButton />
        </div>

        {/** Breadcrumb - products count */}
        {!isLoading && totalProducts > 0 && (
          <div className='flex items-center justify-between mb-6'>
            <p className='text-gray-600 font-medium'>
              <span className='text-2xl font-bold text-gray-900'>
                {query === '' ? 'Recommended' : 'Searched'} Products{' '}
              </span>
            </p>
            <p className='text-gray-600 font-medium'>
              <span className='text-2xl font-bold text-gray-900'>{formatNumber(totalProducts)}</span> products
            </p>
          </div>
        )}

        {/** Loading icon */}
        {isLoading && (
          <div className='flex items-center w-full justify-center'>
            <Loader2 className='h-10 w-10 animate-spin' />
          </div>
        )}

        {/** No products container */}
        {!isLoading && totalProducts === 0 && <NoProduct />}

        {/** Products listing */}
        {!isLoading && totalProducts > 0 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {products.map((product: Product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
