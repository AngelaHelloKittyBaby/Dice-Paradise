'use client';

import React from 'react';
import clsx from 'clsx';
import type { DiceValue } from '@/types/game';

export interface DiceProps {
  value: DiceValue;
  isLocked: boolean;
  isRolling: boolean;
  onToggle?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const DiceDots: React.FC<{ value: DiceValue }> = ({ value }) => {
  const dotPositions: Record<DiceValue, string[]> = {
    1: ['center'],
    2: ['top-right', 'bottom-left'],
    3: ['top-right', 'center', 'bottom-left'],
    4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
    6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
  };

  const getPosition = (pos: string): string => {
    const positions: Record<string, string> = {
      'top-left': 'top-1.5 left-1.5',
      'top-right': 'top-1.5 right-1.5',
      'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      'middle-left': 'top-1/2 left-1.5 -translate-y-1/2',
      'middle-right': 'top-1/2 right-1.5 -translate-y-1/2',
      'bottom-left': 'bottom-1.5 left-1.5',
      'bottom-right': 'bottom-1.5 right-1.5',
    };
    return positions[pos] || '';
  };

  return (
    <div className="relative w-full h-full">
      {dotPositions[value].map((pos, index) => (
        <div
          key={index}
          className={clsx(
            'absolute w-2 h-2 rounded-full bg-gray-800',
            getPosition(pos)
          )}
        />
      ))}
    </div>
  );
};

export const Dice: React.FC<DiceProps> = ({
  value,
  isLocked,
  isRolling,
  onToggle,
  size = 'md',
  disabled = false,
}) => {
  const sizeStyles = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const dotSizeStyles = {
    sm: 'text-xs',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <button
      onClick={onToggle}
      disabled={disabled || isRolling}
      className={clsx(
        'rounded-xl font-bold transition-all duration-200',
        'flex items-center justify-center',
        'shadow-dice',
        sizeStyles[size],
        dotSizeStyles[size],
        isLocked
          ? 'bg-secondary-100 ring-2 ring-secondary-400'
          : 'bg-white hover:bg-gray-50',
        isRolling && 'animate-dice-roll',
        !disabled && !isRolling && 'hover:scale-105 active:scale-95 cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <DiceDots value={value} />
      {isLocked && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary-500 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </button>
  );
};
