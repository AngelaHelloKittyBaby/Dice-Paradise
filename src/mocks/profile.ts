import defaultAvatar from '@/assets/images/avatars/default-player.png';
import type { AchievementItem, MatchHistoryRecord, ProfileUser, UserOverview } from '@/types/profile';

export const mockProfileUser: ProfileUser = {
  name: '乐乐玩家',
  vip: 'VIP4',
  uid: '12345678',
  level: 28,
  exp: 12560,
  nextLevelExp: 23600,
  signature: '快乐投骰，开心每一天！',
  avatar: defaultAvatar.src,
  stars: 23560,
};

export const mockUserOverview: UserOverview = {
  totalGames: 1256,
  totalWins: 856,
  winRate: 68.2,
  highestStreak: 12,
  diceCount: 15680,
  starCount: 23560,
  roleCount: 18,
  diceUnlockCount: 24,
};

export const mockAchievements: AchievementItem[] = [
  { id: 1, name: '初出茅庐', description: '完成第一局投骰', icon: 'medal', unlocked: true, claimable: false, progress: 1, target: 1 },
  { id: 2, name: '小有成就', description: '累计胜利 10 局', icon: 'dice', unlocked: true, claimable: false, progress: 10, target: 10 },
  { id: 3, name: '胜场高手', description: '累计胜利 100 局', icon: 'trophy', unlocked: true, claimable: true, progress: 100, target: 100 },
  { id: 4, name: '连胜达人', description: '获得 8 连胜', icon: 'target', unlocked: false, claimable: false, progress: 6, target: 8 },
  { id: 5, name: '星星收集者', description: '收集 20000 星星', icon: 'star', unlocked: true, claimable: true, progress: 23560, target: 20000 },
  { id: 6, name: '骰子大师', description: '累计投骰 10000 次', icon: 'dice', unlocked: true, claimable: false, progress: 15680, target: 10000 },
  { id: 7, name: '财富赢家', description: '宝箱奖励达到 30 次', icon: 'gem', unlocked: true, claimable: false, progress: 30, target: 30 },
  { id: 8, name: '乐园之星', description: '达到 Lv.30', icon: 'crown', unlocked: false, claimable: false, progress: 28, target: 30 },
  { id: 9, name: '快艇传说', description: '投出 20 次快艇', icon: 'rocket', unlocked: false, claimable: false, progress: 11, target: 20 },
  { id: 10, name: '幸运火花', description: '单局获得 150 分', icon: 'flame', unlocked: true, claimable: true, progress: 150, target: 150 },
  { id: 11, name: '守护骑士', description: '完成 50 次四排', icon: 'shield', unlocked: false, claimable: false, progress: 33, target: 50 },
  { id: 12, name: '城堡来客', description: '参与活动 7 天', icon: 'castle', unlocked: true, claimable: false, progress: 7, target: 7 },
  { id: 13, name: '浪花冠军', description: '获得排行榜前 10', icon: 'trophy', unlocked: false, claimable: false, progress: 18, target: 10 },
  { id: 14, name: '蓝海旅人', description: '登录 30 天', icon: 'sparkles', unlocked: true, claimable: false, progress: 30, target: 30 },
  { id: 15, name: '精准判断', description: '连续 5 回合最佳计分', icon: 'target', unlocked: false, claimable: false, progress: 3, target: 5 },
  { id: 16, name: '闪耀新星', description: '完成 100 个任务', icon: 'star', unlocked: false, claimable: false, progress: 68, target: 100 },
  { id: 17, name: '派对常客', description: '加入 20 个房间', icon: 'medal', unlocked: true, claimable: false, progress: 20, target: 20 },
  { id: 18, name: '好运爆棚', description: '单局投出 4 次高分组合', icon: 'flame', unlocked: false, claimable: false, progress: 2, target: 4 },
  { id: 19, name: '收藏达人', description: '解锁 20 个骰子', icon: 'gem', unlocked: true, claimable: true, progress: 24, target: 20 },
  { id: 20, name: '皇家玩家', description: '达到 VIP4', icon: 'crown', unlocked: true, claimable: false, progress: 4, target: 4 },
  { id: 21, name: '破浪船长', description: '四排胜利 60 局', icon: 'rocket', unlocked: false, claimable: false, progress: 42, target: 60 },
  { id: 22, name: '不败之盾', description: '一日内胜利 8 局', icon: 'shield', unlocked: false, claimable: false, progress: 5, target: 8 },
  { id: 23, name: '神奇骰面', description: '解锁隐藏骰子', icon: 'dice', unlocked: false, claimable: false, progress: 0, target: 1 },
  { id: 24, name: '乐园传说', description: '完成全部高级成就', icon: 'castle', unlocked: false, claimable: false, progress: 11, target: 24 },
];

export const mockMatchHistory: MatchHistoryRecord[] = [
  { id: 1, mode: '四排', score: 125, result: '胜利', players: 4, time: '2026-05-18 14:22' },
  { id: 2, mode: '单人', score: 98, result: '失败', players: 1, time: '2026-05-18 15:10' },
  { id: 3, mode: '二排', score: 142, result: '胜利', players: 2, time: '2026-05-18 16:40' },
  { id: 4, mode: '三排', score: 116, result: '胜利', players: 3, time: '2026-05-19 10:26' },
  { id: 5, mode: '四排', score: 87, result: '失败', players: 4, time: '2026-05-19 21:08' },
  { id: 6, mode: '单人', score: 151, result: '胜利', players: 1, time: '2026-05-20 09:42' },
];

export async function getProfileUser(): Promise<ProfileUser> {
  return mockProfileUser;
}

export async function getUserOverview(): Promise<UserOverview> {
  return mockUserOverview;
}

export async function getUserAchievements(): Promise<AchievementItem[]> {
  return mockAchievements;
}

export async function getUserHistory(): Promise<MatchHistoryRecord[]> {
  return mockMatchHistory;
}
