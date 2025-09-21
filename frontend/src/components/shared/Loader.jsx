import React from 'react';
import { cn } from '@/lib/utils';

const Loader = ({ size = 'default', className, text }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    default: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div
        className={cn(
          'animate-spin rounded-full border-t-transparent border-blue-600',
          sizeClasses[size],
          className
        )}
      />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
};

// Full page loader
export const PageLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader size="lg" text={text} />
    </div>
  );
};

// Inline loader for components
export const InlineLoader = ({ text, size = 'default' }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader size={size} text={text} />
    </div>
  );
};

export default Loader;