import React from 'react';
import { cn } from '@/src/utils/common/classNames';

export interface ProgressBarProps {
  value: number; // Progress value (0-100)
  max?: number; // Maximum value (default: 100)
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  className,
  animated = false,
}) => {
  // Ensure value is within bounds
  const normalizedValue = Math.max(0, Math.min(value, max));
  const percentage = (normalizedValue / max) * 100;

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
  };

  const containerClasses = cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size], className);

  const progressClasses = cn(
    'h-full rounded-full transition-all duration-300 ease-out',
    variantClasses[variant],
    animated && 'animate-pulse'
  );

  const displayValue = label || `${Math.round(percentage)}%`;

  return (
    <div className='w-full'>
      {showLabel && (
        <div className='flex justify-between items-center mb-1'>
          <span className='text-sm text-gray-600'>Progress</span>
          <span className='text-sm font-medium text-gray-900'>{displayValue}</span>
        </div>
      )}

      <div
        className={containerClasses}
        role='progressbar'
        aria-valuenow={normalizedValue}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div className={progressClasses} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

// Circular Progress variant
interface CircularProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  thickness?: number;
  showLabel?: boolean;
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  thickness = 4,
  showLabel = false,
  className,
}) => {
  const normalizedValue = Math.max(0, Math.min(value, max));
  const percentage = (normalizedValue / max) * 100;

  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  const colorMap = {
    default: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
  };

  const size_px = sizeMap[size];
  const radius = (size_px - thickness * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size_px} height={size_px} className='transform -rotate-90'>
        {/* Background circle */}
        <circle
          cx={size_px / 2}
          cy={size_px / 2}
          r={radius}
          stroke='#E5E7EB'
          strokeWidth={thickness}
          fill='transparent'
        />

        {/* Progress circle */}
        <circle
          cx={size_px / 2}
          cy={size_px / 2}
          r={radius}
          stroke={colorMap[variant]}
          strokeWidth={thickness}
          fill='transparent'
          strokeLinecap='round'
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className='transition-all duration-300 ease-out'
        />
      </svg>

      {showLabel && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <span className='text-xs font-medium text-gray-900'>{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  );
};

export { ProgressBar, CircularProgress };
