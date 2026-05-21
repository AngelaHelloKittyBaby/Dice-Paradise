'use client';

import React from 'react';
import clsx from 'clsx';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  fullScreen = false,
}) => {
  const sizeStyles = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <div className={clsx(
          'rounded-full border-4 border-gray-200',
          sizeStyles[size]
        )} />
        <div
          className={clsx(
            'absolute top-0 left-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin',
            sizeStyles[size]
          )}
        />
      </div>
      {text && (
        <p className="text-gray-500 text-sm animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        {content}
      </div>
    );
  }

  return content;
};
