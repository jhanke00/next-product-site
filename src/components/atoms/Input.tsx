import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@utils/cn';

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-gray-300',
        destructive: 'border-red-500',
        success: 'border-green-500',
      },
      inputSize: {
        sm: 'h-8 text-xs px-2',
        md: 'h-10 text-sm px-3',
        lg: 'h-12 text-base px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
    },
  }
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, inputSize, type = 'text', ...props }, ref) => {
    return <input ref={ref} type={type} className={cn(inputVariants({ variant, inputSize, className }))} {...props} />;
  }
);

Input.displayName = 'Input';
