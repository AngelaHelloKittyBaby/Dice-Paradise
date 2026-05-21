/** 骰子点数类型 */
export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

/** 计分类别 */
export type ScoreCategory =
  | 'ones'
  | 'twos'
  | 'threes'
  | 'fours'
  | 'fives'
  | 'sixes'
  | 'threeOfAKind'
  | 'fourOfAKind'
  | 'fullHouse'
  | 'smallStraight'
  | 'largeStraight'
  | 'yacht'
  | 'chance';

/** 计分类别分组 */
export type ScoreSection = 'upper' | 'lower';

/** 游戏阶段 */
export type GamePhase = 'waiting' | 'rolling' | 'selecting' | 'ended';

/** 骰子状态 */
export interface DiceState {
  value: DiceValue;
  isLocked: boolean;
  isRolling: boolean;
}

/** 计分项 */
export interface ScoreItem {
  category: ScoreCategory;
  name: string;
  nameZh: string;
  score: number | null;
  isFilled: boolean;
  possibleScore?: number;
}

/** 玩家游戏状态 */
export interface PlayerGameState {
  playerId: string;
  scores: Partial<Record<ScoreCategory, number>>;
  upperSubtotal: number;
  upperBonus: number;
  upperTotal: number;
  lowerTotal: number;
  grandTotal: number;
  completedCategories: ScoreCategory[];
}

/** 回合状态 */
export interface RoundState {
  roundNumber: number;
  currentPlayerIndex: number;
  rollsLeft: number;
  dice: DiceValue[];
  locked: boolean[];
  phase: GamePhase;
}

/** 游戏状态 */
export interface GameState {
  gameId: string;
  players: PlayerGameState[];
  currentRound: RoundState;
  isStarted: boolean;
  isEnded: boolean;
  winner: string | null;
}
