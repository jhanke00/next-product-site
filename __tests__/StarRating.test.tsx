import React from 'react';
import { render, screen } from '@testing-library/react';
import StarRating from '@/src/components/StarRating';

describe('StarRating', () => {
  it('renders full, half, and empty stars correctly', () => {
    const { container } = render(<StarRating rating={3.5} />);
    const stars = container.querySelectorAll('span.text-yellow-400');
    expect(stars).toHaveLength(5);
    const text = container.textContent || '';
    // 3 full stars
    expect((text.match(/★/g) || []).length).toBe(3);
    // 1 half star
    expect((text.match(/⯨/g) || []).length).toBe(1);
    // 1 empty star
    expect((text.match(/☆/g) || []).length).toBe(1);
    // rating label
    expect(screen.getByText('(3.5)')).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { rerender, container } = render(<StarRating rating={4} size='sm' />);
    const smallStar = container.querySelector('span.text-yellow-400');
    expect(smallStar?.className).toContain('text-lg');

    rerender(<StarRating rating={4} size='md' />);
    const mediumStar = container.querySelector('span.text-yellow-400');
    expect(mediumStar?.className).toContain('text-xl');

    rerender(<StarRating rating={4} size='lg' />);
    const largeStar = container.querySelector('span.text-yellow-400');
    expect(largeStar?.className).toContain('text-2xl');
  });
});
