import { Skeleton } from '@components/ui/skeleton';

export const ProductDetailSkeleton = () => {
  return (
    <div className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100'>
      <div className='p-6 bg-gradient-to-r from-blue-500/30 to-purple-600/30'>
        <Skeleton className='h-[2.25rem] w-3/4 mb-2 bg-white/20' />
        <Skeleton className='h-8 w-1/2 bg-white/20' />
      </div>

      <div className='p-6'>
        <div className='flex items-center justify-between mb-6'>
          <Skeleton className='h-[2.25rem] w-28 bg-gray-200/60' />
          <Skeleton className='h-6 w-32 rounded-full bg-green-100/50' />
        </div>

        <div className='space-y-4'>
          <div>
            <Skeleton className='h-4 w-28 mb-2 bg-gray-200/60' />
            <Skeleton className='h-4 w-full bg-gray-200/60' />
            <Skeleton className='h-4 w-full mt-1 bg-gray-200/60' />
          </div>

          <div className='flex flex-wrap gap-4'>
            <div className='bg-gray-50 rounded-lg p-3 flex-1'>
              <Skeleton className='h-3 w-20 mb-2 bg-gray-200/60' />
              <div className='mt-1 flex items-center'>
                <Skeleton className='h-5 w-5 mr-2 rounded-md bg-gray-200/60' />
                <Skeleton className='h-5 w-28 bg-gray-200/60' />
              </div>
            </div>

            <div className='bg-gray-50 rounded-lg p-3 flex-1'>
              <Skeleton className='h-3 w-20 mb-2 bg-gray-200/60' />
              <div className='mt-1 flex items-center'>
                <div className='flex space-x-1'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Skeleton key={star} className='h-5 w-5 rounded-sm bg-gray-200/60' />
                  ))}
                </div>
                <Skeleton className='h-4 w-32 ml-2 bg-gray-200/60' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
