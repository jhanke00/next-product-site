import { BreadcrumbType } from '@type/common';

export const productBreadcrumbs: BreadcrumbType[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products', active: true },
];
export const productDetailsBreadcrumbs: BreadcrumbType[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products', active: false },
  { label: 'Product Details', href: '#', active: true },
];
