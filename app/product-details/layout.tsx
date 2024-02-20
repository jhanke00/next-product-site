import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Example product page with mock data',
};

export default function ProductDetailsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
