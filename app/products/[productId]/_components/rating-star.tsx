import { Star } from 'lucide-react';
import { cn } from '@/src/utils';
import { ComponentProps } from 'react';

interface RatingStarProps extends ComponentProps<typeof Star> {
  isActive?: boolean;
}

export const RatingStar = ({ isActive = false, className, ...props }: RatingStarProps) => {
  return (
    <Star
      className={cn('h-4 w-4 text-gray-300', className, {
        'text-yellow-400': isActive,
      })}
      {...props}
    />
  );
};
