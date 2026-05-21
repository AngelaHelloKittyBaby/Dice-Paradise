'use client';

import React from 'react';
import { Dice } from './Dice';
import type { DiceValue } from '@/types/game';

export interface DiceBoardProps {
  dice: DiceValue[];
  locked: boolean[];
  isRolling: boolean;
  onToggleLock: (index: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const DiceBoard: React.FC<DiceBoardProps> = ({
  dice,
  locked,
  isRolling,
  onToggleLock,
  disabled = false,
  size = 'md',
}) => {
  return (
    <div className="flex items-center justify-center gap-3">
      {dice.map((value, index) => (
        <Dice
          key={index}
          value={value}
          isLocked={locked[index]}
          isRolling={isRolling}
          onToggle={() => onToggleLock(index)}
          disabled={disabled}
          size={size}
        />
      ))}
    </div>
  );
};
