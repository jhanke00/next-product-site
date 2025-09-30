'use client';
import { useCart } from '@/src/context/CartContext';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';

export default function Header() {
  const { state } = useCart();
  const cartItemsCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className='fixed top-0 left-0 right-0 bg-white shadow-md z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <Link href='/' className='flex items-center'>
            <span className='text-xl sm:text-2xl font-bold text-gray-800 transition-colors hover:text-gray-600'>
              ShopNext
            </span>
          </Link>

          <nav className='hidden md:flex space-x-4 lg:space-x-8'>
            <Link
              href='/'
              className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm lg:text-base transition-colors'
            >
              Home
            </Link>
            <Link
              href='/products'
              className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm lg:text-base transition-colors'
            >
              Products
            </Link>
          </nav>

          {/* Mobile Navigation */}
          <div className='flex md:hidden'>
            <Link href='/' className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm'>
              Home
            </Link>
            <Link href='/products' className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm'>
              Products
            </Link>
          </div>

          <Link href='/checkout/cart' className='relative group p-2'>
            <FaShoppingCart className='h-5 w-5 sm:h-6 sm:w-6 text-gray-600 hover:text-gray-900 transition-colors' />
            {cartItemsCount > 0 && (
              <span className='absolute -top-2 -right-1 bg-red-500 text-white rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-xs'>
                {cartItemsCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
