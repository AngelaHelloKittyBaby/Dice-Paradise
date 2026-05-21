import type { ScoreCategory, ScoreItem } from '@/types/game';

/** 计分类别配置 */
export const SCORE_CATEGORIES: ScoreItem[] = [
  // 上半部分
  { category: 'ones', name: 'ones', nameZh: '一点', score: null, isFilled: false },
  { category: 'twos', name: 'twos', nameZh: '二点', score: null, isFilled: false },
  { category: 'threes', name: 'threes', nameZh: '三点', score: null, isFilled: false },
  { category: 'fours', name: 'fours', nameZh: '四点', score: null, isFilled: false },
  { category: 'fives', name: 'fives', nameZh: '五点', score: null, isFilled: false },
  { category: 'sixes', name: 'sixes', nameZh: '六点', score: null, isFilled: false },
  // 下半部分
  { category: 'threeOfAKind', name: 'threeOfAKind', nameZh: '三条', score: null, isFilled: false },
  { category: 'fourOfAKind', name: 'fourOfAKind', nameZh: '四条', score: null, isFilled: false },
  { category: 'fullHouse', name: 'fullHouse', nameZh: '葫芦', score: null, isFilled: false },
  { category: 'smallStraight', name: 'smallStraight', nameZh: '小顺', score: null, isFilled: false },
  { category: 'largeStraight', name: 'largeStraight', nameZh: '大顺', score: null, isFilled: false },
  { category: 'yacht', name: 'yacht', nameZh: '快艇', score: null, isFilled: false },
  { category: 'chance', name: 'chance', nameZh: '机会', score: null, isFilled: false },
];

/** 上半部分计分类别 */
export const UPPER_CATEGORIES: ScoreCategory[] = [
  'ones', 'twos', 'threes', 'fours', 'fives', 'sixes'
];

/** 下半部分计分类别 */
export const LOWER_CATEGORIES: ScoreCategory[] = [
  'threeOfAKind', 'fourOfAKind', 'fullHouse',
  'smallStraight', 'largeStraight', 'yacht', 'chance'
];

/** 上半部分奖励阈值 */
export const UPPER_BONUS_THRESHOLD = 63;

/** 上半部分奖励分数 */
export const UPPER_BONUS_SCORE = 35;

/** 每回合最大投掷次数 */
export const MAX_ROLLS_PER_TURN = 3;

/** 骰子数量 */
export const DICE_COUNT = 5;

/** 游戏总回合数（每个计分类别填满） */
export const TOTAL_ROUNDS = 13;

/** 计分类别中文名称映射 */
export const CATEGORY_NAMES: Record<ScoreCategory, string> = {
  ones: '一点',
  twos: '二点',
  threes: '三点',
  fours: '四点',
  fives: '五点',
  sixes: '六点',
  threeOfAKind: '三条',
  fourOfAKind: '四条',
  fullHouse: '葫芦',
  smallStraight: '小顺',
  largeStraight: '大顺',
  yacht: '快艇',
  chance: '机会',
};

/** 计分类别固定分数 */
export const CATEGORY_FIXED_SCORES: Partial<Record<ScoreCategory, number>> = {
  fullHouse: 25,
  smallStraight: 30,
  largeStraight: 40,
  yacht: 50,
};
