'use client';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import { useState, useEffect, useMemo } from 'react';
import { useSearch } from '@/src/providers/SearchProvider';
import { Product } from '@/src/type/products';
import ProductItem from '@/src/components/Product/Product';
import ProductFilter from '@/src/components/ProductFilter/ProductFilter';
import { useSearchParams } from 'next/navigation';
import { removeDuplicates } from '@/src/utils/removeDuplicates';

const PAGE_SIZE = 20;

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const { value } = useSearch();
  const searchParams = useSearchParams();

  const data: Product[] = useMemo(() => [...largeData, ...smallData], []);

  const maxPrice = useMemo(() => Math.max(...data.map((product) => +product.price)), [data]);
  const minPrice = useMemo(() => Math.min(...data.map((product) => +product.price)), [data]);

  const searchedData = useMemo(() => {
    return value
      ? data.filter((product) => {
          return Object.keys(product).some((key) =>
            product[key as keyof Product].toString().toLowerCase().includes(value.toLowerCase())
          );
        })
      : data;
  }, [data, value]);

  const categories = useMemo(() => removeDuplicates(searchedData.map((product) => product.category)), [searchedData]);
  const categoryFilter = searchParams ? new URLSearchParams(searchParams).get('category') : null;
  const min = searchParams ? new URLSearchParams(searchParams).get('min') || minPrice : minPrice;
  const max = searchParams ? new URLSearchParams(searchParams).get('max') || maxPrice : maxPrice;
  const stock = searchParams ? new URLSearchParams(searchParams).get('stock') || 0 : 0;
  const rating = searchParams ? new URLSearchParams(searchParams).get('rating') || '' : '';

  const filteredData = useMemo(() => {
    return categoryFilter
      ? searchedData.filter((product) => {
          return (
            product.category === categoryFilter &&
            +product.price >= +min &&
            +product.price <= +max &&
            +product.countInStock >= +stock &&
            product.rating >= +rating
          );
        })
      : searchedData;
  }, [categoryFilter, searchedData, min, max, stock, rating]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const productData = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  if (searchedData.length === 0) {
    return (
      <div className='min-h-screen text-center pt-24'>
        <p>There is no searched data with &quot;{value}&quot;.</p>
      </div>
    );
  }

  return (
    <main className='min-h-screen px-24 py-12 flex grid grid-cols-4 gap-12 container mx-auto'>
      <div className='col-span-1'>
        <ProductFilter categories={categories} minPrice={minPrice} maxPrice={maxPrice} />
      </div>
      <div className='flex flex-col items-center col-span-3'>
        <div className='max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex'>
          <div className='grid lg:max-w-5xl lg:w-full lg:grid-cols-2 lg:text-left'>
            {productData.map((product) => (
              <ProductItem key={product.id} product={product} />
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
      </div>
    </main>
  );
}
