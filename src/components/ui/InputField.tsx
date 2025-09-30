import React, { forwardRef } from 'react';
import { cn } from '@/src/utils/common/classNames';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled';
  fullWidth?: boolean;
  isRequired?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      variant = 'default',
      fullWidth = false,
      isRequired = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = [
      'block px-3 py-2 text-sm border rounded-lg',
      'transition-colors duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    const variantClasses = {
      default: ['bg-white border-gray-300', 'hover:border-gray-400', 'placeholder-gray-400'],
      filled: [
        'bg-gray-50 border-gray-200',
        'hover:bg-gray-100 hover:border-gray-300',
        'focus:bg-white',
        'placeholder-gray-500',
      ],
    };

    const errorClasses = error ? ['border-red-300 focus:ring-red-500', 'text-red-900 placeholder-red-300'] : [];

    const inputClasses = cn(
      baseClasses,
      variantClasses[variant],
      errorClasses,
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      fullWidth ? 'w-full' : 'w-auto',
      className
    );

    return (
      <div className={cn('space-y-1', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className='block text-sm font-medium text-gray-700'>
            {label}
            {isRequired && <span className='text-red-500 ml-1'>*</span>}
          </label>
        )}

        {/* Input container */}
        <div className='relative'>
          {/* Left icon */}
          {leftIcon && (
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              <span className='text-gray-400 w-5 h-5'>{leftIcon}</span>
            </div>
          )}

          {/* Input */}
          <input ref={ref} id={inputId} className={inputClasses} {...props} />

          {/* Right icon */}
          {rightIcon && (
            <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
              <span className='text-gray-400 w-5 h-5'>{rightIcon}</span>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p className='text-sm text-red-600' role='alert'>
            {error}
          </p>
        )}

        {/* Hint */}
        {hint && !error && <p className='text-sm text-gray-500'>{hint}</p>}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

// Textarea variant
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: 'default' | 'filled';
  fullWidth?: boolean;
  isRequired?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      hint,
      variant = 'default',
      fullWidth = false,
      isRequired = false,
      resize = 'vertical',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const baseClasses = [
      'block px-3 py-2 text-sm border rounded-lg',
      'transition-colors duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    const variantClasses = {
      default: ['bg-white border-gray-300', 'hover:border-gray-400', 'placeholder-gray-400'],
      filled: [
        'bg-gray-50 border-gray-200',
        'hover:bg-gray-100 hover:border-gray-300',
        'focus:bg-white',
        'placeholder-gray-500',
      ],
    };

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    const errorClasses = error ? ['border-red-300 focus:ring-red-500', 'text-red-900 placeholder-red-300'] : [];

    const textareaClasses = cn(
      baseClasses,
      variantClasses[variant],
      errorClasses,
      resizeClasses[resize],
      fullWidth ? 'w-full' : 'w-auto',
      className
    );

    return (
      <div className={cn('space-y-1', fullWidth && 'w-full')}>
        {/* Label */}
        {label && (
          <label htmlFor={textareaId} className='block text-sm font-medium text-gray-700'>
            {label}
            {isRequired && <span className='text-red-500 ml-1'>*</span>}
          </label>
        )}

        {/* Textarea */}
        <textarea ref={ref} id={textareaId} className={textareaClasses} {...props} />

        {/* Error message */}
        {error && (
          <p className='text-sm text-red-600' role='alert'>
            {error}
          </p>
        )}

        {/* Hint */}
        {hint && !error && <p className='text-sm text-gray-500'>{hint}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export { InputField, TextArea };
