import React from 'react';
import { cn } from '@/src/utils/common/classNames';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'md', className, ...props }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center font-medium rounded-full',
      'whitespace-nowrap select-none',
    ];

    const variantClasses = {
      default: ['bg-bg-muted text-text-primary'],
      success: ['bg-green-100 text-green-800'],
      warning: ['bg-yellow-100 text-yellow-800'],
      danger: ['bg-red-100 text-red-800'],
      info: ['bg-blue-100 text-blue-800'],
      outline: ['border border-gray-300 text-text-secondary bg-transparent'],
    };

    const sizeClasses = {
      sm: ['px-2 py-0.5 text-xs'],
      md: ['px-2.5 py-1 text-xs'],
      lg: ['px-3 py-1.5 text-sm'],
    };

    const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
