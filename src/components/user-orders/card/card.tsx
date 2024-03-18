import { PRICE, QUANTITY, TOTAL } from '@/src/constants/user-orders';
import { Item, CardProps } from '@/src/type/orders';
import Image from 'next/image';

export const Card = ({ data }: CardProps) => {
  const { name, price, count, id } = data;

  return (
    <div className='rounded-3xl p-6 bg-gray-100 border border-gray-100 flex flex-col md:flex-row md:items-center gap-5 transition-all duration-500 hover:border-gray-400'>
      <div className='img-box '>
        <Image src='/vercel.svg' alt={name} className='w-full md:max-w-[122px]' width={50} height={50} />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 w-full gap-3 md:gap-8'>
        <div className=''>
          <h2 className='font-medium text-xl leading-8 text-black mb-3'>{name}</h2>
          <p className='font-normal text-lg leading-8 text-gray-500 '>{`${PRICE}: ${price.toLocaleString()}`}</p>
          <p className='font-normal text-lg leading-8 text-gray-500 '>{`${QUANTITY}: ${count}`}</p>
          <p className='font-normal text-xs leading-8 text-black mb-3'>Order #: {id}</p>
        </div>

        <div className='flex items-center justify-between gap-8'>
          <h6 className='font-medium text-xl leading-8 text-indigo-600'>{`${TOTAL}: ${(price * count).toLocaleString()}`}</h6>
        </div>
      </div>
    </div>
  );
};
