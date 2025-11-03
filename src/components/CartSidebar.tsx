'use client';
import React from 'react';
import { useCart } from '@/src/context/CartContext';
import { XMarkIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ShoppingBagIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
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

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className='fixed inset-0 bg-white/01 backdrop-blur-md z-40 transition-opacity' onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-gray-200'>
            <h2 className='text-xl font-bold text-gray-900 flex items-center'>
              <ShoppingBagIcon className='w-6 h-6 mr-2 text-blue-600' />
              Shopping Cart ({cart.totalItems})
            </h2>
            <button onClick={onClose} className='p-2 hover:bg-gray-100 rounded-full transition-colors'>
              <XMarkIcon className='w-6 h-6 text-gray-500' />
            </button>
          </div>

          {/* Cart Items */}
          <div className='flex-1 overflow-y-auto p-6'>
            {cart.items.length === 0 ? (
              <div className='text-center py-12'>
                <ShoppingBagIcon className='w-16 h-16 mx-auto text-gray-300 mb-4' />
                <p className='text-gray-500 text-lg mb-4'>Your cart is empty</p>
                <Link
                  href='/products'
                  onClick={onClose}
                  className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block'
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className='space-y-4'>
                {cart.items.map((item) => (
                  <div key={item.id} className='flex items-start space-x-4 p-4 bg-gray-50 rounded-lg'>
                    <Image
                      src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop&crop=center&sig=${item.id}`}
                      alt={item.name}
                      width={64}
                      height={64}
                      className='w-16 h-16 object-cover rounded-lg'
                    />
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-sm font-semibold text-gray-900 truncate'>{item.name}</h3>
                      <p className='text-sm text-gray-600 mt-1'>${formatPrice(item.price)} each</p>
                      <div className='flex items-center justify-between mt-2'>
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className='p-1 hover:bg-gray-200 rounded-full transition-colors'
                          >
                            <MinusIcon className='w-4 h-4 text-gray-600' />
                          </button>
                          <span className='text-sm font-bold px-3 py-1 bg-gray-100 text-gray-900 rounded-lg min-w-[2rem] text-center'>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.countInStock}
                            className='p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            <PlusIcon className='w-4 h-4 text-gray-600' />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className='p-1 hover:bg-red-100 rounded-full transition-colors'
                        >
                          <TrashIcon className='w-4 h-4 text-red-500' />
                        </button>
                      </div>
                      <div className='flex justify-between items-center mt-2'>
                        <span className='text-sm font-bold text-gray-900'>
                          Subtotal: ${formatPrice(parseFloat(item.price) * item.quantity)}
                        </span>
                        {item.quantity >= item.countInStock && (
                          <span className='text-xs text-red-500'>Max stock reached</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                {cart.items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className='w-full mt-4 py-2 px-4 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors'
                  >
                    Clear All Items
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.items.length > 0 && (
            <div className='border-t border-gray-200 p-6'>
              <div className='flex justify-between items-center mb-4'>
                <span className='text-lg font-bold text-gray-900'>Total:</span>
                <span className='text-2xl font-bold text-blue-600'>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className='space-y-3'>
                <Link
                  href='/cart'
                  onClick={onClose}
                  className='w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center block'
                >
                  View Cart
                </Link>
                <Link
                  href='/checkout'
                  onClick={onClose}
                  className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block'
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
