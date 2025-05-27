import { REVIEWS_PER_PAGE } from '@/app/products/[productId]/_constants/review';
import { ReviewSkeleton } from '@/app/products/[productId]/_components/review-skeleton';
import { ReviewsPaginationSkeleton } from '@/app/products/[productId]/_components/reviews-pagination-skeleton';

export const ReviewsSkeleton = () => {
  return (
    <div>
      <div className='space-y-4'>
        {[...new Array(REVIEWS_PER_PAGE)].map((_, index) => (
          <ReviewSkeleton key={index} />
        ))}
      </div>

      <div className={'mt-4'}>
        <ReviewsPaginationSkeleton />
      </div>
    </div>
  );
};
