'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Slider } from '@/src/components/Slider';
import { Checkbox } from '@/src/components/Checkbox';
import { Star } from 'lucide-react';

import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';

const PAGE_SIZE = 20;
const STARTS = [1, 2, 3, 4, 5];

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [priceFilter, setPriceFilter] = useState([0, 10000]); // Assuming max price is 10000
  const [categoryFilters, setCategoryFilters] = useState<{
    [key: string]: boolean;
  }>({});

  const data = useMemo(() => [...largeData, ...smallData], []);

  const categories = useMemo(() => [...new Set(data.map((product) => product.category))].sort(), [data]);

  const priceRange = useMemo(() => {
    const prices = data.map((product) => Number(product.price));
    return [Math.min(...prices), Math.max(...prices)];
  }, [data]);

  const filteredData = useMemo(
    () =>
      data.filter(
        (product) =>
          product.rating >= ratingFilter &&
          Number(product.price) >= priceFilter[0] &&
          Number(product.price) <= priceFilter[1] &&
          (Object.keys(categoryFilters).length === 0 || categoryFilters[product.category])
      ),
    [data, ratingFilter, priceFilter, categoryFilters]
  );

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const productData = filteredData.slice(startIndex, endIndex);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleCheck = (checked: boolean, category: string) => {
    if (!checked) {
      delete categoryFilters[category];
      setCategoryFilters(() => ({ ...categoryFilters }));
      return;
    }

    setCategoryFilters((prev) => ({ ...prev, [category]: checked }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [ratingFilter, priceFilter, categoryFilters]);

  return (
    <div className='flex min-h-screen'>
      {/* Sidebar with filters */}
      <aside className='w-64 p-6 bg-gray-100'>
        <h2 className='text-xl font-semibold mb-4'>Filters</h2>

        {/* Rating filter */}
        <div className='mb-6'>
          <h3 className='font-medium mb-2'>Rating</h3>
          <div className='flex items-center'>
            {STARTS.map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer ${star <= ratingFilter ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                onClick={() => setRatingFilter(star)}
              />
            ))}
          </div>
        </div>

        {/* Price filter */}
        <div className='mb-6'>
          <Slider minPrice={priceRange[0]} maxPrice={priceRange[1]} onPriceChange={setPriceFilter} />
        </div>

        {/* Category filter */}
        <div>
          <h3 className='font-medium mb-2'>Category</h3>
          {categories.map((category) => (
            <div key={category} className='flex items-center mb-2'>
              <Checkbox
                label={category}
                isChecked={categoryFilters[category] || false}
                onChange={(checked) => handleCheck(checked as boolean, category)}
              />
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className='flex-1 p-6'>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {productData.map((product) => (
            <div
              key={product.id}
              className='group rounded-lg border p-4 transition-colors hover:border-gray-300 hover:bg-gray-100'
            >
              <Link href={`/products/${product.id}`}>
                <h3 className='text-lg font-semibold mb-2'>{product.name}</h3>
                <p className='text-sm text-gray-600'>Price: ${product.price}</p>
                <p className='text-sm text-gray-600'>Category: {product.category}</p>
                <div className='flex items-center mt-2'>
                  {STARTS.map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${star <= product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className='ml-2 text-sm text-gray-600'>({product.numReviews} reviews)</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className='flex justify-between items-center mt-8 border-t pt-4'>
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className='px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300'
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className='px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300'
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
