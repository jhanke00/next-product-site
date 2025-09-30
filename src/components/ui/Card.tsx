import React from 'react';
import { cn } from '@/src/utils/common/classNames';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', padding = 'md', hover = false, interactive = false, className, ...props }, ref) => {
    const baseClasses = ['bg-white rounded-lg overflow-hidden', 'transition-all duration-200 ease-in-out'];

    const variantClasses = {
      default: ['border border-gray-200'],
      outlined: ['border-2 border-gray-200'],
      elevated: ['shadow-lg border border-gray-100'],
    };

    const paddingClasses = {
      none: [],
      sm: ['p-4'],
      md: ['p-6'],
      lg: ['p-8'],
    };

    const interactiveClasses = [
      'cursor-pointer',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      'active:scale-[0.98]',
    ];

    const hoverClasses = ['hover:shadow-md hover:border-gray-300', 'hover:-translate-y-0.5'];

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      paddingClasses[padding],
      hover && hoverClasses,
      interactive && interactiveClasses,
      className
    );

    return (
      <div
        ref={ref}
        className={classes}
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card subcomponents
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, title, description, action, className, ...props }, ref) => {
    const classes = cn('flex items-start justify-between space-y-1.5', className);

    return (
      <div ref={ref} className={classes} {...props}>
        <div className='space-y-1.5'>
          {title && <h3 className='text-lg font-semibold leading-none tracking-tight'>{title}</h3>}
          {description && <p className='text-sm text-gray-600'>{description}</p>}
          {children}
        </div>
        {action && <div className='flex-shrink-0'>{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({ children, className, ...props }, ref) => {
  const classes = cn('space-y-3', className);

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: 'start' | 'center' | 'end' | 'between';
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, justify = 'start', className, ...props }, ref) => {
    const justifyClasses = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
    };

    const classes = cn('flex items-center pt-4 space-x-2', justifyClasses[justify], className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
