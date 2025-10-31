import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'border-transparent bg-gray-200 text-gray-800 hover:bg-gray-300',
        outline: 'text-gray-700 border border-gray-300 bg-transparent hover:bg-gray-100',
        destructive: 'border-transparent bg-red-600 text-white hover:bg-red-700',
        success: 'border-transparent bg-green-600 text-white hover:bg-green-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant, ...props }, ref) => {
  return <div ref={ref} className={cn(badgeVariants({ variant, className }))} {...props} />;
});

Badge.displayName = 'Badge';
