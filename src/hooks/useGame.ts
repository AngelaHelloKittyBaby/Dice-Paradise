import { useCallback, useMemo } from 'react';
import { useGameStore } from '@/stores/gameStore';
import type { ScoreCategory } from '@/types/game';
import type { Player } from '@/types/player';

export function useGame() {
  const store = useGameStore();

  const initGame = useCallback((players: Pick<Player, 'id' | 'name' | 'avatar'>[]) => {
    store.initGame(players);
  }, [store]);

  const roll = useCallback(() => {
    store.roll();
  }, [store]);

  const toggleLock = useCallback((index: number) => {
    store.toggleLock(index);
  }, [store]);

  const selectCategory = useCallback((category: ScoreCategory) => {
    store.selectCategory(category);
  }, [store]);

  const resetGame = useCallback(() => {
    store.resetGame();
  }, [store]);

  const canRoll = useMemo(() => {
    return store.rollsLeft > 0 && !store.isRolling && store.phase !== 'ended';
  }, [store.rollsLeft, store.isRolling, store.phase]);

  const canLock = useMemo(() => {
    return store.rollsLeft < 3 && store.phase !== 'ended';
  }, [store.rollsLeft, store.phase]);

  return {
    // State
    gameId: store.gameId,
    phase: store.phase,
    isStarted: store.isStarted,
    isEnded: store.isEnded,
    players: store.players,
    currentPlayerIndex: store.currentPlayerIndex,
    roundNumber: store.roundNumber,
    rollsLeft: store.rollsLeft,
    dice: store.dice,
    locked: store.locked,
    isRolling: store.isRolling,
    possibleScores: store.possibleScores,

    // Computed
    canRoll,
    canLock,
    currentPlayer: store.getCurrentPlayer(),
    winner: store.getWinner(),

    // Actions
    initGame,
    roll,
    toggleLock,
    selectCategory,
    resetGame,
  };
}
