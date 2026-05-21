'use client';

import React from 'react';
import clsx from 'clsx';
import { Avatar } from '@/components/ui';
import type { Player } from '@/types/player';

export interface PlayerCardProps {
  player: Player & {
    isCurrentPlayer?: boolean;
    isReady?: boolean;
    isHost?: boolean;
    totalScore?: number;
  };
  showScore?: boolean;
  compact?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  showScore = false,
  compact = false,
}) => {
  if (compact) {
    return (
      <div
        className={clsx(
          'flex items-center gap-2 px-3 py-2 rounded-xl',
          player.isCurrentPlayer && 'bg-primary-50 ring-2 ring-primary-500'
        )}
      >
        <Avatar src={player.avatar} alt={player.name} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 truncate">{player.name}</p>
        </div>
        {showScore && (
          <span className="font-bold text-primary-600">{player.totalScore ?? 0}</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'bg-white rounded-2xl shadow-card p-4 transition-all duration-200',
        player.isCurrentPlayer && 'ring-2 ring-primary-500 shadow-lg'
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar src={player.avatar} alt={player.name} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 truncate">{player.name}</h3>
            {player.isHost && (
              <span className="px-1.5 py-0.5 bg-secondary-100 text-secondary-700 text-xs rounded-md font-medium">
                房主
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">Lv.{player.level}</p>
        </div>
        {showScore && (
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">{player.totalScore ?? 0}</p>
            <p className="text-xs text-gray-400">分数</p>
          </div>
        )}
      </div>

      {player.isReady !== undefined && !player.isHost && (
        <div className="mt-3 flex items-center justify-center">
          <span
            className={clsx(
              'px-3 py-1 rounded-full text-sm font-medium',
              player.isReady
                ? 'bg-success-100 text-success-700'
                : 'bg-gray-100 text-gray-500'
            )}
          >
            {player.isReady ? '已准备' : '未准备'}
          </span>
        </div>
      )}
    </div>
  );
};
