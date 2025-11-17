import React from 'react';
import StarRating from './StarRating';

const ReviewList = ({ reviews }: { reviews: Array<{ rating: number; comment: string }> }) => {
  return (
    <div className='space-y-4'>
      {reviews.map((review, index) => (
        <div key={index} className='border p-4 rounded'>
          <StarRating rating={review.rating} />
          <p className='mt-2'>{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
