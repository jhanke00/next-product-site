import type { Product } from '@type/products';
('use client');
import largeData from '@/src/mock/large/products.json';
import { useState } from 'react';
import Link from 'next/link';

const sku_per_page = 10;

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const data = [...largeData];
  const startPos = (currentPage - 1) * sku_per_page;
  const endPos = startPos + sku_per_page;
  const skuData = data.slice(startPos, endPos);
  const totalPages = Math.floor(data.length / sku_per_page);

  const nextPage = () => setCurrentPage(currentPage + 1);

  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
          {skuData.map((product) => (
            <div
              key={product.id}
              className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
            >
              <Link href={`/products/${product.id}`}>
                <h3 className={`mb-3 text-2xl font-semibold underline`}>{product.name}</h3>
              </Link>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Price: {product.price}</p>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Description: {product.description}</p>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Category: {product.category}</p>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Rating: {Math.round(product.rating)}</p>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Reviews: {product.numReviews}</p>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Stock: {product.countInStock}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='flex w-full border-t-2 pt-4' style={{ justifyContent: 'space-evenly' }}>
        {currentPage !== 1 && <button onClick={prevPage}> Previous </button>}
        <span>
          Page {currentPage} of {totalPages}
        </span>
        {currentPage !== totalPages && <button onClick={nextPage}> Next </button>}
      </div>
    </main>
  );
}
