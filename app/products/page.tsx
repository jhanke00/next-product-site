'use client';

import { useState, useEffect } from 'react';
import { getProducts } from '../api/products/service';
import { ProductCard } from '@/src/components/productCard/productCard';

const PAGE_SIZE = 20;

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [productData, setProductData] = useState<Awaited<ReturnType<typeof getProducts>>>({
    products: [],
    totalRecords: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 0,
  });

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      // using fetch in useEffect for simplicity, although in a real app you might want to use a more robust solution like SWR or React Query
      try {
        const response = await fetch(`api/products?page=${currentPage}&pageSize=${PAGE_SIZE}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <main className='flex min-h-screen flex-col items-center'>
      <a className='text-blue-500 hover:underline p-10' href=''>
        Go back to Home
      </a>
      <div className='z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
        <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
          {productData.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className='flex justify-around w-full border-t-2 pt-4'>
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {productData.totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === productData.totalPages}>
          Next
        </button>
      </div>
    </main>
  );
}
