import { Search } from 'lucide-react';

export default function NoProduct() {
  return (
    <div className='flex flex-col items-center justify-center py-20'>
      <div className='relative mb-6'>
        <div className='absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50'></div>
        <Search className='relative w-24 h-24 text-gray-400' />
      </div>
      <h3 className='text-2xl font-bold text-gray-900 mb-2'>No products found</h3>
      <p className='text-gray-600 text-center max-w-md mb-6'>
        We couldn&apos;t find any products matching your search. Try adjusting your search terms.
      </p>
    </div>
  );
}
