import { Skeleton } from '@components/ui/skeleton';

export const ReviewSkeleton = () => {
  return (
    <div className='border rounded-lg p-4 mb-4 bg-white/10 backdrop-blur-sm'>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex items-center'>
          <Skeleton className='h-10 w-10 rounded-full bg-gray-300' />

          <div className='ml-3'>
            <Skeleton className='h-4 w-32 bg-gray-300 rounded-md' />
            <Skeleton className='h-3 w-24 bg-gray-300 rounded-md mt-1.5' />
          </div>
        </div>

        <div className='flex space-x-1'>
          {[1, 2, 3, 4, 5].map((star) => (
            <Skeleton key={star} className='h-4 w-4 bg-gray-300 rounded-full' />
          ))}
        </div>
      </div>

      <div className='space-y-2 mt-4'>
        <Skeleton className='h-3 w-full bg-gray-300 rounded-md' />
        <Skeleton className='h-3 w-full bg-gray-300 rounded-md' />
        <Skeleton className='h-3 w-3/4 bg-gray-300 rounded-md' />
      </div>

      <div className='flex justify-end mt-4 space-x-2'>
        <Skeleton className='h-8 w-16 bg-gray-300 rounded-md' />
        <Skeleton className='h-8 w-16 bg-gray-300 rounded-md' />
      </div>
    </div>
  );
};
