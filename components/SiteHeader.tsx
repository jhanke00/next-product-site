'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';
import type { SiteNavLink } from '@/lib/categoryConfig';
import { usePathname } from 'next/navigation';

type Props = {
  links: SiteNavLink[];
  activeId?: string;
};

export default function SiteHeader({ links, activeId }: Props) {
  const cartContext = useContext(CartContext);
  const cart = cartContext?.cart || [];
  const totalItems = cart.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
  const params = usePathname();

  return (
    <div className='mb-8 relative left-1/2 right-1/2 mx-[-50vw] w-screen bg-white border-b border-gray-100'>
      <div className='flex items-center justify-between px-8 py-3 h-16'>
        <Link href='/' className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-blue-600 rounded flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>S</span>
          </div>
          <span className='text-base font-bold text-gray-900'>Store</span>
        </Link>

        <div className='flex items-center gap-8'>
          <div className='flex items-center gap-6'>
            {links.map((link) => {
              let pathArray = params ? params.split('/') : '';
              let activeId = pathArray[pathArray.length - 1];
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`text-sm font-semibold transition ${
                    activeId === link.id ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className='w-px h-5 bg-gray-200' />

          <div className='flex items-center gap-6'>
            <button className='group relative text-gray-700 hover:text-blue-600 transition' title='Wishlist'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2}
                stroke='currentColor'
                className='w-5 h-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
                />
              </svg>
              <span className='pointer-events-none absolute -bottom-10 left-1/2 z-10 -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                Wishlist: 0 items
              </span>
            </button>

            <Link href='/cart' className='group relative text-gray-700 hover:text-blue-600 transition' title='Cart'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2}
                stroke='currentColor'
                className='w-5 h-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.25 3h1.386c.622 0 1.151.432 1.271 1.04a59.926 59.926 0 0119.892 0c.12-.608.649-1.04 1.271-1.04h1.386c.621 0 1.151.432 1.271 1.04a60.009 60.009 0 01-19.892 0c.12-.608.65-1.04 1.271-1.04M2.25 3v19.5a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V3m-15 0h6m0 0h6m0 0v7.5a2.25 2.25 0 01-2.25 2.25H9.75A2.25 2.25 0 017.5 10.5V3m0 0h6m0 0H3.75'
                />
              </svg>
              {totalItems > 0 && (
                <span className='absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full'>
                  {totalItems}
                </span>
              )}
              <span className='pointer-events-none absolute -bottom-10 left-1/2 z-10 -translate-x-1/2 rounded-full bg-slate-900 px-3 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
                {totalItems > 0 ? `${totalItems} item${totalItems > 1 ? 's' : ''} in cart` : 'Cart is empty'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
