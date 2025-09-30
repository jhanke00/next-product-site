'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/src/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

type OrderDetails = {
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  shipping: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  payment: {
    last4: string;
    total: number;
  };
  orderDate: string;
};

export default function Confirmation() {
  const router = useRouter();
  const { dispatch } = useCart();
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    const orderDetails = localStorage.getItem('last-order');
    if (!orderDetails) {
      router.push('/products');
      return;
    }

    try {
      const parsedOrder = JSON.parse(orderDetails);
      setOrder(parsedOrder);
    } catch (error) {
      console.error('Error parsing order:', error);
      router.push('/products');
    }

    setTimeout(() => {
      // clear cart and order details
      dispatch({ type: 'CLEAR_CART' });
      localStorage.removeItem('shipping-info');
      localStorage.removeItem('last-order');

      toast.success('Confirmation email sent.');
    }, 8000);
  }, [dispatch, router]);

  if (!order) return null;

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <div className='text-center mb-8'>
        <h2 className='text-2xl font-bold text-green-600 mb-2'>Order Confirmed!</h2>
        <p className='text-gray-600'>
          Thank you for your purchase. A confirmation email has been sent to {order.shipping.email}
        </p>
      </div>

      <div className='bg-gray-50 rounded-lg p-6 mb-6'>
        <h3 className='font-bold mb-4'>Order Summary</h3>
        <div className='space-y-4'>
          {order.items.map((item) => (
            <div key={item.id} className='flex justify-between'>
              <div>
                <span className='font-medium'>{item.name}</span>
                <span className='text-gray-500 ml-2'>x{item.quantity}</span>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className='border-t pt-4'>
            <div className='flex justify-between font-bold'>
              <span>Total</span>
              <span>${order.payment.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div>
          <h3 className='font-bold mb-2'>Shipping Information</h3>
          <div className='text-sm text-gray-600'>
            <p>{`${order.shipping.firstName} ${order.shipping.lastName}`}</p>
            <p>{order.shipping.address}</p>
            <p>{`${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}`}</p>
            <p>{order.shipping.country}</p>
          </div>
        </div>

        <div>
          <h3 className='font-bold mb-2'>Payment Information</h3>
          <div className='text-sm text-gray-600'>
            <p>Card ending in {order.payment.last4}</p>
            <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className='mt-8 text-center'>
        <Link href='/products' className='px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
