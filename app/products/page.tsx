'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/src/context/CartContext';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import toast from 'react-hot-toast';

const PAGE_SIZE = 20;

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const data = [...largeData, ...smallData];
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const productData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / PAGE_SIZE);

  const { dispatch } = useCart();

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
    <main className='flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-8 lg:p-24'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
          {productData.map((product) => (
            <div
              key={product.id}
              className='group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden'
            >
              <Link href={`/products/${product.id}`} className='block p-4'>
                <h3 className='text-lg sm:text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2'>
                  {product.name}
                </h3>
                <div className='space-y-2'>
                  <p className='text-2xl font-bold text-gray-900'>${product.price}</p>
                  <p className='text-sm text-gray-600 line-clamp-2'>{product.description}</p>
                  <div className='flex justify-between items-center text-sm text-gray-500'>
                    <span>{product.category}</span>
                    <span>⭐ {product.rating}</span>
                  </div>
                  <div className='flex justify-between items-center text-sm text-gray-500'>
                    <span>{product.numReviews} reviews</span>
                    <span>{product.countInStock} in stock</span>
                  </div>
                </div>
              </Link>
              <button
                className='mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer'
                onClick={() => {
                  dispatch({
                    type: 'ADD_ITEM',
                    item: {
                      ...product,
                      price: parseFloat(product.price),
                      quantity: 1,
                    },
                  });
                  toast.success('Added to cart.');
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-8 border-t border-gray-200 pt-4 flex items-center justify-between px-4 sm:px-0'>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className='inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors'
        >
          Previous
        </button>
        <div className='hidden sm:flex justify-center flex-1'>
          <span className='text-sm text-gray-700'>
            Page <span className='font-medium'>{currentPage}</span> of <span className='font-medium'>{totalPages}</span>
          </span>
        </div>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className='inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors'
        >
          Next
        </button>
      </div>
    </main>
  );
}
