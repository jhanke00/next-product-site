'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/contexts/CartContext';
import { useCheckout } from '@/src/contexts/CheckoutContext';
import { OrderData } from '@/src/type/checkout';
import { createOrder } from '@/src/utils/orderService';
import { sendOrderConfirmationEmail } from '@/src/utils/emailService';

export const OrderConfirmation: React.FC = () => {
  const { cart, clearCart } = useCart();
  const { checkoutData, resetCheckout } = useCheckout();
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processOrder = async () => {
      // Validate that we have all required data
      if (!checkoutData.shipping || !checkoutData.billing || !checkoutData.payment) {
        setError('Missing checkout information. Please start over.');
        setIsProcessing(false);
        return;
      }

      if (cart.items.length === 0) {
        setError('Your cart is empty.');
        setIsProcessing(false);
        return;
      }

      try {
        // Create order
        const newOrder = await createOrder(cart, checkoutData.shipping, checkoutData.billing, checkoutData.payment);

        setOrder(newOrder);

        // Send confirmation email
        await sendOrderConfirmationEmail(newOrder);

        // Clear cart and checkout data
        clearCart();
        resetCheckout();

        setIsProcessing(false);
      } catch (err) {
        console.error('Order processing error:', err);
        setError(err instanceof Error ? err.message : 'Failed to process order');
        setIsProcessing(false);
      }
    };

    processOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - run once on mount

  if (isProcessing) {
    return (
      <div className='max-w-4xl mx-auto p-6'>
        <div className='flex flex-col items-center justify-center min-h-[400px]'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4'></div>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>Processing Your Order...</h2>
          <p className='text-gray-600 dark:text-gray-400'>
            Please wait while we process your payment and create your order.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='max-w-4xl mx-auto p-6'>
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6'>
          <h2 className='text-2xl font-bold text-red-800 dark:text-red-200 mb-4'>Order Failed</h2>
          <p className='text-red-700 dark:text-red-300 mb-6'>{error}</p>
          <div className='flex gap-4'>
            <button
              onClick={() => router.push('/cart')}
              className='px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
            >
              Back to Cart
            </button>
            <button
              onClick={() => router.push('/products')}
              className='px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-12 h-12 bg-green-500 rounded-full flex items-center justify-center'>
            <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
          </div>
          <div>
            <h2 className='text-2xl font-bold text-green-800 dark:text-green-200'>Order Confirmed!</h2>
            <p className='text-green-700 dark:text-green-300'>Thank you for your purchase</p>
          </div>
        </div>
        <p className='text-green-700 dark:text-green-300'>
          A confirmation email has been sent to <strong>{order.shipping.email}</strong>
        </p>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Order Details</h3>
        <div className='space-y-2 text-sm'>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-gray-400'>Order ID:</span>
            <span className='font-mono font-semibold text-gray-900 dark:text-white'>{order.orderId}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-gray-400'>Order Date:</span>
            <span className='text-gray-900 dark:text-white'>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-gray-600 dark:text-gray-400'>Status:</span>
            <span className='text-green-600 dark:text-green-400 font-semibold capitalize'>{order.status}</span>
          </div>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Order Items</h3>
        <div className='space-y-3'>
          {order.items.map((item) => (
            <div
              key={item.id}
              className='flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0'
            >
              <div>
                <p className='font-medium text-gray-900 dark:text-white'>{item.name}</p>
                <p className='text-sm text-gray-600 dark:text-gray-400'>Quantity: {item.quantity}</p>
              </div>
              <p className='font-semibold text-gray-900 dark:text-white'>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Order Summary</h3>
        <div className='space-y-2'>
          <div className='flex justify-between text-gray-700 dark:text-gray-300'>
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className='flex justify-between text-gray-700 dark:text-gray-300'>
            <span>Shipping</span>
            <span>{order.shipping_cost === 0 ? 'FREE' : `$${order.shipping_cost.toFixed(2)}`}</span>
          </div>
          <div className='flex justify-between text-gray-700 dark:text-gray-300'>
            <span>Tax</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className='border-t border-gray-200 dark:border-gray-700 pt-2 mt-2'>
            <div className='flex justify-between text-xl font-bold text-gray-900 dark:text-white'>
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
        <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Shipping Address</h3>
          <div className='text-sm text-gray-700 dark:text-gray-300 space-y-1'>
            <p>
              {order.shipping.firstName} {order.shipping.lastName}
            </p>
            <p>{order.shipping.address}</p>
            <p>
              {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
            </p>
            <p>{order.shipping.country}</p>
            <p className='mt-2'>{order.shipping.email}</p>
            <p>{order.shipping.phone}</p>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Payment Method</h3>
          <div className='text-sm text-gray-700 dark:text-gray-300 space-y-1'>
            <p>Card ending in {order.payment.last4}</p>
            <p>{order.payment.cardholderName}</p>
          </div>
        </div>
      </div>

      <div className='flex gap-4'>
        <button
          onClick={() => router.push('/products')}
          className='flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};
