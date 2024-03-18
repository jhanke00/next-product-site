import React from 'react';
import '@app/globals.css';

const ProductCardSkeleton = () => {
  return (
    <>
      <div className='cardTitle animate-pulse h-12 mb-4 p-5'></div>
      <div className='cardBody bg-white'>
        <div className='cardContent'>
          <div className='cardContentText animate-pulse h-6 mb-4'></div>
        </div>
        <div className='cardInfo p-3'>
          <div className='infoLabel bg-gray-300 animate-pulse h-4 w-24 mb-2'></div>
          <div className='infoValue bg-gray-300 animate-pulse h-4 w-16'></div>
        </div>
        <div className='cardInfoNeutral p-3'>
          <div className='infoLabel bg-gray-300 animate-pulse h-4 w-24 mb-2'></div>
          <div className='infoValue bg-gray-300 animate-pulse h-4 w-16'></div>
        </div>
        <div className='cardInfo p-3'>
          <div className='infoLabel bg-gray-300 animate-pulse h-4 w-24 mb-2'></div>
          <div className='infoValue bg-gray-300 animate-pulse h-4 w-16'></div>
        </div>
        <div className='cardInfoNeutral p-3'>
          <div className='infoLabel bg-gray-300 animate-pulse h-4 w-24 mb-2'></div>
          <div className='infoValue bg-gray-300 animate-pulse h-4 w-16'></div>
        </div>
        <div className='cardInfo p-3'>
          <div className='infoLabel bg-gray-300 animate-pulse h-4 w-24 mb-2'></div>
          <div className='infoValue bg-gray-300 animate-pulse h-4 w-16'></div>
        </div>
      </div>
    </>
  );
};

export default ProductCardSkeleton;
