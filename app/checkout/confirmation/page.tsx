'use client';

import { OrderConfirmation } from '@/src/components/checkout/OrderConfirmation';

export default function ConfirmationPage() {
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
      <OrderConfirmation />
    </main>
  );
}
