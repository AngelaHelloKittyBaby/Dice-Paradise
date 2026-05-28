export interface GameResultPlayer {
  id: number;
  nickname: string;
  avatar?: string;
  score: number;
  isOwner?: boolean;
  rank: number;
}

export interface PlayerScoreDetail {
  upperScore: number;
  bonusScore: number;
  upperTotal: number;
  lowerScore: number;
  extraReward: number;
  extraBonus: number;
  totalScore: number;
}

export type ResultHighlightIcon = 'yacht' | 'upperBonus' | 'bestRound' | 'straight' | 'fourKind';

export interface ResultHighlight {
  id: string;
  icon: ResultHighlightIcon;
  name: string;
  value: number;
  unit: string;
  status?: string;
}

export interface GameResultData {
  players: GameResultPlayer[];
  playerDetails: Record<number, PlayerScoreDetail>;
  highlights: ResultHighlight[];
  playerHighlights?: Record<number, ResultHighlight[]>;
}

export interface SaveGameResultPayload {
  autoSave: boolean;
}

export interface GameResultActionResponse {
  success: boolean;
  message?: string;
}
