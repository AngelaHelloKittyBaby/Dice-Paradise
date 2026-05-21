import type { Player, PlayerStats, LeaderboardPlayer } from '@/types/player';

/** Mock 当前玩家 */
export const mockCurrentPlayer: Player = {
  id: 'player-001',
  name: '投骰大师',
  avatar: '',
  level: 15,
  exp: 2450,
  coins: 1280,
  gems: 45,
  wins: 128,
  losses: 72,
  createdAt: '2024-01-15T08:00:00Z',
};

/** Mock 玩家统计 */
export const mockPlayerStats: PlayerStats = {
  totalGames: 200,
  wins: 128,
  losses: 72,
  winRate: 64,
  highestScore: 312,
  averageScore: 186,
  yachtCount: 23,
};

/** Mock 其他玩家 */
export const mockOtherPlayers: Player[] = [
  {
    id: 'player-002',
    name: '骰子达人',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
    level: 22,
    exp: 5600,
    coins: 3500,
    gems: 120,
    wins: 256,
    losses: 144,
    createdAt: '2023-06-20T10:30:00Z',
  },
  {
    id: 'player-003',
    name: '幸运之星',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lucky',
    level: 18,
    exp: 3200,
    coins: 2100,
    gems: 78,
    wins: 180,
    losses: 120,
    createdAt: '2023-09-10T14:20:00Z',
  },
  {
    id: 'player-004',
    name: '赌神降临',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Casper',
    level: 28,
    exp: 8900,
    coins: 12000,
    gems: 350,
    wins: 420,
    losses: 180,
    createdAt: '2023-03-01T09:00:00Z',
  },
];

/** Mock 排行榜数据 */
export const mockLeaderboard: LeaderboardPlayer[] = [
  { rank: 1, playerId: 'player-004', playerName: '赌神降临', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Casper', score: 15200, level: 28 },
  { rank: 2, playerId: 'player-005', playerName: '骰王之王', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=King', score: 14500, level: 30 },
  { rank: 3, playerId: 'player-006', playerName: '无敌手', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Hero', score: 13200, level: 25 },
  { rank: 4, playerId: 'player-002', playerName: '骰子达人', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka', score: 12800, level: 22 },
  { rank: 5, playerId: 'player-007', playerName: '幸运儿', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lucky7', score: 11500, level: 20 },
  { rank: 6, playerId: 'player-008', playerName: '掷骰高手', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Master', score: 10800, level: 19 },
  { rank: 7, playerId: 'player-003', playerName: '幸运之星', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lucky', score: 9600, level: 18 },
  { rank: 8, playerId: 'player-001', playerName: '投骰大师', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix', score: 8200, level: 15 },
  { rank: 9, playerId: 'player-009', playerName: '新手玩家', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=New', score: 5400, level: 10 },
  { rank: 10, playerId: 'player-010', playerName: '初来乍到', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Newbie', score: 2100, level: 5 },
];
