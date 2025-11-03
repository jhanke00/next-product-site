'use client';

import React, { useEffect, useState } from 'react';
import Navigation from '@/src/components/Navigation';
import { CheckCircleIcon, TruckIcon, EnvelopeIcon, PrinterIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Order } from '@/src/type/orders';
import { useParams } from 'next/navigation';
import Image from 'next/image';

type FetchErrorState = 'not-found' | 'fetch-error' | null;

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function OrderConfirmationPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FetchErrorState>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setOrder(null);
        setError('not-found');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/orders?id=${orderId}`, { cache: 'no-store' });

        if (!response.ok) {
          setOrder(null);
          setError(response.status === 404 ? 'not-found' : 'fetch-error');
          return;
        }

        const data = await response.json();
        const normalizedOrder: Order = {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
        };

        setOrder(normalizedOrder);
        setError(null);
      } catch (fetchError) {
        console.error('Error fetching order:', fetchError);
        setOrder(null);
        setError('fetch-error');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navigation />
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Loading order details…</h1>
          <p className='text-gray-600'>Please wait while we retrieve your order.</p>
        </div>
      </div>
    );
  }

  if (error === 'not-found' || !order) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navigation />
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Order Not Found</h1>
          <p className='text-gray-600 mb-8'>
            We couldn&apos;t find the order you&apos;re looking for. Please check your order number or contact support.
          </p>
          <Link
            href='/products'
            className='bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (error === 'fetch-error') {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navigation />
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Unable to load order</h1>
          <p className='text-gray-600 mb-8'>
            Something went wrong while retrieving your order. Please refresh the page or try again later.
          </p>
          <Link
            href='/products'
            className='bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Success Header */}
        <div className='text-center mb-8'>
          <CheckCircleIcon className='w-20 h-20 text-green-500 mx-auto mb-4' />
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>Order Confirmed!</h1>
          <p className='text-lg text-gray-600'>
            Thank you for your order. We&apos;ve received it and will process it shortly.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className='bg-white rounded-2xl shadow-sm overflow-hidden mb-8'>
          {/* Order Header */}
          <div className='bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 text-white'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-xl font-bold'>Order #{order.orderNumber}</h2>
                <p className='text-green-100'>Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className='text-right'>
                <div className='text-2xl font-bold'>${order.total.toFixed(2)}</div>
                <div className='text-green-100 capitalize'>{order.status}</div>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className='p-6'>
            {/* Status and Next Steps */}
            <div className='grid md:grid-cols-3 gap-6 mb-8'>
              <div className='text-center p-4 bg-green-50 rounded-lg'>
                <CheckCircleIcon className='w-8 h-8 text-green-500 mx-auto mb-2' />
                <h3 className='font-semibold text-gray-900'>Order Placed</h3>
                <p className='text-sm text-gray-600'>Your order has been received</p>
              </div>

              <div className='text-center p-4 bg-gray-50 rounded-lg'>
                <div className='w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center'>
                  <div className='w-3 h-3 bg-gray-500 rounded-full'></div>
                </div>
                <h3 className='font-semibold text-gray-900'>Processing</h3>
                <p className='text-sm text-gray-600'>We&apos;re preparing your items</p>
              </div>

              <div className='text-center p-4 bg-gray-50 rounded-lg'>
                <TruckIcon className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                <h3 className='font-semibold text-gray-900'>Shipped</h3>
                <p className='text-sm text-gray-600'>Your order is on its way</p>
              </div>
            </div>

            {/* Order Items */}
            <div className='border-t border-gray-200 pt-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Order Items</h3>
              <div className='space-y-4'>
                {order.items.map((item) => (
                  <div key={item.id} className='flex items-center space-x-4'>
                    <Image
                      src={
                        item.image ||
                        `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop&crop=center&sig=${item.id}`
                      }
                      alt={item.name}
                      width={64}
                      height={64}
                      className='w-16 h-16 object-cover rounded-lg'
                    />
                    <div className='flex-1'>
                      <h4 className='font-medium text-gray-900'>{item.name}</h4>
                      <p className='text-sm text-gray-600'>{item.category}</p>
                      <p className='text-sm text-gray-600'>Quantity: {item.quantity}</p>
                    </div>
                    <div className='text-right'>
                      <div className='font-semibold text-gray-900'>
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>
                      <div className='text-sm text-gray-600'>${parseFloat(item.price).toFixed(2)} each</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Totals */}
            <div className='border-t border-gray-200 pt-6 mt-6'>
              <div className='space-y-2 max-w-sm ml-auto'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Subtotal:</span>
                  <span className='font-semibold text-gray-900'>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Shipping:</span>
                  <span className='font-semibold text-gray-900'>
                    {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Tax:</span>
                  <span className='font-semibold text-gray-900'>${order.tax.toFixed(2)}</span>
                </div>
                <div className='border-t border-gray-200 pt-2'>
                  <div className='flex justify-between'>
                    <span className='text-lg font-bold text-gray-900'>Total:</span>
                    <span className='text-lg font-bold text-green-600'>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className='bg-white rounded-2xl shadow-sm p-6 mb-8'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Shipping Address</h3>
          <div className='text-gray-600'>
            <p className='font-medium text-gray-900'>
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className='mt-2'>
              Email: <span className='font-medium text-gray-900'>{order.shippingAddress.email}</span>
            </p>
            <p>
              Phone: <span className='font-medium text-gray-900'>{order.shippingAddress.phone}</span>
            </p>
          </div>
        </div>

        {/* Payment Method */}
        <div className='bg-white rounded-2xl shadow-sm p-6 mb-8'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Payment Method</h3>
          <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <div className='w-8 h-8 bg-green-600 rounded-full flex items-center justify-center'>
                  <span className='text-white text-sm font-bold'>₹</span>
                </div>
              </div>
              <div className='ml-3'>
                <h4 className='text-base font-semibold text-green-900'>Cash on Delivery (COD)</h4>
                <p className='text-green-700 text-sm mt-1'>
                  Pay ₹{order.total.toFixed(2)} in cash when your order is delivered.
                </p>
              </div>
            </div>
            <div className='mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
              <p className='text-xs text-yellow-800'>
                <span className='font-medium'>💡 Tip:</span> Please keep the exact amount ready for a smooth delivery
                experience.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <button
            onClick={() => window.print()}
            className='flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
          >
            <PrinterIcon className='w-5 h-5 mr-2' />
            Print Order
          </button>

          <Link
            href={`mailto:${order.shippingAddress.email}?subject=Order Confirmation - ${order.orderNumber}&body=Your order ${order.orderNumber} has been confirmed and is being processed.`}
            className='flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors'
          >
            <EnvelopeIcon className='w-5 h-5 mr-2' />
            Email Receipt
          </Link>

          <Link
            href='/products'
            className='flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors'
          >
            Continue Shopping
          </Link>

          <Link
            href='/'
            className='flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors'
          >
            Back to Home
          </Link>
        </div>

        {/* Important Information */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
          <h4 className='font-semibold text-blue-900 mb-2'>What happens next?</h4>
          <ul className='text-blue-800 text-sm space-y-1'>
            <li>• You&apos;ll receive an email confirmation shortly</li>
            <li>• We&apos;ll send you tracking information once your order ships</li>
            <li>• Estimated delivery: 3-5 business days</li>
            <li>• Questions? Contact us at support@productstore.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
