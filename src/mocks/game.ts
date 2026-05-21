import type { GameState, PlayerGameState, RoundState, DiceValue } from '@/types/game';

/** Mock 初始玩家游戏状态 */
export const createMockPlayerGameState = (playerId: string): PlayerGameState => ({
  playerId,
  scores: {},
  upperSubtotal: 0,
  upperBonus: 0,
  upperTotal: 0,
  lowerTotal: 0,
  grandTotal: 0,
  completedCategories: [],
});

/** Mock 初始回合状态 */
export const createMockRoundState = (playerCount: number): RoundState => ({
  roundNumber: 1,
  currentPlayerIndex: 0,
  rollsLeft: 3,
  dice: [1, 1, 1, 1, 1] as DiceValue[],
  locked: [false, false, false, false, false],
  phase: 'waiting',
});

/** Mock 游戏状态 */
export const createMockGameState = (playerIds: string[]): GameState => ({
  gameId: `game-${Date.now()}`,
  players: playerIds.map(createMockPlayerGameState),
  currentRound: createMockRoundState(playerIds.length),
  isStarted: false,
  isEnded: false,
  winner: null,
});

/** Mock 进行中的游戏状态 */
export const mockOngoingGameState: GameState = {
  gameId: 'game-demo',
  players: [
    {
      playerId: 'player-001',
      scores: {
        ones: 3,
        twos: 6,
        threes: 9,
        fours: 16,
        fives: 20,
        sixes: 24,
        threeOfAKind: 18,
        fullHouse: 25,
      },
      upperSubtotal: 78,
      upperBonus: 35,
      upperTotal: 113,
      lowerTotal: 43,
      grandTotal: 156,
      completedCategories: ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'threeOfAKind', 'fullHouse'],
    },
    {
      playerId: 'player-002',
      scores: {
        ones: 4,
        twos: 8,
        threes: 12,
        fours: 12,
        fives: 25,
        yacht: 50,
      },
      upperSubtotal: 61,
      upperBonus: 0,
      upperTotal: 61,
      lowerTotal: 50,
      grandTotal: 111,
      completedCategories: ['ones', 'twos', 'threes', 'fours', 'fives', 'yacht'],
    },
  ],
  currentRound: {
    roundNumber: 9,
    currentPlayerIndex: 0,
    rollsLeft: 2,
    dice: [3, 3, 3, 5, 6] as DiceValue[],
    locked: [true, true, true, false, false],
    phase: 'selecting',
  },
  isStarted: true,
  isEnded: false,
  winner: null,
};
