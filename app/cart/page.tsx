'use client';
import React from 'react';
import { useCart } from '@/src/context/CartContext';
import Navigation from '@/src/components/Navigation';
import { MinusIcon, PlusIcon, TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const formatPrice = (price: string | number) => {
    return typeof price === 'string' ? parseFloat(price).toFixed(2) : price.toFixed(2);
  };

  const shipping = cart.totalPrice > 50 ? 0 : 9.99;
  const tax = cart.totalPrice * 0.08; // 8% tax
  const finalTotal = cart.totalPrice + shipping + tax;

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center'>
            <Link href='/products' className='flex items-center text-gray-600 hover:text-gray-900 mr-4'>
              <ArrowLeftIcon className='w-5 h-5 mr-2' />
              Continue Shopping
            </Link>
            <h1 className='text-3xl font-bold text-gray-900'>Shopping Cart</h1>
          </div>

          {cart.items.length > 0 && (
            <button onClick={clearCart} className='text-red-600 hover:text-red-800 text-sm font-medium'>
              Clear All Items
            </button>
          )}
        </div>

        {cart.items.length === 0 ? (
          /* Empty Cart State */
          <div className='bg-white rounded-2xl shadow-sm p-12 text-center'>
            <ShoppingBagIcon className='w-24 h-24 mx-auto text-gray-300 mb-6' />
            <h2 className='text-2xl font-bold text-gray-900 mb-4'>Your cart is empty</h2>
            <p className='text-gray-600 mb-8 max-w-md mx-auto'>
              Looks like you haven&apos;t added anything to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              href='/products'
              className='bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center'
            >
              <ShoppingBagIcon className='w-5 h-5 mr-2' />
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Cart Content */
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Cart Items */}
            <div className='lg:col-span-2'>
              <div className='bg-white rounded-2xl shadow-sm overflow-hidden'>
                <div className='p-6 border-b border-gray-200'>
                  <h2 className='text-xl font-bold text-gray-900'>Cart Items ({cart.totalItems})</h2>
                </div>

                <div className='divide-y divide-gray-200'>
                  {cart.items.map((item) => (
                    <div key={item.id} className='p-6 flex items-start space-x-6'>
                      {/* Product Image */}
                      <Image
                        src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop&crop=center&sig=${item.id}`}
                        alt={item.name}
                        width={120}
                        height={120}
                        className='w-24 h-24 object-cover rounded-lg'
                      />

                      {/* Product Details */}
                      <div className='flex-1 min-w-0'>
                        <Link
                          href={`/products/${item.id}`}
                          className='text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2'
                        >
                          {item.name}
                        </Link>
                        <p className='text-sm text-gray-600 mt-1 line-clamp-2'>{item.description}</p>
                        <div className='flex items-center mt-2'>
                          <span className='text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full'>
                            {item.category}
                          </span>
                          <span className='text-sm text-gray-500 ml-4'>${formatPrice(item.price)} each</span>
                        </div>

                        {/* Stock Status */}
                        <div className='flex items-center mt-2'>
                          {item.countInStock > 0 ? (
                            <span className='text-xs text-green-600 font-medium'>
                              ✓ In Stock ({item.countInStock} available)
                            </span>
                          ) : (
                            <span className='text-xs text-red-600 font-medium'>✗ Out of Stock</span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className='flex flex-col items-end space-y-4'>
                        <div className='flex items-center space-x-3'>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                          >
                            <MinusIcon className='w-4 h-4 text-gray-600' />
                          </button>
                          <span className='text-lg font-bold px-4 py-2 bg-gray-100 text-gray-900 rounded-lg min-w-[3rem] text-center'>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.countInStock}
                            className='p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            <PlusIcon className='w-4 h-4 text-gray-600' />
                          </button>
                        </div>

                        {/* Item Subtotal */}
                        <div className='text-right'>
                          <div className='text-lg font-bold text-gray-900'>
                            ${formatPrice(parseFloat(item.price) * item.quantity)}
                          </div>
                          {item.quantity >= item.countInStock && (
                            <div className='text-xs text-red-500'>Max quantity</div>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className='p-2 hover:bg-red-50 rounded-full transition-colors group'
                        >
                          <TrashIcon className='w-5 h-5 text-gray-400 group-hover:text-red-500' />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className='lg:col-span-1'>
              <div className='bg-white rounded-2xl shadow-sm p-6 sticky top-8'>
                <h3 className='text-xl font-bold text-gray-900 mb-6'>Order Summary</h3>

                <div className='space-y-4'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Subtotal ({cart.totalItems} items)</span>
                    <span className='font-semibold text-gray-900'>${cart.totalPrice.toFixed(2)}</span>
                  </div>

                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Shipping</span>
                    <span className='font-semibold text-gray-900'>
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <div className='text-xs text-blue-600 bg-blue-50 p-3 rounded-lg'>
                      💡 Free shipping on orders over $50!
                    </div>
                  )}

                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Tax (8%)</span>
                    <span className='font-semibold text-gray-900'>${tax.toFixed(2)}</span>
                  </div>

                  <div className='border-t border-gray-200 pt-4'>
                    <div className='flex justify-between items-center'>
                      <span className='text-lg font-bold text-gray-900'>Total</span>
                      <span className='text-2xl font-bold text-blue-600'>${finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href='/checkout'
                  className='w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors mt-6 flex items-center justify-center'
                >
                  Proceed to Checkout
                  <ArrowRightIcon className='w-5 h-5 ml-2' />
                </Link>

                {/* Continue Shopping */}
                <Link
                  href='/products'
                  className='w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors mt-3 flex items-center justify-center'
                >
                  Continue Shopping
                </Link>

                {/* Security Badge */}
                <div className='mt-6 text-center'>
                  <div className='flex items-center justify-center text-xs text-gray-500'>
                    <span className='mr-2'>🔒</span>
                    Secure checkout with SSL encryption
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
