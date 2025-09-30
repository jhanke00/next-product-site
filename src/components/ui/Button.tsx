import React, { forwardRef } from 'react';
import { cn } from '@/src/utils/common/classNames';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center font-medium rounded-lg',
      'transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'select-none',
    ];

    const variantClasses = {
      primary: [
        'bg-primary text-white hover:opacity-90 active:opacity-80',
        'focus:ring-blue-500',
        'shadow-sm hover:shadow-md',
      ],
      secondary: [
        'bg-bg-muted text-text-primary hover:bg-gray-200 active:bg-gray-300',
        'focus:ring-gray-500',
        'border border-gray-300',
      ],
      outline: [
        'bg-transparent text-primary hover:bg-blue-50 active:bg-blue-100',
        'focus:ring-blue-500',
        'border-2 border-primary hover:border-blue-700',
      ],
      ghost: ['bg-transparent text-text-secondary hover:bg-bg-muted active:bg-gray-200', 'focus:ring-gray-500'],
      danger: [
        'bg-error text-white hover:opacity-90 active:opacity-80',
        'focus:ring-red-500',
        'shadow-sm hover:shadow-md',
      ],
    };

    const sizeClasses = {
      sm: ['px-3 py-1.5 text-sm min-h-[32px]', 'gap-1'],
      md: ['px-4 py-2 text-sm min-h-[40px]', 'gap-2'],
      lg: ['px-6 py-3 text-base min-h-[48px]', 'gap-2'],
      xl: ['px-8 py-4 text-lg min-h-[56px]', 'gap-3'],
    };

    const iconSizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
    };

    const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size][0], fullWidth && 'w-full', className);

    const contentClasses = cn('flex items-center', sizeClasses[size][1], isLoading && 'opacity-0');

    return (
      <button ref={ref} className={classes} disabled={disabled || isLoading} {...props}>
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <svg className={cn('animate-spin', iconSizeClasses[size])} fill='none' viewBox='0 0 24 24'>
              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
              <path
                className='opacity-75'
                fill='currentColor'
                d='m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
              />
            </svg>
          </div>
        )}

        <span className={contentClasses}>
          {leftIcon && <span className={cn('flex-shrink-0', iconSizeClasses[size])}>{leftIcon}</span>}

          {children}

          {rightIcon && <span className={cn('flex-shrink-0', iconSizeClasses[size])}>{rightIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
