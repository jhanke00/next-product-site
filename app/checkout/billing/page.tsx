'use client';

import { BillingForm } from '@/src/components/checkout/BillingForm';

export default function BillingPage() {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
      <div className='max-w-4xl mx-auto mb-8'>
        <div className='flex items-center justify-center gap-2 text-sm'>
          <div className='flex items-center'>
            <div className='w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold'>
              ✓
            </div>
            <span className='ml-2 text-gray-600 dark:text-gray-400'>Review</span>
          </div>
          <div className='w-12 h-0.5 bg-green-600'></div>
          <div className='flex items-center'>
            <div className='w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold'>
              ✓
            </div>
            <span className='ml-2 text-gray-600 dark:text-gray-400'>Shipping</span>
          </div>
          <div className='w-12 h-0.5 bg-green-600'></div>
          <div className='flex items-center'>
            <div className='w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold'>
              3
            </div>
            <span className='ml-2 font-semibold text-gray-900 dark:text-white'>Billing</span>
          </div>
          <div className='w-12 h-0.5 bg-gray-300 dark:bg-gray-600'></div>
          <div className='flex items-center'>
            <div className='w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 flex items-center justify-center font-semibold'>
              4
            </div>
            <span className='ml-2 text-gray-600 dark:text-gray-400'>Payment</span>
          </div>
        </div>
      </div>
      <BillingForm />
    </main>
  );
}
