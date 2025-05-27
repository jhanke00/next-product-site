import { RatingStar } from '@/app/products/[productId]/_components/rating-star';
import { User } from 'lucide-react';
import { MAX_REVIEW_RATING } from '@/app/products/[productId]/_constants/review';
import { IReview } from '@type/reviews';
import { normalizeRating } from '@/app/products/[productId]/_utils/normalize-rating';
import { formUsername } from '@/app/products/[productId]/_utils/form-username';

type ReviewProps = {
  review: IReview;
};

export const Review = (props: ReviewProps) => {
  const { review } = props;

  const normalizedRating = normalizeRating(review.rating);

  return (
    <div className='bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300'>
      {normalizedRating && (
        <div className='flex items-center gap-2 mb-3'>
          <div className='bg-yellow-400 text-yellow-800 font-bold px-3 py-1 rounded-full text-sm'>
            {normalizedRating}/{MAX_REVIEW_RATING}
          </div>
          <div className='flex gap-1'>
            {[1, 2, 3, 4, 5].map((star) => (
              <RatingStar key={star} isActive={star <= normalizedRating} />
            ))}
          </div>
        </div>
      )}

      <p className='text-gray-800 font-medium text-lg mb-4'>{review.review}</p>

      <div className='flex items-center mt-4 pt-4 border-t border-gray-100'>
        <div className='bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold'>
          <User />
        </div>
        <div className='ml-3'>
          <p className='text-sm font-semibold text-gray-700'>{formUsername(review.user)}</p>
        </div>
      </div>
    </div>
  );
};
