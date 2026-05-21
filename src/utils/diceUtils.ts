import type { DiceValue } from '@/types/game';

/**
 * 生成随机骰子值
 * @returns 1-6的随机数
 */
export function rollSingleDice(): DiceValue {
  return (Math.floor(Math.random() * 6) + 1) as DiceValue;
}

/**
 * 投掷所有未锁定的骰子
 * @param current 当前骰子值
 * @param locked 锁定状态
 * @returns 新的骰子值
 */
export function rollDice(current: DiceValue[], locked: boolean[]): DiceValue[] {
  return current.map((value, index) => {
    if (locked[index]) {
      return value;
    }
    return rollSingleDice();
  });
}

/**
 * 生成初始骰子值
 * @returns 五个1的骰子值
 */
export function generateInitialDice(): DiceValue[] {
  return [1, 1, 1, 1, 1] as DiceValue[];
}

/**
 * 生成初始锁定状态
 * @returns 五个false的锁定状态
 */
export function generateInitialLocked(): boolean[] {
  return [false, false, false, false, false];
}

/**
 * 切换骰子锁定状态
 * @param locked 当前锁定状态
 * @param index 要切换的骰子索引
 * @returns 新的锁定状态
 */
export function toggleDiceLock(locked: boolean[], index: number): boolean[] {
  const newLocked = [...locked];
  newLocked[index] = !newLocked[index];
  return newLocked;
}

/**
 * 检查是否可以锁定骰子
 * @param rollsLeft 剩余投掷次数
 * @returns 是否可以锁定
 */
export function canLockDice(rollsLeft: number): boolean {
  return rollsLeft < 3;
}

/**
 * 获取骰子点数显示字符
 * @param value 骰子点数
 * @returns 显示字符
 */
export function getDiceDisplay(value: DiceValue): string {
  const displays: Record<DiceValue, string> = {
    1: '⚀',
    2: '⚁',
    3: '⚂',
    4: '⚃',
    5: '⚄',
    6: '⚅',
  };
  return displays[value];
}
