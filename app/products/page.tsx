'use client';
import { FilterProvider } from '@context/products';
import FilterBar from './filter.bar';
import ProductList from '@/app/products/list';
import { Suspense } from 'react';

export default function Products() {
  return (
    <Suspense>
      <FilterProvider>
        <main className='flex min-h-screen flex-col items-center p-24'>
          <div className='flex w-full'>
            <aside className='w-1/4 px-4'>
              <FilterBar />
            </aside>
            <ProductList />
          </div>
        </main>
      </FilterProvider>
    </Suspense>
  );
}
