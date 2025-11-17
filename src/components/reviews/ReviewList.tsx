'use client';

import { Review } from '@/src/type/reviews';
import StarRatingDisplay from './StarRatingDisplay';

type Props = {
  reviews: Review[];
  onVoteHelpful: (id: string, helpful: boolean) => void;
};

export default function ReviewList({ reviews, onVoteHelpful }: Props) {
  if (!reviews.length) {
    return <p className='text-sm opacity-70 mt-2'>No reviews yet.</p>;
  }

  return (
    <div className='flex flex-col gap-4 mt-4'>
      {reviews.map((review) => (
        <div key={review._id} className='border rounded-lg p-3 flex flex-col gap-1'>
          <div className='flex justify-between items-center'>
            <StarRatingDisplay rating={review.rating} size='sm' />
            <span className='text-xs opacity-60'>{new Date(review.createdAt).toLocaleDateString()}</span>
          </div>
          <div className='text-xs opacity-70'>
            by <span className='font-medium'>{review.userName}</span>
          </div>
          {review.title && <div className='font-semibold text-sm'>{review.title}</div>}
          <p className='text-sm whitespace-pre-line'>{review.comment}</p>

          <div className='flex items-center gap-3 mt-2 text-xs'>
            <span className='opacity-70'>Was this review helpful?</span>
            <button type='button' className='border rounded px-2 py-1' onClick={() => onVoteHelpful(review._id, true)}>
              Yes ({review.helpfulYes})
            </button>
            <button type='button' className='border rounded px-2 py-1' onClick={() => onVoteHelpful(review._id, false)}>
              No ({review.helpfulNo})
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
