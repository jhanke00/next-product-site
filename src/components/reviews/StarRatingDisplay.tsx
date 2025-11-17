type Props = {
  rating: number; // 0–5
  size?: 'sm' | 'md' | 'lg';
};

const sizeClass = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-lg',
};

export default function StarRatingDisplay({ rating, size = 'md' }: Props) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) stars.push('★');
    else if (i === fullStars + 1 && hasHalf)
      stars.push('☆'); // simple approximation
    else stars.push('☆');
  }

  return (
    <div className={`flex items-center gap-1 ${sizeClass[size]}`}>
      <span>{stars.join('')}</span>
      <span className='opacity-60'>({rating.toFixed(1)})</span>
    </div>
  );
}
