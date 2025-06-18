'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProductsResponse } from '@type/products';

const PAGE_SIZE = 20;

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [state, setState] = useState<{
    loading: boolean;
    error: boolean;
    data?: ProductsResponse;
  }>({ loading: true, error: false });

  const totalPages = state.data ? Math.ceil(state.data.total / PAGE_SIZE) : 0;
  const offset = (currentPage - 1) * PAGE_SIZE;

  const nextPage = () => setCurrentPage((p) => p + 1);
  const prevPage = () => setCurrentPage((p) => p - 1);

  useEffect(() => {
    const fetchProducts = async () => {
      setState({ loading: true, error: false });

      try {
        const res = await fetch(`/api/products?offset=${offset}&limit=${PAGE_SIZE}`);
        if (!res.ok) throw new Error('Failed to fetch');

        const json = await res.json();
        setState({ loading: false, error: false, data: json });
      } catch (error) {
        setState({ loading: false, error: true });
      }
    };

    fetchProducts();
  }, [offset]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        {state.loading && <p className='px-5 py-1'>Loading...</p>}
        {!state.loading && state.error && <p className='px-5 py-1'>Could not get products</p>}
        {!state.loading && !state.error && state.data && (
          <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
            {state.data.products.map((product) => (
              <div
                key={product.id}
                className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
              >
                <Link href={`/products/${product.id}`}>
                  <h3 className='mb-3 text-2xl font-semibold'>{product.name}</h3>
                  <p className='m-0 max-w-[30ch] text-sm opacity-50'>Price: {product.price}</p>
                  <p className='m-0 max-w-[30ch] text-sm opacity-50'>Description: {product.description}</p>
                  <p className='m-0 max-w-[30ch] text-sm opacity-50'>Category: {product.category}</p>
                  <p className='m-0 max-w-[30ch] text-sm opacity-50'>Rating: {product.rating}</p>
                  <p className='m-0 max-w-[30ch] text-sm opacity-50'>Reviews: {product.numReviews}</p>
                  <p className='m-0 max-w-[30ch] text-sm opacity-50'>Stock: {product.countInStock}</p>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {!state.loading && !state.error && state.data && (
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
      )}
    </main>
  );
}
