/**
 * 格式化数字，添加千位分隔符
 * @param num 数字
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}

/**
 * 格式化日期
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * 格式化时间
 * @param date 日期字符串或Date对象
 * @returns 格式化后的时间字符串
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * 格式化日期时间
 * @param date 日期字符串或Date对象
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(date: string | Date): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * 格式化剩余时间
 * @param seconds 剩余秒数
 * @returns 格式化后的时间字符串
 */
export function formatRemainingTime(seconds: number): string {
  if (seconds <= 0) return '00:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 格式化胜率
 * @param wins 胜场
 * @param losses 负场
 * @returns 胜率百分比字符串
 */
export function formatWinRate(wins: number, losses: number): string {
  const total = wins + losses;
  if (total === 0) return '0%';
  return `${Math.round((wins / total) * 100)}%`;
}

/**
 * 格式化等级进度
 * @param exp 当前经验
 * @param level 当前等级
 * @returns 进度百分比
 */
export function formatLevelProgress(exp: number, level: number): number {
  const expPerLevel = 200;
  const currentLevelExp = level * expPerLevel;
  const nextLevelExp = (level + 1) * expPerLevel;
  const progress = ((exp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
  return Math.min(100, Math.max(0, progress));
}
