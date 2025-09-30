'use client';

import { useCart } from '../../../src/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CartReview = () => {
  const { state, dispatch } = useCart();
  const router = useRouter();

  const subtotal = state.items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', id });
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-8 sm:px-6 lg:px-8'>
        <h2 className='text-2xl md:text-3xl font-bold mb-6 text-gray-900'>Review Your Cart</h2>

        {state.items.length === 0 ? (
          <div className='text-center py-12 bg-white rounded-lg shadow-sm'>
            <p className='text-gray-500 mb-4 text-lg'>Your cart is empty</p>
            <Link
              href='/products'
              className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200'
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
              <div className='divide-y divide-gray-200'>
                {state.items.map((item) => (
                  <div key={item.id} className='p-6 sm:flex sm:items-center sm:justify-between'>
                    <div className='flex-1 mb-4 sm:mb-0'>
                      <h3 className='text-lg font-medium text-gray-900'>{item.name}</h3>
                      <p className='mt-1 text-sm text-gray-500'>Unit Price: ${item.price}</p>
                      <p className='mt-1 text-sm text-gray-500'>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className='flex flex-col sm:flex-row items-start sm:items-center sm:space-x-6'>
                      <div className='flex items-center space-x-2 mb-2 sm:mb-0'>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className='w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100'
                        >
                          -
                        </button>
                        <span className='w-12 text-center font-medium'>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className='w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 hover:bg-gray-100'
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className='text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-200'
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='mt-8 bg-white rounded-lg shadow-sm p-6'>
              <div className='space-y-4'>
                <div className='flex justify-between text-base'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='font-medium'>${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-base'>
                  <span className='text-gray-600'>Tax (10%)</span>
                  <span className='font-medium'>${tax.toFixed(2)}</span>
                </div>
                <div className='border-t pt-4 flex justify-between text-lg font-bold'>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className='mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-4 space-y-4 space-y-reverse sm:space-y-0'>
              <Link
                href='/products'
                className='flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                Continue Shopping
              </Link>
              <button
                onClick={() => router.push('/checkout/shipping')}
                className='flex justify-center items-center px-6 py-3 border border-transparent rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              >
                Proceed to Shipping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartReview;
