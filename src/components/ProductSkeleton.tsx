import React from 'react';
import { productTableHeaders } from '@utils/productUtils';
const ProductSkeleton = () => {
  return (
    <div className='flex flex-col space-y-4'>
      <div className='overflow-x-auto'>
        <div className='bg-gray-800 text-white py-5 px-4 grid grid-cols-5 border-b border-gray-300'>
          {productTableHeaders.map((header, index) => (
            <div key={index} className='bg-gray-500 rounded-md animate-pulse pl-3 py-1 font-semibold'>
              {header.display}
            </div>
          ))}
        </div>
        <div className='bg-white divide-y divide-gray-200'>
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className='grid grid-cols-5 gap-4 p-4'>
              {productTableHeaders.map((header, headerIndex) => (
                <div key={headerIndex} className='h-6 bg-gray-300 py-4 px-4 rounded-md animate-pulse'></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='w-48 h-10 bg-gray-300 rounded'></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
