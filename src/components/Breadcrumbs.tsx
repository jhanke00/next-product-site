import Link from 'next/link';
import type { BreadcrumbType } from '@type/common';

export default function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbType[] }) {
  return (
    <nav className='mb-6'>
      <ol className='flex text-lg md:text-xl lg:text-xl'>
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            className={`font-medium ${breadcrumb.active ? 'text-blue-900' : 'text-blue-500 hover:text-blue-700'}`}
          >
            <Link href={breadcrumb.href} className='transition-colors duration-200 ease-in-out'>
              {breadcrumb.label}
            </Link>
            {index < breadcrumbs.length - 1 && <span className='mx-2 text-blue-400'>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
