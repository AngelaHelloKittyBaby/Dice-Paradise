'use client';

import React from 'react';
import { PlayerCard } from './PlayerCard';
import type { Player } from '@/types/player';

export interface PlayerListProps {
  players: (Player & {
    isCurrentPlayer?: boolean;
    isReady?: boolean;
    isHost?: boolean;
    totalScore?: number;
  })[];
  showScore?: boolean;
  compact?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export const PlayerList: React.FC<PlayerListProps> = ({
  players,
  showScore = false,
  compact = false,
  layout = 'vertical',
}) => {
  if (layout === 'horizontal') {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2">
        {players.map((player) => (
          <div key={player.id} className="flex-shrink-0">
            <PlayerCard
              player={player}
              showScore={showScore}
              compact={compact}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {players.map((player) => (
        <PlayerCard
          key={player.id}
          player={player}
          showScore={showScore}
          compact={compact}
        />
      ))}
    </div>
  );
};
