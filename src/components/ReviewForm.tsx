import React, { useState } from 'react';

const ReviewForm = ({ onSubmit }: { onSubmit: (review: any) => void }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim()) {
      onSubmit({ rating, comment });
      setRating(0);
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label htmlFor='rating' className='block text-sm font-medium'>
          Rating
        </label>
        <input
          type='number'
          id='rating'
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min='1'
          max='5'
          className='border rounded p-2 w-full'
        />
      </div>
      <div>
        <label htmlFor='comment' className='block text-sm font-medium'>
          Comment
        </label>
        <textarea
          id='comment'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className='border rounded p-2 w-full'
        />
      </div>
      <button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded'>
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
