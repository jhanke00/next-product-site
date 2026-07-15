'use client';

import Link from 'next/link';
import { useMemo, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { buildCategoryNavLinks } from '@/lib/categoryConfig';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';

export default function Homepage() {
  const cartContext = useContext(CartContext);
  const cart = cartContext?.cart || [];

  // Category images mapping
  const categoryImages: { [key: string]: string } = {
    electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    home: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop',
    jewelery: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
    Grocery: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
  };

  const allProducts = useMemo(() => [...largeData, ...smallData], []);

  const navLinks = useMemo(() => buildCategoryNavLinks(allProducts), [allProducts]);

  const categories = [
    { id: 'electronics', label: 'Electronics', path: 'electronics' },
    { id: 'home', label: 'Home', path: 'home' },
    { id: 'jewelery', label: 'Jewellery', path: 'jewelery' },
    { id: 'Grocery', label: 'Grocery', path: 'Grocery' },
  ];

  // Get featured products from each category
  const featuredProducts = useMemo(() => {
    return categories
      .map((category, index) => {
        const categoryProducts = allProducts.filter(
          (product) =>
            product.category.toLowerCase().includes(category.label.toLowerCase()) ||
            product.category.toLowerCase().includes(category.id.toLowerCase())
        );
        // Use a deterministic selection based on index instead of random
        const product = categoryProducts[index % categoryProducts.length];
        return product ? { ...product, categoryPath: category.path } : null;
      })
      .filter(Boolean);
  }, [allProducts]);

  return (
    <main className='min-h-screen'>
      <div className='space-y-20 px-4 sm:px-8 py-12'>
        {/* Hero Banner */}
        <section>
          <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-8 sm:p-12'>
            <div className='absolute inset-0 opacity-10'>
              <div className='absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_white_1px,_transparent_1px)] bg-[size:40px_40px]'></div>
            </div>

            <div className='relative z-10 max-w-2xl'>
              <h1 className='text-4xl sm:text-5xl font-bold text-white mb-4'>Discover Amazing Products</h1>
              <p className='text-indigo-100 text-lg mb-8'>
                Explore our curated collection of electronics, fashion, jewellery, and home decor.
              </p>
              <Link
                href='/products'
                className='inline-block px-8 py-3 bg-white text-indigo-600 font-semibold rounded-full hover:bg-indigo-50 transition'
              >
                Shop Now
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section>
          <div className='mb-8'>
            <h2 className='text-3xl font-bold text-slate-900 mb-2'>Featured Categories</h2>
            <p className='text-gray-600'>Browse our top product categories</p>
          </div>

          <div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-4'>
            {featuredProducts.map((product: any) => {
              const categoryImage = categoryImages[product.categoryPath] || categoryImages.electronics;

              return (
                <Link
                  key={product.id}
                  href={`/products/category/${product.categoryPath}`}
                  className='group overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1'
                >
                  {/* Image Section */}
                  <div
                    className={`relative h-48 overflow-hidden flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50`}
                  >
                    <img
                      src={product.image || categoryImage}
                      alt={product.name}
                      className='h-full w-full object-cover transition duration-300 group-hover:scale-105'
                      onError={(e: any) => {
                        e.currentTarget.src = categoryImage;
                      }}
                    />
                  </div>

                  {/* Content Section */}
                  <div className='p-5'>
                    <p className='text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2'>
                      {product.category}
                    </p>
                    <h3 className='text-base font-bold text-slate-900 line-clamp-2 mb-3'>{product.name}</h3>

                    <div className='flex items-end justify-between'>
                      <div>
                        <p className='text-2xl font-bold text-indigo-600'>${product.price}</p>
                        <div className='flex items-center gap-1 mt-1'>
                          <span className='text-xs font-semibold text-amber-600'>
                            {product.rating?.toFixed(1) || '4.5'}
                          </span>
                          <span className='text-xs text-amber-600'>★</span>
                        </div>
                      </div>
                      <div className='text-indigo-600 group-hover:translate-x-1 transition'>
                        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className='bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 sm:p-12 text-center'>
          <h2 className='text-3xl font-bold text-white mb-3'>Ready to explore?</h2>
          <p className='text-slate-300 mb-6 max-w-xl mx-auto'>
            Browse through thousands of products from our curated collection and find exactly what you need.
          </p>
          <Link
            href='/products'
            className='inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition'
          >
            View All Products
          </Link>
        </section>
      </div>
    </main>
  );
}
