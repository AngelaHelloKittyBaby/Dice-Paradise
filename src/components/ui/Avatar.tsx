'use client';

import React from 'react';
import clsx from 'clsx';
import defaultAvatar from '@/assets/images/avatars/default-player.png';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  online?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'avatar',
  size = 'md',
  className,
  online,
}) => {
  const avatarSrc = src || defaultAvatar.src;

  const sizeStyles = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <div className={clsx('relative inline-block', className)}>
      <img
        src={avatarSrc}
        alt={alt}
        className={clsx(
          'rounded-full object-cover bg-gray-100 ring-2 ring-white',
          sizeStyles[size]
        )}
      />
      {online !== undefined && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white',
            online ? 'bg-success-500' : 'bg-gray-400'
          )}
        />
      )}
    </div>
  );
};
