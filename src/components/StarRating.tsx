import React from 'react';

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className='flex'>
      {[...Array(5)].map((_, index) => (
        <span key={index} className={index < rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
