import type { DiceValue, ScoreCategory } from './game';

export type ApiGameMode = 'local' | 'ai' | 'online';

export interface CreateGameRequest {
  game_mode: ApiGameMode;
  player_names: string[];
}

export interface CreateGameData {
  gameId: string;
  playerId: string;
}

export interface RollDiceRequest {
  player_id: string;
  locked_dice?: boolean[];
}

export interface RollDiceData {
  dice: number[];
  diceLocked: boolean[];
  rollsLeft: number;
}

export interface RollDiceSnapshot {
  dice: DiceValue[];
  diceLocked: boolean[];
  rollsLeft: number;
}

export interface ResetDiceRequest {
  player_id: string;
}

export interface ToggleDiceLockRequest {
  player_id: string;
  dice_index: number;
}

export interface ToggleDiceLockData {
  diceLocked: boolean[];
}

export interface ToggleDiceLockSnapshot {
  diceLocked: boolean[];
}

export type ApiScoreCategory = Exclude<ScoreCategory, 'yacht'> | 'yahtzee';
export type ApiGameStatus = 'waiting' | 'playing' | 'finished' | string;

export interface SubmitScoreRequest {
  player_id: string;
  category: ScoreCategory;
}

export type ApiScoreMap = Record<ApiScoreCategory, number | null>;

export interface ApiGamePlayer {
  playerId: string;
  name: string;
  isAi: boolean;
  scores: ApiScoreMap;
  totalScore: number;
}

export interface ApiGameStatusData {
  gameId: string;
  gameMode: ApiGameMode;
  currentPlayer: string | null;
  players: ApiGamePlayer[];
  dice: number[];
  diceLocked: boolean[];
  rollsLeft: number;
  status: ApiGameStatus;
  createdAt?: string | null;
  finishedAt?: string | null;
}

export interface ApiScoreSubmitData {
  submit_success: boolean;
  player_id: number;
  score_item_id: number;
  score_value: number;
  total_score: number;
  upper_score: number;
  lower_score: number;
  bonus_score: number;
  game_status: number;
  next_player_id: number | null;
}

export interface ScoreSubmitSnapshot {
  submitSuccess: boolean;
  playerId: string;
  scoreItemId: number;
  category: ScoreCategory;
  scoreValue: number;
  upperScore: number;
  lowerScore: number;
  bonusScore: number;
  totalScore: number;
  gameStatus: number | string;
  nextPlayerId: string | null;
  isGameFinished: boolean;
}

export interface QuitGameRequest {
  player_id: string;
}

export interface GamePlayerSnapshot {
  playerId: string;
  name: string;
  isAi: boolean;
  scores: Partial<Record<ScoreCategory, number>>;
  totalScore: number;
}

export interface GameStatusSnapshot {
  gameId: string;
  gameMode: ApiGameMode;
  currentPlayer: string | null;
  players: GamePlayerSnapshot[];
  dice: DiceValue[];
  diceLocked: boolean[];
  rollsLeft: number;
  status: ApiGameStatus;
  createdAt: string | null;
  finishedAt: string | null;
}
