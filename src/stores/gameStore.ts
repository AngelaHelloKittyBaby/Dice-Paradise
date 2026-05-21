import { create } from 'zustand';
import type { DiceValue, ScoreCategory, GamePhase } from '@/types/game';
import type { Player } from '@/types/player';
import { rollDice, generateInitialDice, generateInitialLocked } from '@/utils/diceUtils';
import { calculateScore, calculateGrandTotal, getPossibleScores } from '@/utils/scoreCalculator';
import { MAX_ROLLS_PER_TURN, TOTAL_ROUNDS } from '@/constants/gameRules';

interface GamePlayer {
  id: string;
  name: string;
  avatar: string;
  scores: Partial<Record<ScoreCategory, number>>;
  completedCategories: ScoreCategory[];
  totalScore: number;
}

interface GameState {
  // Game Info
  gameId: string | null;
  phase: GamePhase;
  isStarted: boolean;
  isEnded: boolean;

  // Players
  players: GamePlayer[];
  currentPlayerIndex: number;

  // Round
  roundNumber: number;
  rollsLeft: number;
  dice: DiceValue[];
  locked: boolean[];
  isRolling: boolean;

  // Computed
  possibleScores: Partial<Record<ScoreCategory, number>>;
}

interface GameActions {
  // Setup
  initGame: (players: Pick<Player, 'id' | 'name' | 'avatar'>[]) => void;
  resetGame: () => void;

  // Dice Actions
  roll: () => void;
  toggleLock: (index: number) => void;

  // Score Actions
  selectCategory: (category: ScoreCategory) => void;

  // Getters
  getCurrentPlayer: () => GamePlayer | undefined;
  getWinner: () => GamePlayer | undefined;
}

type GameStore = GameState & GameActions;

const initialState: GameState = {
  gameId: null,
  phase: 'waiting',
  isStarted: false,
  isEnded: false,
  players: [],
  currentPlayerIndex: 0,
  roundNumber: 1,
  rollsLeft: MAX_ROLLS_PER_TURN,
  dice: generateInitialDice(),
  locked: generateInitialLocked(),
  isRolling: false,
  possibleScores: {},
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  initGame: (players) => {
    const gamePlayers: GamePlayer[] = players.map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      scores: {},
      completedCategories: [],
      totalScore: 0,
    }));

    set({
      gameId: `game-${Date.now()}`,
      phase: 'waiting',
      isStarted: true,
      isEnded: false,
      players: gamePlayers,
      currentPlayerIndex: 0,
      roundNumber: 1,
      rollsLeft: MAX_ROLLS_PER_TURN,
      dice: generateInitialDice(),
      locked: generateInitialLocked(),
      possibleScores: {},
    });
  },

  resetGame: () => set(initialState),

  roll: () => {
    const { rollsLeft, dice, locked, isRolling, phase } = get();
    if (rollsLeft <= 0 || isRolling || phase === 'ended') return;

    // Start rolling animation
    set({ isRolling: true, phase: 'rolling' });

    // Simulate roll duration
    setTimeout(() => {
      const newDice = rollDice(dice, locked);
      const newRollsLeft = rollsLeft - 1;

      set({
        dice: newDice,
        rollsLeft: newRollsLeft,
        isRolling: false,
        phase: 'selecting',
        possibleScores: getPossibleScores(newDice, get().players[get().currentPlayerIndex].completedCategories),
      });
    }, 600);
  },

  toggleLock: (index) => {
    const { locked, rollsLeft, phase } = get();
    if (rollsLeft >= MAX_ROLLS_PER_TURN || phase === 'ended') return;

    const newLocked = [...locked];
    newLocked[index] = !newLocked[index];
    set({ locked: newLocked });
  },

  selectCategory: (category) => {
    const { players, currentPlayerIndex, dice, roundNumber } = get();
    const currentPlayer = players[currentPlayerIndex];

    if (!currentPlayer || currentPlayer.completedCategories.includes(category)) return;

    const score = calculateScore(dice, category);
    const newScores = { ...currentPlayer.scores, [category]: score };
    const newCompletedCategories = [...currentPlayer.completedCategories, category];
    const newTotalScore = calculateGrandTotal(newScores);

    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex] = {
      ...currentPlayer,
      scores: newScores,
      completedCategories: newCompletedCategories,
      totalScore: newTotalScore,
    };

    // Check if game ended
    const allCategoriesFilled = updatedPlayers.every(
      (p) => p.completedCategories.length >= 13
    );

    if (allCategoriesFilled) {
      set({
        players: updatedPlayers,
        phase: 'ended',
        isEnded: true,
      });
      return;
    }

    // Next turn
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const newRoundNumber = nextPlayerIndex === 0 ? roundNumber + 1 : roundNumber;

    set({
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
      roundNumber: newRoundNumber,
      rollsLeft: MAX_ROLLS_PER_TURN,
      dice: generateInitialDice(),
      locked: generateInitialLocked(),
      phase: 'waiting',
      possibleScores: {},
    });
  },

  getCurrentPlayer: () => {
    const { players, currentPlayerIndex } = get();
    return players[currentPlayerIndex];
  },

  getWinner: () => {
    const { players, isEnded } = get();
    if (!isEnded) return undefined;
    return players.reduce((max, p) => (p.totalScore > max.totalScore ? p : max), players[0]);
  },
}));
