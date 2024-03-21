import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header>
      <nav className='block w-full py-2 mx-auto bg-white border shadow-md border-white/80 bg-opacity-80 backdrop-blur-2xl backdrop-saturate-200 lg:py-4'>
        <div className='container flex items-center justify-between mx-auto text-blue-gray-900'>
          <a
            href='#'
            className='mr-4 block cursor-pointer py-1.5 font-sans text-base font-medium leading-relaxed text-inherit antialiased'
          >
            Product Search Website
          </a>
          <div className='hidden lg:block'>
            <ul className='flex flex-col gap-2 mt-2 mb-4 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6'>
              <li className='flex items-center p-1 font-sans text-sm antialiased leading-normal gap-x-2 text-blue-gray-900'>
                <Link
                  href='/'
                  className='block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-green mr-4 font-semibold'
                >
                  Home
                </Link>
              </li>
              <li className='flex items-center p-1 font-sans text-sm antialiased leading-normal gap-x-2 text-blue-gray-900'>
                <Link
                  href='/products'
                  className='block mt-4 lg:inline-block lg:mt-0 text-teal-lighter hover:text-green mr-4 font-semibold'
                >
                  Products
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
