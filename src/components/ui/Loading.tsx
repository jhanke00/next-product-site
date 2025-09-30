import React from 'react';
import { cn } from '@/src/utils/common/classNames';

// Skeleton components for loading states
interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, width, height }) => {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return <div className={cn('animate-pulse bg-gray-200 rounded', className)} style={style} />;
};
