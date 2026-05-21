'use client';

import React from 'react';
import { Button } from '@/components/ui';

export interface GameControlsProps {
  rollsLeft: number;
  canRoll: boolean;
  onRoll: () => void;
  isRolling?: boolean;
  onQuit?: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  rollsLeft,
  canRoll,
  onRoll,
  isRolling = false,
  onQuit,
}) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        onClick={onRoll}
        disabled={!canRoll || isRolling}
        loading={isRolling}
        size="lg"
        className="min-w-[160px]"
      >
        {isRolling ? '投掷中...' : `投掷骰子 (${rollsLeft})`}
      </Button>

      {onQuit && (
        <Button
          onClick={onQuit}
          variant="ghost"
          size="sm"
          className="text-gray-500"
        >
          退出游戏
        </Button>
      )}
    </div>
  );
};
