'use client';

import { useState } from 'react';

type Props = {
  value: number;
  onChange: (value: number) => void;
};

export default function StarRatingInput({ value, onChange }: Props) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className='flex items-center gap-2'>
      {[1, 2, 3, 4, 5].map((star) => {
        const active = hover !== null ? star <= hover : star <= value;
        return (
          <button
            key={star}
            type='button'
            className='border-none bg-transparent text-2xl cursor-pointer'
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange(star)}
          >
            {active ? '★' : '☆'}
          </button>
        );
      })}
      <span className='text-xs opacity-70'>{value || 0} / 5</span>
    </div>
  );
}
