'use client';

import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'LMS', href: '/lms' },
  ];

  return (
    <header className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex-shrink-0 flex items-center'>
            <Link href='/' className='flex items-center space-x-2'>
              <div className='bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl'>
                L
              </div>
              <span className='text-xl font-bold text-gray-900'>LearnHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex space-x-8'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={'px-3 py-2 rounded-md text-sm font-medium transition-colors'}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export { Header };
