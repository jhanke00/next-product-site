'use client';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

const PAGE_SIZE = 20;

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const data = [...largeData, ...smallData];

  // unique categories for datalist
  const categories = useMemo(() => {
    return Array.from(new Set(data.map((p) => p.category))).sort();
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredData = useMemo(() => {
    const sq = searchQuery.trim().toLowerCase(); // to ignore extra spaces and letter-case differences

    // If combined search provided, filter by name OR category
    if (sq) {
      return data.filter((p) => {
        const name = sq.length >= 5 ? (p.name || '').toLowerCase() : '';
        const category = (p.category || '').toLowerCase();
        return name?.includes(sq) || category.includes(sq);
      });
    }

    // No filters -> return all
    return data;
  }, [data, searchQuery]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const productData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page change
  }, [currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <div id='DikshaSearch' className='w-full max-w-5xl mb-6 grid gap-3'>
        <div>
          <label className='block mb-2 font-medium'>Search (name(min 5 chars) or category)</label>
          <div className='flex gap-2'>
            <input
              list='categories'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search products by name or category'
              className='w-full rounded border px-3 py-2'
            />
            <button onClick={() => setSearchQuery('')} className='px-3 py-2 border rounded'>
              Clear
            </button>
          </div>
          <datalist id='categories'>
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
          {productData.map((product) => (
            <div
              key={product.id}
              className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
            >
              <Link href={`/products/${product.id}`}>
                <h3 className={`mb-3 text-2xl font-semibold`}>{product.name}</h3>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Price: {product.price}</p>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Description: {product.description}</p>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Category: {product.category}</p>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Rating: {product.rating}</p>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Reviews: {product.numReviews}</p>
                <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>Stock: {product.countInStock}</p>
              </Link>
            </div>
          ))}
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
