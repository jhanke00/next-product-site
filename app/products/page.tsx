'use client';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/contexts/CartContext';
import { Product } from '@/src/type/products';

const PAGE_SIZE = 20;

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const { addToCart, updateQuantity, removeFromCart, getItemQuantity } = useCart();
  const router = useRouter();
  const data = [...largeData, ...smallData] as Product[];
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const productData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleIncrement = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentQty = getItemQuantity(product.id);
    if (currentQty < product.countInStock) {
      updateQuantity(product.id, currentQty + 1);
    }
  };

  const handleDecrement = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const currentQty = getItemQuantity(product.id);
    if (currentQty > 1) {
      updateQuantity(product.id, currentQty - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  const handleQuantityInput = (product: Product, value: number) => {
    if (value >= 1 && value <= product.countInStock) {
      updateQuantity(product.id, value);
    } else if (value < 1) {
      removeFromCart(product.id);
    }
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <div className='mb-6 flex justify-between items-center w-full max-w-5xl'>
        <h1 className='text-3xl font-bold'>Products</h1>
        <button
          onClick={() => router.push('/cart')}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          View Cart
        </button>
      </div>

      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left gap-4'>
          {productData.map((product) => {
            const inCart = getItemQuantity(product.id) > 0;
            const quantity = getItemQuantity(product.id);

            return (
              <div
                key={product.id}
                className='group rounded-lg border border-gray-300 dark:border-neutral-700 px-5 py-4 transition-colors hover:border-gray-400 hover:bg-gray-100 hover:dark:border-neutral-600 hover:dark:bg-neutral-800/30'
              >
                <Link href={`/products/${product.id}`}>
                  <h3 className={`mb-3 text-2xl font-semibold`}>{product.name}</h3>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Price: ${product.price}</p>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-50 line-clamp-2`}>
                    Description: {product.description}
                  </p>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Category: {product.category}</p>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Rating: {product.rating}</p>
                  <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Stock: {product.countInStock}</p>
                </Link>

                {product.countInStock === 0 ? (
                  <button
                    disabled
                    className='mt-4 w-full px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed'
                  >
                    Out of Stock
                  </button>
                ) : inCart ? (
                  <div className='mt-4 flex items-center justify-center gap-2' onClick={(e) => e.preventDefault()}>
                    <button
                      onClick={(e) => handleDecrement(product, e)}
                      className='w-10 h-10 flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-lg font-semibold'
                      aria-label='Decrease quantity'
                    >
                      -
                    </button>
                    <input
                      type='number'
                      min='1'
                      max={product.countInStock}
                      value={quantity}
                      onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const value = parseInt(e.target.value) || 0;
                        handleQuantityInput(product, value);
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      className='w-16 text-center px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-semibold'
                    />
                    <button
                      onClick={(e) => handleIncrement(product, e)}
                      disabled={quantity >= product.countInStock}
                      className='w-10 h-10 flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-semibold'
                      aria-label='Increase quantity'
                    >
                      +
                    </button>
                    <span className='text-xs text-gray-500 dark:text-gray-400 ml-1'>/ {product.countInStock}</span>
                  </div>
                ) : (
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className='mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className='flex justify-around w-full border-t-2 pt-4'>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </main>
  );
}
