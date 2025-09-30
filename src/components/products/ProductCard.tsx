import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/src/components/ui';
import { Badge } from '@/src/components/ui';
import type { Product } from '@/src/type/products';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'>
      <div className='relative aspect-square bg-gray-50'>
        <Image src={product.imageUrl || '/media/bayer.png'} alt={product.name} fill className='object-contain p-4' />
        <div className='absolute top-2 left-2'>
          <Badge variant='info' size='sm'>
            {product.category}
          </Badge>
        </div>
      </div>

      <div className='p-4 space-y-3'>
        <div>
          <h3 className='font-semibold text-gray-900 text-lg'>{product.name}</h3>
          <p className='text-text-secondary text-sm mt-1 line-clamp-2'>{product.description}</p>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <div className='flex text-yellow-400'>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-gray-200'}`}
                  viewBox='0 0 24 24'
                >
                  <path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
                </svg>
              ))}
            </div>
            <span className='text-sm text-text-secondary'>
              {product.rating} ({product.numReviews})
            </span>
          </div>

          <div className='text-right'>
            <div className='text-lg font-bold text-primary'>${product.price.toFixed(2)}</div>
            {product.countInStock > 0 ? (
              <span className='text-xs text-success'>In Stock</span>
            ) : (
              <span className='text-xs text-error'>Out of Stock</span>
            )}
          </div>
        </div>

        <Link href={`/products/${product.id}`}>
          <Button variant='outline' size='sm' className='w-full' disabled={product.countInStock === 0}>
            View product information
          </Button>
        </Link>
      </div>
    </div>
  );
};
