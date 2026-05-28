import type { GameResultData, PlayerScoreDetail } from '@/types/gameResult';

export const mockPlayerDetail: PlayerScoreDetail = {
  upperScore: 69,
  bonusScore: 35,
  upperTotal: 104,
  lowerScore: 207,
  extraReward: 50,
  extraBonus: 35,
  totalScore: 361,
};

export const mockGameResult: GameResultData = {
  players: [
    {
      id: 1,
      nickname: '快乐玩家',
      avatar: '',
      score: 361,
      isOwner: true,
      rank: 1,
    },
    {
      id: 2,
      nickname: 'AI机器人',
      avatar: '',
      score: 210,
      rank: 2,
    },
    {
      id: 3,
      nickname: '小可爱',
      avatar: '',
      score: 171,
      rank: 3,
    },
    {
      id: 4,
      nickname: '幸运星',
      avatar: '',
      score: 147,
      rank: 4,
    },
  ],
  playerDetails: {
    1: mockPlayerDetail,
    2: {
      upperScore: 54,
      bonusScore: 0,
      upperTotal: 54,
      lowerScore: 126,
      extraReward: 30,
      extraBonus: 0,
      totalScore: 210,
    },
    3: {
      upperScore: 48,
      bonusScore: 0,
      upperTotal: 48,
      lowerScore: 103,
      extraReward: 20,
      extraBonus: 0,
      totalScore: 171,
    },
    4: {
      upperScore: 42,
      bonusScore: 0,
      upperTotal: 42,
      lowerScore: 90,
      extraReward: 15,
      extraBonus: 0,
      totalScore: 147,
    },
  },
  highlights: [
    { id: 'yacht', icon: 'yacht', name: '快艇', value: 1, unit: '次' },
    { id: 'upper-bonus', icon: 'upperBonus', name: '上半区额外奖励', value: 35, unit: '分', status: '已获得' },
    { id: 'best-round', icon: 'bestRound', name: '最高单回合', value: 28, unit: '分' },
  ],
};
