import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <nav className='flex items-center justify-between flex-wrap bg-teal p-6'>
        <div className='flex items-center flex-no-shrink mr-6'>
          <span className='font-bold text-xl tracking-tight'>Product Search Website</span>
        </div>
        <div className='w-full block flex-grow lg:flex lg:items-center lg:w-auto'>
          <div className='text-sm lg:flex-grow'>
            <Link
              href='/'
              className='block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-green mr-4 font-semibold'
            >
              Home
            </Link>
            <Link
              href='/products'
              className='block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-green mr-4 font-semibold'
            >
              Products
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
