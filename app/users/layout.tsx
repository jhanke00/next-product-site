import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Example users info page with mock data',
};

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className='flex min-h-screen flex-col items-center p-8 max-sm:p-2'>{children}</main>;
}
