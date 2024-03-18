import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Products',
  description: 'Product page with mock data',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='app-page-container'>
      <div className='app-page-content'>{children}</div>
    </div>
  );
}
