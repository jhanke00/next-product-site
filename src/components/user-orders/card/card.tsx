import { PRICE, QUANTITY, TOTAL } from '@/src/constants/user-orders';
import { Item, CardProps } from '@/src/type/orders';
import React from 'react';

export const Card = React.memo(({ data }: CardProps) => {
  const { name, price, count, id } = data;
  return (
    <div
      key={id}
      className='rounded-2xl bg-gray-300 border border-gray-100 flex flex-col transition-all duration-500 hover:border-gray-400'
    >
      <div className='mt-2'>
        <div className='flex flex-col pt-6 px-6'>
          <h2 className='font-medium text-xl leading-8 text-black mb-3'>{name}</h2>
          <p className='font-normal text-sm  text-gray-500'>Order #: {id}</p>
        </div>
      </div>
      <hr className='my-2' />
      <div className='pb-6 px-6  flex flex-col md:flex-row md:items-center'>
        <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-3 md:gap-8'>
          <div className=''>
            <p className='font-normal text-lg leading-8 text-black '>{`${PRICE}: ${price.toLocaleString()}`}</p>
          </div>
          <div className='flex items-center justify-between gap-8'>
            <div className='flex items-center gap-3'>
              <p className='font-normal text-lg leading-8 text-black '>{`${QUANTITY}: ${count}`}</p>
            </div>
            <h6 className='font-medium text-xl leading-8 text-black'>{`${TOTAL}: ${(price * count).toLocaleString()}`}</h6>
          </div>
        </div>
      </div>
    </div>
  );
});

Card.displayName = 'Card';
