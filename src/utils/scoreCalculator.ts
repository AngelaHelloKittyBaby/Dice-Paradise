import type { DiceValue, ScoreCategory } from '@/types/game';
import {
  UPPER_BONUS_THRESHOLD,
  UPPER_BONUS_SCORE,
  CATEGORY_FIXED_SCORES,
} from '@/constants/gameRules';

/**
 * 计算指定计分类别的得分
 * @param dice 五个骰子的点数
 * @param category 计分类别
 * @returns 该类别的得分
 */
export function calculateScore(dice: DiceValue[], category: ScoreCategory): number {
  const counts = [0, 0, 0, 0, 0, 0, 0];
  dice.forEach(d => counts[d]++);
  const sum = dice.reduce((a, b) => a + b, 0);

  switch (category) {
    case 'ones': return counts[1] * 1;
    case 'twos': return counts[2] * 2;
    case 'threes': return counts[3] * 3;
    case 'fours': return counts[4] * 4;
    case 'fives': return counts[5] * 5;
    case 'sixes': return counts[6] * 6;

    case 'threeOfAKind':
      return counts.some(c => c >= 3) ? sum : 0;

    case 'fourOfAKind':
      return counts.some(c => c >= 4) ? sum : 0;

    case 'fullHouse':
      const hasThree = counts.some(c => c === 3);
      const hasTwo = counts.some(c => c === 2);
      return (hasThree && hasTwo) ? (CATEGORY_FIXED_SCORES.fullHouse ?? 25) : 0;

    case 'smallStraight':
      const small = [[1,2,3,4], [2,3,4,5], [3,4,5,6]];
      return small.some(seq => seq.every(n => counts[n] >= 1))
        ? (CATEGORY_FIXED_SCORES.smallStraight ?? 30) : 0;

    case 'largeStraight':
      const large = [[1,2,3,4,5], [2,3,4,5,6]];
      return large.some(seq => seq.every(n => counts[n] >= 1))
        ? (CATEGORY_FIXED_SCORES.largeStraight ?? 40) : 0;

    case 'yacht':
      return counts.some(c => c === 5) ? (CATEGORY_FIXED_SCORES.yacht ?? 50) : 0;

    case 'chance':
      return sum;

    default:
      return 0;
  }
}

/**
 * 计算上半部分小计
 * @param scores 已填写的计分
 * @returns 上半部分小计
 */
export function calculateUpperSubtotal(scores: Partial<Record<ScoreCategory, number>>): number {
  const upperCategories: ScoreCategory[] = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
  return upperCategories.reduce((sum, cat) => sum + (scores[cat] ?? 0), 0);
}

/**
 * 计算上半部分奖励
 * @param upperSubtotal 上半部分小计
 * @returns 奖励分数
 */
export function calculateUpperBonus(upperSubtotal: number): number {
  return upperSubtotal >= UPPER_BONUS_THRESHOLD ? UPPER_BONUS_SCORE : 0;
}

/**
 * 计算下半部分总计
 * @param scores 已填写的计分
 * @returns 下半部分总计
 */
export function calculateLowerTotal(scores: Partial<Record<ScoreCategory, number>>): number {
  const lowerCategories: ScoreCategory[] = [
    'threeOfAKind', 'fourOfAKind', 'fullHouse',
    'smallStraight', 'largeStraight', 'yacht', 'chance'
  ];
  return lowerCategories.reduce((sum, cat) => sum + (scores[cat] ?? 0), 0);
}

/**
 * 计算总得分
 * @param scores 已填写的计分
 * @returns 总得分
 */
export function calculateGrandTotal(scores: Partial<Record<ScoreCategory, number>>): number {
  const upperSubtotal = calculateUpperSubtotal(scores);
  const upperBonus = calculateUpperBonus(upperSubtotal);
  const lowerTotal = calculateLowerTotal(scores);
  return upperSubtotal + upperBonus + lowerTotal;
}

/**
 * 获取所有可能的计分
 * @param dice 当前骰子
 * @param completedCategories 已完成的类别
 * @returns 可能的计分列表
 */
export function getPossibleScores(
  dice: DiceValue[],
  completedCategories: ScoreCategory[]
): Partial<Record<ScoreCategory, number>> {
  const allCategories: ScoreCategory[] = [
    'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
    'threeOfAKind', 'fourOfAKind', 'fullHouse',
    'smallStraight', 'largeStraight', 'yacht', 'chance'
  ];

  const result: Partial<Record<ScoreCategory, number>> = {};

  allCategories.forEach(category => {
    if (!completedCategories.includes(category)) {
      result[category] = calculateScore(dice, category);
    }
  });

  return result;
}
