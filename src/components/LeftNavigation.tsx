'use client';
import { HomeIcon, QueueListIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const links = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Products', href: '/products', icon: QueueListIcon },
  { name: 'Orders', href: '/orders', icon: ShoppingCartIcon },
];

export default function LeftNavigation() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname ? pathname === link.href || pathname.startsWith(`${link.href}/`) : false;
        return (
          <a
            key={link.name}
            href={link.href}
            className={clsx('app-menu-item', {
              'bg-sky-600 text-blue-100': isActive,
            })}
          >
            <LinkIcon className='w-7 h-7' />
            <p className='hidden md:block text-xl'>{link.name}</p>
          </a>
        );
      })}
    </>
  );
}
