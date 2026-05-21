'use client';

import React from 'react';
import clsx from 'clsx';

export interface TurnIndicatorProps {
  roundNumber: number;
  totalRounds: number;
  currentPlayerName: string;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({
  roundNumber,
  totalRounds,
  currentPlayerName,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 py-2 px-4 bg-primary-50 rounded-xl">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">回合</span>
        <span className="font-bold text-primary-600">
          {roundNumber}/{totalRounds}
        </span>
      </div>
      <div className="w-px h-4 bg-gray-300" />
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">当前</span>
        <span className="font-bold text-gray-900">{currentPlayerName}</span>
      </div>
    </div>
  );
};
