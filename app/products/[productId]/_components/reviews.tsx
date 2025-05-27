'use client';

import { PaginationWithLinks } from '@components/ui/pagination-with-links';
import { REVIEWS_PER_PAGE } from '@/app/products/[productId]/_constants/review';
import { PropsWithChildren } from 'react';
import { Product } from '@type/products';
import { ReviewsSkeleton } from '@/app/products/[productId]/_components/reviews-skeleton';
import { Review } from '@/app/products/[productId]/_components/review';
import { useReviews } from '@/app/products/[productId]/_hooks/use-reviews';

type Props = {
  productId: Product['id'];
};

export const Reviews = ({ productId }: PropsWithChildren<Props>) => {
  const { shouldShowPagination, totalReviewsCount, page, reviews, isFetching, shouldShowReviews } = useReviews({
    productId,
  });

  if (isFetching) {
    return <ReviewsSkeleton />;
  }

  return (
    <div>
      {shouldShowReviews && (
        <div className='space-y-4'>
          {reviews.map((review) => {
            return <Review key={review.id} review={review} />;
          })}
        </div>
      )}

      {shouldShowPagination && (
        <div className={'mt-4'}>
          <PaginationWithLinks page={page} pageSize={REVIEWS_PER_PAGE} totalCount={totalReviewsCount} />
        </div>
      )}
    </div>
  );
};
