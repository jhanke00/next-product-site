import { Skeleton } from '@/src/components/ui/skeleton';
import { Info } from 'lucide-react';

export const ReviewsHeadingSkeleton = () => {
  return (
    <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-lg shadow-lg mb-8'>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <Skeleton className='h-8 w-40 bg-white/30 rounded-md' />
          <div className='h-1 w-20 bg-white/60 rounded-full mt-2'></div>
        </div>

        <Skeleton className='h-10 w-full md:w-64 bg-white/30 rounded-md' />
      </div>

      <div className='flex items-center justify-between text-white/80 mt-4'>
        <div className='flex items-center'>
          <Info className='h-5 w-5 mr-2' />
          <Skeleton className='h-4 w-64 bg-white/30 rounded-md' />
        </div>

        <div className='relative group'>
          <div className='absolute -inset-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-lg blur-sm opacity-70'></div>
          <div className='relative'>
            <Skeleton className='h-9 w-28 bg-white/30 rounded-md' />
          </div>
        </div>
      </div>
    </div>
  );
};
