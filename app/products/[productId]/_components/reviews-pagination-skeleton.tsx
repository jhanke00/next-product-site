import { Skeleton } from '@components/ui/skeleton';

export const ReviewsPaginationSkeleton = () => {
  return (
    <div className='flex items-center justify-center'>
      <nav className='flex items-center space-x-1'>
        <Skeleton className='h-9 w-9 rounded-md mr-1 bg-gray-300' />

        <div className='flex items-center gap-1'>
          <Skeleton className='h-9 w-9 rounded-md bg-gray-300' />
          <Skeleton className='h-9 w-9 rounded-md bg-gray-300' />
          <Skeleton className='h-9 w-9 rounded-md bg-gray-300' />

          <div className='flex h-9 w-9 items-center justify-center'>
            <Skeleton className='h-1 w-6 rounded-full bg-gray-300' />
          </div>
        </div>

        <Skeleton className='h-9 w-9 rounded-md ml-1 bg-gray-300' />
      </nav>
    </div>
  );
};
