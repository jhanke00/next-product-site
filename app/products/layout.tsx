import type { Metadata } from 'next';
import '@/app/products/products.module.css';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Example product page with mock data',
};

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
