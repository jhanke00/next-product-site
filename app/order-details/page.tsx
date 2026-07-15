'use client';

import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';
import { CartContext } from '@/context/CartContext';

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type ContactAddress = {
  name: string;
  email: string;
  address: string;
};

type OrderDetails = {
  items: OrderItem[];
  totalPrice: number;
  totalItems: number;
  shippingAddress?: ContactAddress;
  billingAddress?: ContactAddress;
  createdAt: string;
};

export default function OrderDetailsPage() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const cartContext = useContext(CartContext);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // prefer canonical order from context (persisted to localStorage)
      const ctx = cartContext?.currentOrder;
      if (ctx) {
        setOrderDetails(ctx);
        setIsLoading(false);
        return;
      }
      try {
        const saved = localStorage.getItem('currentOrder');
        if (saved) {
          setOrderDetails(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load order details:', e);
      }
      setIsLoading(false);
    }
  }, [cartContext?.currentOrder]);

  if (isLoading) {
    return (
      <main className='min-h-screen bg-gray-50 p-6 lg:p-8'>
        <div className='mx-auto max-w-2xl'>
          <div className='rounded-lg border border-gray-200 bg-white p-8 text-center'>
            <div className='animate-pulse'>
              <div className='h-6 bg-gray-200 rounded mb-4 w-3/4 mx-auto'></div>
              <div className='h-4 bg-gray-200 rounded mb-2 w-full'></div>
              <div className='h-4 bg-gray-200 rounded w-5/6 mx-auto'></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!orderDetails) {
    return (
      <main className='min-h-screen bg-gray-50 p-6 lg:p-8'>
        <div className='mx-auto max-w-2xl'>
          <div className='rounded-lg border border-gray-200 bg-white p-8 text-center'>
            <h1 className='text-2xl font-semibold text-gray-900 mb-2'>Order details not available</h1>
            <p className='text-sm text-gray-600 mb-6'>
              If you completed payment, please return to the cart and try again.
            </p>
            <Link
              href='/'
              className='inline-flex rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700'
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-gray-50 p-6 lg:p-8'>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-8'>
          <p className='text-sm font-semibold uppercase tracking-wide text-green-600'>✓ Payment Complete</p>
          <h1 className='mt-2 text-3xl font-bold text-gray-900'>Order Confirmed</h1>
          <p className='mt-1 text-gray-600'>
            Thank you for your purchase. Your order is confirmed and will be shipped soon.
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Order Summary Card */}
            <div className='rounded-lg border border-gray-200 bg-white p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>Order Details</h2>
              <div className='grid grid-cols-3 gap-4 mb-6'>
                <div>
                  <p className='text-xs text-gray-500 uppercase tracking-wider'>Order Date</p>
                  <p className='mt-1 font-semibold text-gray-900 text-sm'>
                    {new Date(orderDetails.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 uppercase tracking-wider'>Total Items</p>
                  <p className='mt-1 font-semibold text-gray-900 text-sm'>{orderDetails.totalItems}</p>
                </div>
                <div>
                  <p className='text-xs text-gray-500 uppercase tracking-wider'>Total Amount</p>
                  <p className='mt-1 font-semibold text-blue-600 text-sm'>${orderDetails.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className='rounded-lg border border-gray-200 bg-white overflow-hidden'>
              <div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
                <h3 className='text-sm font-semibold text-gray-900'>Order Items</h3>
              </div>
              <table className='w-full text-sm'>
                <thead className='bg-gray-50 border-b border-gray-200'>
                  <tr>
                    <th className='px-6 py-3 text-left font-semibold text-gray-900'>Product</th>
                    <th className='px-6 py-3 text-right font-semibold text-gray-900'>Price</th>
                    <th className='px-6 py-3 text-right font-semibold text-gray-900'>Qty</th>
                    <th className='px-6 py-3 text-right font-semibold text-gray-900'>Total</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {orderDetails.items.map((item) => (
                    <tr key={item.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-3 text-gray-900'>{item.name}</td>
                      <td className='px-6 py-3 text-right text-gray-900'>${item.price.toFixed(2)}</td>
                      <td className='px-6 py-3 text-right text-gray-900'>{item.quantity}</td>
                      <td className='px-6 py-3 text-right font-semibold text-gray-900'>
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Addresses */}
            <div className='grid gap-4 md:grid-cols-2'>
              {orderDetails.shippingAddress && (
                <div className='rounded-lg border border-gray-200 bg-white p-5'>
                  <p className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3'>Shipping Address</p>
                  <div className='space-y-1 text-sm'>
                    <p className='font-semibold text-gray-900'>{orderDetails.shippingAddress.name}</p>
                    <p className='text-gray-700'>{orderDetails.shippingAddress.address}</p>
                    <p className='text-gray-600'>{orderDetails.shippingAddress.email}</p>
                  </div>
                </div>
              )}

              {orderDetails.billingAddress && (
                <div className='rounded-lg border border-gray-200 bg-white p-5'>
                  <p className='text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3'>Billing Address</p>
                  <div className='space-y-1 text-sm'>
                    <p className='font-semibold text-gray-900'>{orderDetails.billingAddress.name}</p>
                    <p className='text-gray-700'>{orderDetails.billingAddress.address}</p>
                    <p className='text-gray-600'>{orderDetails.billingAddress.email}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className='sticky top-8 rounded-lg border border-gray-200 bg-white p-5'>
              <h3 className='text-sm font-semibold text-gray-900 mb-4'>Order Summary</h3>

              <div className='space-y-3 mb-4 pb-4 border-b border-gray-200 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='text-gray-900 font-medium'>${orderDetails.totalPrice.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Shipping</span>
                  <span className='text-gray-900 font-medium'>Free</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Tax</span>
                  <span className='text-gray-900 font-medium'>$0.00</span>
                </div>
              </div>

              <div className='mb-6 flex justify-between items-center'>
                <span className='font-semibold text-gray-900'>Total</span>
                <span className='text-xl font-bold text-blue-600'>${orderDetails.totalPrice.toFixed(2)}</span>
              </div>

              <div className='space-y-2'>
                <Link
                  href='/'
                  className='block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 transition'
                >
                  Continue Shopping
                </Link>
                <Link
                  href='/'
                  className='block w-full rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-50 transition'
                >
                  Back to Store
                </Link>
              </div>

              <div className='mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200'>
                <p className='text-xs text-blue-900 font-medium'>📧 Confirmation email sent</p>
                <p className='text-xs text-blue-800 mt-1'>
                  Check your email for order details and tracking information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
