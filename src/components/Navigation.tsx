'use client';
import Link from 'next/link';
import { useState } from 'react';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { CartButton } from './CartButton';
import { useAdminMode } from '@/src/context/AdminContext';

interface NavigationProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  showSearch?: boolean;
}

export default function Navigation({ onSearch, searchQuery = '', showSearch = false }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const { isAdmin, setAdminMode } = useAdminMode();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchInput.trim());
    }
  };

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/#categories' },
  ];

  return (
    <nav className='bg-white shadow-lg border-b'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link href='/' className='flex items-center'>
              <span className='text-xl font-bold text-gray-900'>ProductStore</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-4'>
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className='text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200'
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar (if enabled) */}
          {showSearch && (
            <div className='flex-1 max-w-lg mx-4'>
              <form onSubmit={handleSearchSubmit} className='relative'>
                <input
                  type='text'
                  placeholder='Search products...'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                />
                <MagnifyingGlassIcon className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                <button
                  type='submit'
                  className='absolute right-2 top-1.5 bg-blue-600 text-white p-1.5 rounded-md hover:bg-blue-700 transition-colors duration-200'
                >
                  <MagnifyingGlassIcon className='h-4 w-4' />
                </button>
              </form>
            </div>
          )}

          {/* Cart Button and Mobile Menu */}
          <div className='flex items-center space-x-2'>
            <div className='hidden md:flex items-center bg-gray-100 rounded-md border border-gray-200 text-xs font-medium text-gray-600'>
              <button
                type='button'
                onClick={() => setAdminMode(false)}
                className={`px-3 py-1 rounded-l-md transition-colors ${isAdmin ? 'hover:text-gray-900' : 'bg-blue-600 text-white'}`}
                aria-pressed={!isAdmin}
              >
                User View
              </button>
              <button
                type='button'
                onClick={() => setAdminMode(true)}
                className={`px-3 py-1 rounded-r-md transition-colors ${isAdmin ? 'bg-blue-600 text-white' : 'hover:text-gray-900'}`}
                aria-pressed={isAdmin}
              >
                Admin View
              </button>
            </div>
            <CartButton />
            <div className='md:hidden'>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className='text-gray-600 hover:text-gray-900 p-2'>
                {isMenuOpen ? <XMarkIcon className='h-6 w-6' /> : <Bars3Icon className='h-6 w-6' />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50'>
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className='text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium'
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className='flex items-center justify-between px-3 py-2 bg-white rounded-md border border-gray-200 text-xs font-medium text-gray-600'>
                <button
                  type='button'
                  onClick={() => setAdminMode(false)}
                  className={`flex-1 py-1 mr-1 rounded-md transition-colors ${isAdmin ? 'hover:text-gray-900' : 'bg-blue-600 text-white'}`}
                  aria-pressed={!isAdmin}
                >
                  User
                </button>
                <button
                  type='button'
                  onClick={() => setAdminMode(true)}
                  className={`flex-1 py-1 ml-1 rounded-md transition-colors ${isAdmin ? 'bg-blue-600 text-white' : 'hover:text-gray-900'}`}
                  aria-pressed={isAdmin}
                >
                  Admin
                </button>
              </div>

              {/* Mobile Search */}
              {showSearch && (
                <div className='px-3 py-2'>
                  <form onSubmit={handleSearchSubmit} className='relative'>
                    <input
                      type='text'
                      placeholder='Search products...'
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    />
                    <MagnifyingGlassIcon className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
