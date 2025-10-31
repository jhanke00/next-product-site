'use client';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating = ({ rating, maxRating = 5, size = 'md' }: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className='flex items-center'>
      {[...Array(maxRating)].map((_, i) => (
        <span key={i} className={`${sizeClasses[size]} text-yellow-400`}>
          {i < fullStars
            ? '★' // Full star
            : i === fullStars && hasHalfStar
              ? '⯨' // Half star (approximation)
              : '☆' // Empty star
          }
        </span>
      ))}
      <span className='ml-2 text-gray-600'>({rating.toFixed(1)})</span>
    </div>
  );
};

export default StarRating;
