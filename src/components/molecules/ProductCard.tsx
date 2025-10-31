import { JSX, memo } from 'react';
import { Product } from '../../type/products';
import { formatPrice } from '../../utils/common';
import { Badge } from '@/src/components/atoms';
import Link from 'next/link';

const ProductCard = memo(
  ({ name, price, description, category, rating, countInStock, numReviews, id }: Product): JSX.Element => {
    const totalStars = 5;
    const filledStars = Math.round(rating);

    const renderStars: JSX.Element = (
      <div className='flex' aria-label={`Rating: ${rating * 5} out of 5 stars`}>
        {[...Array(totalStars)].map((_, index) => (
          <svg
            key={index}
            role='img'
            className={`w-4 h-4 ms-1 ${index < filledStars ? 'text-yellow-300' : 'text-gray-300'}`}
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='currentColor'
            viewBox='0 0 22 20'
          >
            <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
          </svg>
        ))}
      </div>
    );

    const isProductInStock = countInStock > 0;
    return (
      <div className='relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl'>
        <div className='p-6'>
          <div className='flex items-start justify-between mb-1'>
            <div className='flex justify-between items-start mb-2'>
              <div>
                <Link
                  href={`/products/${id}`}
                  className='block hover:text-blue-800 font-sans text-base antialiased font-bold leading-relaxed text-blue-gray-900 mb-1'
                >
                  {name}
                </Link>
                <Badge variant={'outline'}>{category}</Badge>
              </div>
            </div>
          </div>
          <div className='flex items-center mb-2'>
            {renderStars}
            <span className='w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400'></span>
            {numReviews > 0 && (
              <span className='text-sm font-medium text-gray-900 underline hover:no-underline dark:text-white'>
                {numReviews} {numReviews > 0 ? 'reviews' : 'review'}
              </span>
            )}
          </div>
          <p className='line-clamp-2 font-sans text-sm antialiased font-normal leading-normal text-gray-700 opacity-75'>
            {description?.slice(0, 500)}
          </p>
        </div>
        <div className='p-6 pt-0 flex justify-between items-center'>
          <p className='flex gap-2 font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-900'>
            <span className='font-bold'>{formatPrice(Number(price))}</span>
            <span className={isProductInStock ? 'text-green-600' : 'text-red-600'}>
              {isProductInStock ? `In stock` : 'Out of stock'}
            </span>
          </p>
          <button className='border text-sm px-4 py-2 rounded-sm' type='button'>
            {isProductInStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    );
  }
);

ProductCard.displayName = 'ProductCard';

export default ProductCard;
