import { LeaveReviewDialog } from '@/app/products/[productId]/_components/leave-review-dialog';
import { Info } from 'lucide-react';
import { ReviewsRatingFilter } from '@/app/products/[productId]/_components/reviews-rating-filter';

export const ReviewsHeading = () => {
  return (
    <div className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-lg shadow-lg mb-8'>
      <ReviewsRatingFilter />

      <div className='flex items-center justify-between text-white/80 mt-4'>
        <div className='flex items-center'>
          <Info className='h-5 w-5 mr-2' />
          <span className='text-sm'>Showing customer reviews for this product</span>
        </div>

        <div className='relative group'>
          <div className='absolute -inset-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-lg blur-sm opacity-70 group-hover:opacity-100 transition duration-300'></div>
          <div className='relative'>
            <LeaveReviewDialog />
          </div>
        </div>
      </div>
    </div>
  );
};
