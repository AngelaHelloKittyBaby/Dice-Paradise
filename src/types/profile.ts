export type ProfilePanelType = 'overview' | 'achievement' | 'history';

export interface ProfileUser {
  name: string;
  vip: string;
  uid: string;
  level: number;
  exp: number;
  nextLevelExp: number;
  signature: string;
  avatar: string;
  stars: number;
}

export interface UserOverview {
  totalGames: number;
  totalWins: number;
  winRate: number;
  highestStreak: number;
  diceCount: number;
  starCount: number;
  roleCount: number;
  diceUnlockCount: number;
}

export type AchievementIconKey =
  | 'trophy'
  | 'dice'
  | 'star'
  | 'target'
  | 'crown'
  | 'flame'
  | 'gem'
  | 'shield'
  | 'castle'
  | 'sparkles'
  | 'rocket'
  | 'medal';

export interface AchievementItem {
  id: number;
  name: string;
  description: string;
  icon: AchievementIconKey;
  unlocked: boolean;
  claimable: boolean;
  progress: number;
  target: number;
}

export type MatchResult = '胜利' | '失败';

export interface MatchHistoryRecord {
  id: number;
  mode: string;
  score: number;
  result: MatchResult;
  players: number;
  time: string;
}
