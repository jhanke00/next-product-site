'use client';

import { useCart } from '../../src/context/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const CheckoutLayout = ({ children }: { children: React.ReactNode }) => {
  const { state } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (state.items.length === 0) {
      router.push('/products');
    }
  }, [state.items.length, router]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto py-12 sm:px-6 lg:px-8'>
        <div className='bg-white overflow-hidden shadow-sm sm:rounded-lg'>{children}</div>
      </div>
    </div>
  );
};

export default CheckoutLayout;
