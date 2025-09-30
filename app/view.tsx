'use client';

import React, { useState, useMemo } from 'react';
import { SearchIcon } from 'lucide-react';
import { ProductCard } from '@/src/components/products/ProductCard';
import { Product } from '@/src/type/products';

interface HomeViewProps {
  products: Product[];
}

export function HomeView({ products }: HomeViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [products, searchTerm]);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped = filteredProducts.reduce(
      (acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
      },
      {} as Record<string, Product[]>
    );

    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredProducts]);

  return (
    <div className='min-h-screen bg-bg-secondary'>
      {/* Header */}
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-light text-text-primary mb-4'>Products from A to Z</h1>
            <p className='text-lg text-text-secondary max-w-3xl mx-auto'>
              Our broad product portfolio includes many world-famous brands which have shaped the iconic Bayer brand.
              With our innovative products, we help to make life better.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
          <div className='relative max-w-lg mx-auto'>
            <SearchIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5' />
            <input
              type='text'
              placeholder='Search product...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
            />
          </div>
        </div>
      </div>

      {/* Product Categories */}
      <div className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        {productsByCategory.length > 0 ? (
          <div className='space-y-12'>
            {productsByCategory.map(([category, categoryProducts]) => (
              <section key={category} className='space-y-6'>
                {/* Category Header */}
                <div className='border-b border-gray-200 pb-4'>
                  <h2 className='text-2xl font-semibold text-text-primary'>{category}</h2>
                  <p className='text-text-secondary mt-1'>
                    {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Products Grid */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                  {categoryProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className='text-center py-12'>
            <div className='text-text-muted text-lg'>No products found matching your search.</div>
            <p className='text-text-secondary mt-2'>Try different search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
