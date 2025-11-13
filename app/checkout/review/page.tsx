'use client';

import React from 'react';
import Link from 'next/link';
import CartSummary from '@/src/components/cart/CartSummary';
import CheckoutStepper from '@/src/components/checkout/CheckoutStepper';

export default function ReviewPage() {
  return (
    <main className='flex min-h-screen flex-col p-24'>
      <div className='max-w-4xl w-full mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Checkout</h1>
        <CheckoutStepper currentStep='review' />
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-2xl font-semibold mb-6'>Review Your Order</h2>
          <CartSummary hideButton={true} />
          <div className='mt-6'>
            <Link
              href='/checkout/shipping'
              className='block w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors'
            >
              Proceed to Shipping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
