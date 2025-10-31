'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '../../../type/products/types';
import StarRating from '@/src/components/StarRating';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className='border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow'>
      {product.image && (
        <div className='h-48 bg-gray-200 overflow-hidden'>
          <img src={product.image} alt={product.name} className='w-full h-full object-cover' />
        </div>
      )}
      <div className='p-4'>
        <h3 className='text-lg font-semibold mb-2'>{product.name}</h3>
        {typeof product.rating !== 'undefined' && (
          <div className='mb-2'>
            <StarRating rating={Number(product.rating) || 0} size='sm' />
          </div>
        )}
        <p className='text-gray-600 mb-2 line-clamp-2'>{product.description}</p>
        <div className='flex justify-between items-center'>
          <span className='text-blue-600 font-bold'>${product.price.toFixed(2)}</span>
          <Link href={`/products/${product.id}`}>
            <span className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 inline-block'>
              View Details
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
