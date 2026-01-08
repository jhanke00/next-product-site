import React from 'react';

export const metadata = {
  title: 'Checkout',
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  // layout wrapper for checkout pages
  return (
    <div className='max-w-3xl mx-auto py-10'>
      <h1 className='text-2xl font-semibold mb-6'>Checkout</h1>
      {children}
    </div>
  );
}
