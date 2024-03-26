'use client';

import React from 'react';
import TextField from '../ReusableComponents/TextField/TextField';
import Link from 'next/link';
import SearchField from './SearchField';

const Header = () => {
  return (
    <nav className='flex items-center justify-between flex-wrap p-6 bg-gray-900'>
      <Link className='flex items-center flex-shrink-0 text-white mr-6' href='/products'>
        <span className='font-semibold text-xl tracking-tight'>Product</span>
      </Link>
      <div className='w-full block flex-grow lg:flex lg:items-center lg:w-auto'>
        <div className='text-sm lg:flex-grow'>
          {/* <a
            href='#responsive-header'
            className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4'
          >
            Docs
          </a>
          <a
            href='#responsive-header'
            className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4'
          >
            Examples
          </a>
          <a href='#responsive-header' className='block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white'>
            Blog
          </a> */}
        </div>
        <SearchField />
      </div>
    </nav>
  );
};

export default Header;
