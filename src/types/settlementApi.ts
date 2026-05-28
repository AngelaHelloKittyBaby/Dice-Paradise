import type { ApiGameStatusData, GameStatusSnapshot } from './gameApi';

export interface SettlementPlayerRequest {
  player_id: string | number;
}

export interface RematchRequest {
  player_id: string | number;
}

export interface RematchResponseData {
  newGameId: string;
  gameState: ApiGameStatusData;
}

export interface RematchSnapshot {
  newGameId: string;
  gameState: GameStatusSnapshot;
}

export interface FinalRankingPlayerData {
  rank: number;
  playerId: number;
  username: string;
  avatar: string;
  totalScore: number;
}

export interface FinalRankingResponseData {
  rankingList: FinalRankingPlayerData[];
}

export interface ScoreSummaryResponseData {
  playerId: number;
  upperScore: number;
  upperBonus: number;
  upperSubtotal: number;
  lowerScore: number;
  yahtzeeBonus: number;
  totalScore: number;
}

export interface GameHighlightsResponseData {
  yahtzeeCount: number;
  highestRoundScore: number;
  upperBonusScored: number;
}
