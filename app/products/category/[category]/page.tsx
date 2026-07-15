'use client';

import React, { useEffect, useState, useContext, useMemo } from 'react';
import { buildCategoryNavLinks, homepageCategories } from '@/lib/categoryConfig';
import { CartContext } from '@/context/CartContext';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';

type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image?: string;
  rating: number;
  numReviews: number;
  countInStock: number;
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const cartContext = useContext(CartContext) as {
    cart?: any[];
    addItem?: (item: any) => void;
    updateQuantity?: (id: string, quantity: number) => void;
    removeItem?: (id: string) => void;
  };
  const { category } = React.use(params);
  const cart = cartContext?.cart ?? [];
  const addItem = cartContext?.addItem;
  const updateQuantity = cartContext?.updateQuantity;
  const removeItem = cartContext?.removeItem;

  const allLocalProducts = [...largeData, ...smallData];
  const navLinks = buildCategoryNavLinks(allLocalProducts);

  const categoryConfig = homepageCategories.find((c) => c.id === category);
  const categoryLabel = categoryConfig?.label || category;

  // Map of product IDs to quantities in cart
  const quantityMap = useMemo(
    () => new Map<string, number>((cart || []).map((item: any) => [String(item.id), Number(item.quantity)])),
    [cart]
  );

  const handleQuantityChange = (product: Product, delta: number) => {
    const current = quantityMap.get(product.id) ?? 0;
    const next = current + delta;

    if (!addItem || !updateQuantity || !removeItem) {
      return;
    }

    if (next <= 0) {
      if (current > 0) {
        removeItem(product.id);
      }
      return;
    }

    if (current === 0) {
      addItem({ id: product.id, name: product.name, price: Number(product.price), quantity: 1 });
      return;
    }

    updateQuantity(product.id, next);
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        // Fetch from API or use local data
        let apiProducts: Product[] = [];
        apiProducts = allLocalProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase());
        setProducts(apiProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category, categoryConfig]);

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='space-y-10 px-8 py-10 lg:px-16'>
        <div>
          <p className='text-sm uppercase tracking-[0.3em] text-indigo-600'>Category</p>
          <h1 className='mt-3 text-4xl font-semibold text-slate-900'>{categoryLabel}</h1>
          <p className='mt-3 text-gray-600'>Browse our collection of {categoryLabel.toLowerCase()}</p>
        </div>

        {loading ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='h-80 rounded-[1.75rem] border border-gray-200 bg-slate-100 animate-pulse' />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {products.map((product) => {
              const quantity = quantityMap.get(product.id) ?? 0;
              const isOutOfStock = product.countInStock === 0;

              return (
                <div
                  key={product.id}
                  className='overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-sm transition hover:shadow-lg'
                >
                  <div className='relative h-56 overflow-hidden bg-slate-50 flex items-center justify-center'>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className='h-full w-full object-contain p-4 transition duration-300'
                      />
                    ) : (
                      <div className='w-full h-full bg-gradient-to-br from-slate-200 to-slate-300' />
                    )}
                  </div>

                  <div className='space-y-4 p-4'>
                    <h3 className='text-sm font-semibold text-slate-900 line-clamp-2'>{product.name}</h3>

                    <p className='text-xs text-gray-600 line-clamp-2'>{product.description}</p>

                    <div className='flex items-center justify-between pt-2'>
                      <span className='text-lg font-bold text-blue-600'>${product.price}</span>
                      <span className='text-xs font-semibold text-yellow-600'>{product.rating.toFixed(1)} ★</span>
                    </div>

                    <div className='space-y-3 pt-2 border-t border-gray-200'>
                      <div className='flex items-center justify-between gap-4'>
                        <button
                          className='group relative text-gray-700 hover:text-blue-600 transition'
                          title='Wishlist'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                            strokeWidth={2}
                            stroke='currentColor'
                            className='w-5 h-5'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
                            />
                          </svg>
                        </button>

                        <div className='flex items-center gap-2'>
                          {/* Minus button */}
                          <button
                            type='button'
                            disabled={isOutOfStock || quantity === 0}
                            onClick={() => handleQuantityChange(product, -1)}
                            className='h-8 w-8 rounded-md bg-gray-100 text-gray-700 
                 flex items-center justify-center font-bold text-lg
                 shadow-sm hover:bg-gray-200 active:scale-95 
                 transition disabled:opacity-50 disabled:cursor-not-allowed'
                            title='Remove from cart'
                          >
                            −
                          </button>

                          {/* Quantity display */}
                          <div className='min-w-[20px] rounded-md bg-gray-50 px-4 py-1 text-center shadow-sm'>
                            <span className='text-sm font-semibold text-gray-900'>{quantity}</span>
                          </div>

                          {/* Plus button */}
                          <button
                            type='button'
                            disabled={isOutOfStock || quantity >= product.countInStock}
                            onClick={() => handleQuantityChange(product, 1)}
                            className='h-8 w-8 rounded-md bg-blue-600 text-white 
               flex items-center justify-center font-bold text-lg
               shadow-sm hover:bg-blue-700 active:scale-95 
               transition disabled:opacity-50 disabled:cursor-not-allowed'
                            title='Add to cart'
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {quantity > 0 && (
                        <div className='rounded-lg bg-green-50 px-3 py-2 text-center'>
                          <p className='text-xs font-semibold text-green-700'>
                            ${(Number(product.price) * quantity).toFixed(2)} in cart
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className='rounded-[1.75rem] border border-gray-200 bg-white p-12 text-center'>
            <p className='text-gray-600'>No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
