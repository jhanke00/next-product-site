'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import CheckoutStepper from '@/src/components/checkout/CheckoutStepper';

interface Order {
  id: string;
  cart: {
    items: Array<{
      productId: string;
      name: string;
      price: number;
      qty: number;
    }>;
  };
  shipping: {
    fullName?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phone?: string;
    email?: string;
  };
  paymentId: string;
  status: string;
  createdAt: string;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId') || null;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is missing');
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Order not found');
          } else {
            setError('Failed to load order');
          }
          setLoading(false);
          return;
        }

        const orderData = await response.json();
        setOrder(orderData);
      } catch (err) {
        setError('An error occurred while loading the order');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const calculateTotals = () => {
    if (!order) return { subtotal: 0, tax: 0, fee: 0, total: 0 };
    const subtotal = order.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = subtotal * 0.18; // 18% tax GST
    const fee = subtotal * 0.02; // 2% Platform charge
    const total = subtotal + tax + fee;
    return { subtotal, tax, fee, total };
  };

  const getEmailInfo = () => {
    if (!order) return { subject: '', body: '' };

    const subject = `Order Confirmation - ${order.id}`;
    const body = `Thank you for your order!

Order ID: ${order.id}
Payment ID: ${order.paymentId}
Status: ${order.status}
Created: ${new Date(order.createdAt).toLocaleString()}

Items:
${order.cart.items.map((item) => `- ${item.name} x${item.qty} - ₹${(item.price * item.qty).toFixed(2)}`).join('\n')}

Total: ₹${calculateTotals().total.toFixed(2)}

Shipping Address:
${order.shipping.fullName || ''}
${order.shipping.address1 || ''}
${order.shipping.address2 ? order.shipping.address2 + '\n' : ''}${order.shipping.city || ''}, ${order.shipping.state || ''} ${order.shipping.postalCode || ''}
${order.shipping.country || ''}

We'll send you a confirmation email shortly.`;

    return { subject, body };
  };

  if (loading) {
    return (
      <main className='flex min-h-screen flex-col p-24'>
        <div className='max-w-4xl w-full mx-auto'>
          <div className='bg-white rounded-lg shadow-md p-6 text-center'>
            <p className='text-gray-500'>Loading order...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className='flex min-h-screen flex-col p-24'>
        <div className='max-w-4xl w-full mx-auto'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-2xl font-semibold mb-4 text-red-600'>Error</h2>
            <p className='text-gray-600'>{error || 'Order not found'}</p>
          </div>
        </div>
      </main>
    );
  }

  const totals = calculateTotals();
  const emailInfo = getEmailInfo();

  return (
    <main className='flex min-h-screen flex-col p-24'>
      <div className='max-w-4xl w-full mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Checkout</h1>
        <CheckoutStepper currentStep='confirmation' />
        <div className='bg-white rounded-lg shadow-md p-6 space-y-6'>
          <div>
            <h2 className='text-2xl font-semibold mb-4'>Order Confirmation</h2>
            <p className='text-gray-600 mb-2'>
              <span className='font-medium'>Order ID:</span> {order.id}
            </p>
            <p className='text-gray-600 mb-2'>
              <span className='font-medium'>Payment ID:</span> {order.paymentId}
            </p>
            <p className='text-gray-600 mb-4'>
              <span className='font-medium'>Status:</span> <span className='capitalize'>{order.status}</span>
            </p>
          </div>

          <div className='border-t border-gray-200 pt-4'>
            <h3 className='text-xl font-semibold mb-4'>Order Items</h3>
            <div className='space-y-3'>
              {order.cart.items.map((item, index) => (
                <div key={index} className='flex justify-between items-center border-b border-gray-100 pb-3'>
                  <div className='flex-1'>
                    <p className='font-medium'>{item.name}</p>
                    <p className='text-sm text-gray-600'>
                      ₹{item.price.toFixed(2)} x {item.qty}
                    </p>
                  </div>
                  <p className='font-semibold'>₹{(item.price * item.qty).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='border-t border-gray-200 pt-4'>
            <h3 className='text-xl font-semibold mb-4'>Totals</h3>
            <div className='space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Subtotal:</span>
                <span className='font-medium'>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Tax:</span>
                <span className='font-medium'>₹{totals.tax.toFixed(2)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Platform Charges:</span>
                <span className='font-medium'>₹{totals.fee.toFixed(2)}</span>
              </div>
              <div className='flex justify-between text-lg font-semibold pt-2 border-t border-gray-200'>
                <span>Total:</span>
                <span>₹{totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className='border-t border-gray-200 pt-4'>
            <h3 className='text-xl font-semibold mb-4'>Shipping Information</h3>
            <div className='text-gray-600 space-y-1'>
              <p>{order.shipping.fullName}</p>
              <p>{order.shipping.address1}</p>
              {order.shipping.address2 && <p>{order.shipping.address2}</p>}
              <p>
                {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}
              </p>
              <p>{order.shipping.country}</p>
              {order.shipping.phone && <p>Phone: {order.shipping.phone}</p>}
              {order.shipping.email && <p>Email: {order.shipping.email}</p>}
            </div>
          </div>

          <div className='border-t border-gray-200 pt-4'>
            <h3 className='text-xl font-semibold mb-4'>Confirmation Email</h3>
            <div className='bg-gray-50 rounded-lg p-4 space-y-3'>
              <div>
                <p className='text-sm font-medium text-gray-700 mb-1'>To:</p>
                <p className='text-gray-600'>{order.shipping.email || 'customer@example.com'}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-700 mb-1'>Subject:</p>
                <p className='text-gray-600'>{emailInfo.subject}</p>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-700 mb-1'>Body:</p>
                <pre className='text-sm text-gray-600 whitespace-pre-wrap font-sans'>{emailInfo.body}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className='flex min-h-screen flex-col p-24'>
          <div className='max-w-4xl w-full mx-auto'>
            <div className='bg-white rounded-lg shadow-md p-6 text-center'>
              <p className='text-gray-500'>Loading...</p>
            </div>
          </div>
        </main>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
