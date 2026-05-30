'use client';

import { useEffect, useRef } from 'react';
import { buildGameWebSocketUrl, parseGameSocketStatusMessage } from '@/modules/game/gameSocket';
import type { GameStatusSnapshot } from '@/types/gameApi';

interface UseGameSocketOptions {
  gameId: string | null;
  playerId: string | null;
  enabled?: boolean;
  onGameStatus: (status: GameStatusSnapshot) => void;
}

export function useGameSocket({ gameId, playerId, enabled = true, onGameStatus }: UseGameSocketOptions) {
  const statusHandlerRef = useRef(onGameStatus);

  useEffect(() => {
    statusHandlerRef.current = onGameStatus;
  }, [onGameStatus]);

  useEffect(() => {
    if (!enabled || !gameId || !playerId) return undefined;

    const socket = new WebSocket(buildGameWebSocketUrl(gameId, playerId));

    socket.onmessage = event => {
      if (typeof event.data !== 'string') return;

      const status = parseGameSocketStatusMessage(event.data);
      if (status) statusHandlerRef.current(status);
    };

    socket.onerror = error => {
      console.error('Game WebSocket error', error);
    };

    return () => {
      socket.close();
    };
  }, [enabled, gameId, playerId]);
}

