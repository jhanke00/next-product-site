'use client';

import React from 'react';
import CheckoutStepper from '@/src/components/checkout/CheckoutStepper';
import ShippingForm from '@/src/components/checkout/ShippingForm';

export default function ShippingPage() {
  return (
    <main className='flex min-h-screen flex-col p-24'>
      <div className='max-w-4xl w-full mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Checkout</h1>
        <CheckoutStepper currentStep='shipping' />
        <div className='bg-white rounded-lg shadow-md p-6'>
          <h2 className='text-2xl font-semibold mb-6'>Shipping Information</h2>
          <ShippingForm />
        </div>
      </div>
    </main>
  );
}
