'use client';

import { useReviewsRatingFilter } from '@/app/products/[productId]/_hooks/use-reviews-rating-filter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { REVIEW_RATINGS } from '@/app/products/[productId]/_constants/review';
import { RatingStar } from '@/app/products/[productId]/_components/rating-star';

export const ReviewsRatingFilter = () => {
  const { onRatingValueChange, rating } = useReviewsRatingFilter();

  return (
    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
      <h1 className='text-3xl font-bold text-white drop-shadow-sm'>
        Product Reviews
        <div className='h-1 w-20 bg-white/60 rounded-full mt-2'></div>
      </h1>

      <div className='w-full md:w-64'>
        <Select value={rating} onValueChange={onRatingValueChange}>
          <SelectTrigger className='bg-white/90 backdrop-blur-sm border-none focus:ring-2 focus:ring-white/50 transition-all'>
            <SelectValue placeholder='Filter by rating' />
          </SelectTrigger>
          <SelectContent className='bg-white/95 backdrop-blur-sm border border-purple-100'>
            <SelectItem value={REVIEW_RATINGS.all} className='focus:bg-purple-50 transition-colors'>
              <div className='flex items-center gap-2'>
                <span className='text-gray-500'>All Ratings</span>
              </div>
            </SelectItem>

            {[5, 4, 3, 2, 1].map((rating) => (
              <SelectItem
                key={rating}
                value={REVIEW_RATINGS[rating as keyof typeof REVIEW_RATINGS]}
                className='focus:bg-purple-50 transition-colors'
              >
                <div className='flex items-center gap-2'>
                  <div className='flex'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <RatingStar key={star} isActive={star <= rating} />
                    ))}
                  </div>
                  <span className='text-gray-700 font-medium'>{rating}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
