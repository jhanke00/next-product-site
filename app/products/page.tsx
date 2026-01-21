'use client';
import Checkbox from '@/src/components/checkbox';
import StarRating from '@/src/components/star-rating';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 20;

export default function Component() {
  const [currentPage, setCurrentPage] = useState(1);
  const data = [...largeData, ...smallData];
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const productData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const [selectedRating, setSelectedRating] = useState<number[]>([]);
  const priceRange = useMemo(() => {
    const prices = productData.map((product) => parseFloat(product.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return [minPrice, maxPrice];
  }, [productData]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRange);

  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    productData.forEach((product) => {
      uniqueCategories.add(product.category);
    });
    return Array.from(uniqueCategories);
  }, [productData]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleRatingChange = (rating: number) => {
    setSelectedRating((prevRatings) => {
      if (prevRatings.includes(rating)) {
        return prevRatings.filter((r) => r !== rating);
      } else {
        return [...prevRatings, rating];
      }
    });
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setSelectedPriceRange(range);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prevCategories: string[]) => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter((c) => c !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  };

  const filteredProducts = useMemo(() => {
    return productData.filter((product) => {
      if (selectedRating.length > 0 && !selectedRating.includes(Math.floor(product.rating))) {
        return false;
      }
      if (parseFloat(product.price) < selectedPriceRange[0] || parseFloat(product.price) > selectedPriceRange[1]) {
        return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }
      return true;
    });
  }, [productData, selectedCategories, selectedPriceRange, selectedRating]);

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
    <div className='grid md:grid-cols-[300px_1fr] gap-8 p-4 md:p-8'>
      <div className='bg-background rounded-lg shadow-sm p-6'>
        <h2 className='text-lg font-semibold mb-4'>Filters</h2>
        <div className='grid gap-6'>
          <div>
            <h3 className='text-base font-medium mb-2'>Rating</h3>
            <div className='grid gap-2'>
              {[0, 1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className='flex items-center gap-2'>
                  <Checkbox
                    checked={selectedRating.includes(rating)}
                    onCheckedChange={() => handleRatingChange(rating)}
                  />
                  <div className='flex items-center'>
                    {[...Array(rating)].map((_, i) => (
                      <StarRating key={i} className='w-4 h-4 fill-yellow-500' />
                    ))}
                    {[...Array(5 - rating)].map((_, i) => (
                      <StarRating key={i} className='w-4 h-4 fill-gray-300' />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className='text-base font-medium mb-2'>Price</h3>
            <input
              type='range'
              min={priceRange[0]}
              max={priceRange[1]}
              step={10}
              value={selectedPriceRange[1]}
              onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value)])}
              className='w-full'
            />
            <div className='flex justify-between text-sm text-muted-foreground'>
              <span>${selectedPriceRange[0]}</span>
              <span>${selectedPriceRange[1]}</span>
            </div>
          </div>
          <div>
            <h3 className='text-base font-medium mb-2'>Category</h3>
            <div className='grid gap-2'>
              {categories.map((category) => (
                <div key={category} className='flex items-center gap-2'>
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <span>{category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {filteredProducts.map((product) => (
          <div key={product.id} className='bg-background rounded-lg shadow-sm overflow-hidden'>
            <Link
              href={product.countInStock === 0 ? '#' : `/products/${product.id}`}
              className='flex h-full'
              prefetch={false}
            >
              <div className='p-4 flex flex-col justify-between'>
                <div>
                  <h3 className='text-lg font-semibold'>{product.name}</h3>
                  <div className='text-sm text-muted-foreground mb-2'>{product.category}</div>
                  <p className='text-sm text-muted-foreground mb-2'>{product.description}</p>
                  {product.countInStock === 0 ? (
                    <span className='bg-red-500 flex justify-end pr-1 text-sm'>Out of stock</span>
                  ) : product.countInStock > 1 && product.countInStock < 10 ? (
                    <span className='bg-red-500 flex justify-end pr-1 text-sm'>
                      Only {product.countInStock} left in stock!
                    </span>
                  ) : null}
                  <div className='flex items-center mb-2'>
                    {[...Array(Math.floor(product.rating))].map((_, i) => (
                      <StarRating key={i} className='w-4 h-4 fill-yellow-500' />
                    ))}
                    {[...Array(5 - Math.floor(product.rating))].map((_, i) => (
                      <StarRating key={i} className='w-4 h-4 fill-gray-300' />
                    ))}
                    <span className='text-sm text-muted-foreground'>({product.rating.toFixed(2)})</span>
                  </div>
                </div>
                <div className='flex justify-between items-end mt-4'>
                  <div className='font-semibold'>${product.price}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
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
  );
}
