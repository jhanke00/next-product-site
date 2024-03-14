'use client';

// Products List Page

import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import { ProductCard } from '@/src/components/ProductCard';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const PRODUCTS_PER_PAGE = 10;

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const data = [...largeData, ...smallData];
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const productData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / PRODUCTS_PER_PAGE);

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
      {/* Title Section */}
      <div className='... flex items-center justify-center'>
        <p className={`mb-3 text-2xl font-semibold`}>Products List</p>
      </div>

      {/* Products List Display Section */}
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
          {productData.map((product) => (
            <div
              key={product.id}
              className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
            >
              <Link href={`/products-list/${product.id}`}>
                <ProductCard product={product} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Section */}
      <div className='flex justify-around w-full border-t-2 pt-4'>
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          style={{
            marginRight: '5px',
            padding: '5px 10px',
            backgroundColor: currentPage === 1 ? 'black' : 'white',
            color: currentPage === 1 ? 'white' : 'black',
            border: '1px solid #ddd',
          }}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          style={{
            marginRight: '5px',
            padding: '5px 10px',
            backgroundColor: currentPage === totalPages ? 'darkblue' : 'white',
            color: currentPage === totalPages ? 'white' : 'black',
            border: '1px solid #ddd',
          }}
        >
          Next
        </button>
      </div>
    </main>
  );
}
