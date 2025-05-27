import * as React from 'react';
import { cn } from '@/src/utils';

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn('animate-pulse rounded-md bg-muted', className)} ref={ref} {...props} />;
  }
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };
