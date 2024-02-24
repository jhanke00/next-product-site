'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import StartRating from '@/src/components/starRating';
import PriceTag from '@/src/components/priceTag';
import { Product } from '@/src/type/products';
import { notFound } from 'next/navigation';
import { Price } from '@/src/type/price';
import { Rating } from '@/src/type/starRating';
import ProductData from '../../src/mock/small/products-new.json';
import Image from 'next/image';
export default function ProductDetails() {
  const searchParams = useSearchParams();
  const search = searchParams && searchParams.get('product-id');
  const initailVal: Product = {
    id: 0,
    name: '',
    price: 0,
    description: '',
    category: '',
    rating: 0,
    numReviews: 0,
    countInStock: 1,
    image: '',
    originalPrice: 0,
  };
  const [selectedProduct, setSelectedProduct] = useState(initailVal);
  const getProductData = () => {
    const product = ProductData.find((i) => {
      return i.id === Number(search);
    });
    if (!product) {
      return notFound();
    } else {
      product && setSelectedProduct(product);
    }
  };
  useEffect(() => {
    getProductData();
  }, []);

  const { name, image, originalPrice, price, rating, numReviews, description, category, countInStock }: Product =
    selectedProduct;
  const productPrice: Price = {
    price: price,
    originalPrice: originalPrice,
    priceStyle: 'text-2xl font-bold text-gray-800 dark:text-white mb-2',
    originalPriceStyle: 'text-xs text-slate-900 line-through ml-1.5',
  };
  const starRating: Rating = {
    count: Math.round(rating),
    width: 22,
    height: 22,
  };
  return (
    <main className='flex min-h-screen flex-col items-center p-24'>
      {image && (
        <>
          <div className='bg-gray-100 dark:bg-gray-800 py-8 min-w-full'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='flex flex-col md:flex-row -mx-4'>
                <div className='md:flex-1 px-4'>
                  <div className='h-[460px] rounded-lg bg-gray-300 dark:bg-gray-700 mb-4'>
                    <div className='w-full h-full relative'>
                      <Image
                        className='hover:scale-125 ease-in duration-300'
                        fill
                        src={image}
                        priority={true}
                        sizes={'100%'}
                        alt='product image'
                      />
                    </div>
                  </div>
                </div>
                <div className='md:flex-1 px-4'>
                  <div className='my-2'>
                    <span className='text-red-500 dark:text-red-200 text-sm'>{category}</span>
                  </div>

                  <h2 className='text-2xl font-bold text-gray-800 dark:text-white mb-2'>{name}</h2>
                  <div className='flex items-center my-7'>
                    <StartRating {...starRating} />
                    <p className='text-xs dark:text-gray-400  mx-4'>{`(${numReviews} customer reviews)`}</p>
                  </div>
                  <p className='text-gray-600 dark:text-gray-300 text-sm mb-7'>{description}</p>
                  <div className='flex mb-4'>
                    <div className='mr-4'>
                      <PriceTag {...productPrice} />
                    </div>
                  </div>
                  <div className='flex mb-4'>
                    <div className='mr-4'>
                      <span className='text-green-600 dark:text-green-300 '>{countInStock} in Stock</span>
                    </div>
                  </div>
                  <div className='flex mx-2 mb-4 mt-9'>
                    <div className='w-1/2 px-2'>
                      <button className='w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700'>
                        Add to Cart
                      </button>
                    </div>
                    <div className='w-1/2 px-2'>
                      <button className='w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600'>
                        Add to Wishlist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
