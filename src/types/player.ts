/** 玩家信息 */
export interface Player {
  id: string;
  name: string;
  avatar: string;
  level: number;
  exp: number;
  coins: number;
  gems: number;
  wins: number;
  losses: number;
  createdAt: string;
}

/** 玩家统计数据 */
export interface PlayerStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  highestScore: number;
  averageScore: number;
  yachtCount: number;
}

/** 玩家设置 */
export interface PlayerSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  musicVolume: number;
  language: 'zh' | 'en';
  theme: 'light' | 'dark' | 'auto';
}

/** 排行榜玩家 */
export interface LeaderboardPlayer {
  rank: number;
  playerId: string;
  playerName: string;
  avatar: string;
  score: number;
  level: number;
}
