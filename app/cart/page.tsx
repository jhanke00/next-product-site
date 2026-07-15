'use client';

import Link from 'next/link';
import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartContext } from '@/context/CartContext';

export default function CartPage() {
  const cartContext = useContext(CartContext);
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  if (!cartContext) return <p>Loading...</p>;

  const { cart, removeItem } = cartContext;

  const totalPrice = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return (
    <main className='min-h-screen p-8'>
      <div className='mx-auto max-w-4xl space-y-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-4xl font-bold'>Your Cart</h1>
          <Link href='/' className='text-sm text-blue-600 hover:underline'>
            Back to homepage
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className='rounded-3xl border border-gray-200 bg-white p-12 text-center'>
            <p className='text-xl text-gray-600 mb-4'>Your cart is empty</p>
            <Link
              href='/'
              className='inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className='overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm'>
              <table className='w-full'>
                <thead>
                  <tr className='border-b border-gray-200 bg-gray-50'>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Product</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Price</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Quantity</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Total</th>
                    <th className='px-6 py-4 text-left text-sm font-semibold text-gray-900'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item: any, index: number) => (
                    <tr key={item.id} className={index !== cart.length - 1 ? 'border-b border-gray-200' : ''}>
                      <td className='px-6 py-4 text-sm text-gray-900'>{item.name}</td>
                      <td className='px-6 py-4 text-sm text-gray-900'>${item.price.toFixed(2)}</td>
                      <td className='px-6 py-4 text-sm text-gray-900 font-medium'>{item.quantity}</td>
                      <td className='px-6 py-4 text-sm font-semibold text-gray-900'>
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                      <td className='px-6 py-4 text-sm'>
                        <button
                          onClick={() => removeItem(item.id)}
                          className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium'
                        >
                          Discard
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='rounded-lg border border-gray-200 bg-white p-8'>
              <div className='flex justify-end gap-8 mb-8'>
                <div>
                  <p className='text-sm text-gray-600 mb-2'>Total Items</p>
                  <p className='text-2xl font-bold text-gray-900'>{totalItems}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-600 mb-2'>Total Price</p>
                  <p className='text-2xl font-bold text-blue-600'>${totalPrice.toFixed(2)}</p>
                </div>
              </div>

              <div className='flex flex-col gap-4 sm:flex-row'>
                <Link
                  href='/'
                  className='flex-1 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium text-center'
                >
                  Continue Shopping
                </Link>
                <button
                  type='button'
                  onClick={() => router.push('/checkout')}
                  className='flex-1 rounded-lg bg-green-600 px-6 py-3 text-white transition hover:bg-green-700 font-medium'
                >
                  Proceed to Checkout
                </button>
              </div>
              {paymentError && <p className='mt-4 text-sm text-red-600'>{paymentError}</p>}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
