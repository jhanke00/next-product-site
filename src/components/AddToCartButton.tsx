'use client';
import React, { useState } from 'react';
import { useCart } from '@/src/context/CartContext';
import { ShoppingBagIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Product } from '@/src/type/products';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  showQuantity?: boolean;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  quantity = 1,
  size = 'md',
  variant = 'primary',
  className = '',
  showQuantity = false,
}) => {
  const { addToCart, isInCart, getCartItemQuantity } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    if (product.countInStock === 0) return;

    setIsAdding(true);

    try {
      addToCart(product, quantity);
      setShowSuccess(true);

      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-white',
  };

  const currentQuantity = getCartItemQuantity(product.id);
  const isOutOfStock = product.countInStock === 0;
  const isMaxQuantity = currentQuantity >= product.countInStock;

  if (isOutOfStock) {
    return (
      <button
        disabled
        className={`${sizeClasses[size]} rounded-lg font-semibold transition-all duration-200 bg-gray-300 text-gray-500 cursor-not-allowed ${className}`}
      >
        Out of Stock
      </button>
    );
  }

  if (showSuccess) {
    return (
      <button
        disabled
        className={`${sizeClasses[size]} rounded-lg font-semibold transition-all duration-200 bg-green-600 text-white flex items-center justify-center ${className}`}
      >
        <CheckIcon className='w-4 h-4 mr-2' />
        Added to Cart!
      </button>
    );
  }

  return (
    <div className='flex flex-col'>
      <button
        onClick={handleAddToCart}
        disabled={isAdding || isMaxQuantity}
        className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-lg font-semibold transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center ${className}`}
      >
        {isAdding ? (
          <>
            <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2' />
            Adding...
          </>
        ) : (
          <>
            <ShoppingBagIcon className='w-4 h-4 mr-2' />
            {isInCart(product.id) ? 'Add More' : 'Add to Cart'}
          </>
        )}
      </button>

      {/* Quantity in cart indicator */}
      {showQuantity && currentQuantity > 0 && (
        <div className='text-xs text-gray-600 mt-1 text-center'>{currentQuantity} in cart</div>
      )}

      {/* Max quantity warning */}
      {isMaxQuantity && <div className='text-xs text-red-500 mt-1 text-center'>Max quantity reached</div>}
    </div>
  );
};
