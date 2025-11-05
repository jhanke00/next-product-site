import { useState } from 'react';

export default function StarRatingInput({ rating, setRating }) {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: 'pointer',
            color: star <= (hover || rating) ? '#ffc107' : '#e4e5e9',
            fontSize: '24px',
          }}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
