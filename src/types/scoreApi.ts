import type { ScoreCategory } from './game';

export interface ScorePanelPlayerData {
  playerId: string | number;
  username: string;
  avatar: string;
  playerOrder: number;
}

export interface ScorePanelData {
  gameId: string;
  players: ScorePanelPlayerData[];
}

export interface LockedScoreItemData {
  itemId: number;
  scoreValue: number;
}

export interface ScoreLockStatusData {
  playerId: string | number;
  lockedItems?: LockedScoreItemData[];
  unlockedItems?: number[];
}

export interface PossibleScoresData {
  possibleScores: Record<string, number | null>;
}

export interface SubmitScoreItemRequest {
  player_id: string | number;
  category: ScoreCategory;
}

export interface SubmitScoreItemData {
  category?: string;
  score?: number;
  upperScore?: number;
  lowerScore?: number;
  bonusScore?: number;
  totalScore?: number;
  gameState?: {
    status?: number | string;
  };
  nextPlayer?: string | null;
  isGameFinished?: boolean;
  submit_success?: boolean;
  player_id?: string | number;
  score_item_id?: number;
  score_value?: number;
  total_score?: number;
  upper_score?: number;
  lower_score?: number;
  bonus_score?: number;
  game_status?: number | string;
  next_player_id?: string | number | null;
}

export interface ScorePanelPlayerSnapshot {
  playerId: string;
  username: string;
  avatar: string;
  playerOrder: number;
}

export interface LockedScoreItemSnapshot {
  itemId: number;
  category: ScoreCategory;
  scoreValue: number;
}

export interface ScoreLockStatusSnapshot {
  playerId: string;
  lockedItems: LockedScoreItemSnapshot[];
  unlockedItemIds: number[];
  unlockedCategories: ScoreCategory[];
  completedCategories: ScoreCategory[];
  scores: Partial<Record<ScoreCategory, number>>;
}

export type PossibleScoreSnapshot = Partial<Record<ScoreCategory, number | null>>;

export interface SubmitScoreItemSnapshot {
  submitSuccess: boolean;
  playerId: string;
  scoreItemId: number;
  category: ScoreCategory;
  scoreValue: number;
  totalScore: number;
  upperScore: number;
  lowerScore: number;
  bonusScore: number;
  gameStatus: number | string;
  nextPlayerId: string | null;
  isGameFinished: boolean;
}
