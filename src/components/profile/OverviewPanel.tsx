'use client';

import { motion } from 'framer-motion';
import { Bot, Dice5, Flame, Gem, Star, Target, Trophy, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AchievementItem, UserOverview } from '@/types/profile';
import { StarIcon } from '@/components/ui';

export interface OverviewPanelProps {
  overview: UserOverview;
  achievements: AchievementItem[];
  onShowAchievements: () => void;
}

interface StatConfig {
  key: keyof UserOverview;
  label: string;
  icon: LucideIcon;
  color: string;
  suffix?: string;
}

const statsConfig: StatConfig[] = [
  { key: 'totalGames', label: '总对局数', icon: Dice5, color: 'from-[#68d8ff] to-[#1374ff]' },
  { key: 'totalWins', label: '总胜利局数', icon: Trophy, color: 'from-[#ffd764] to-[#ff9224]' },
  { key: 'winRate', label: '胜率', icon: Target, color: 'from-[#d39aff] to-[#7644f4]', suffix: '%' },
  { key: 'highestStreak', label: '最高连胜', icon: Flame, color: 'from-[#ff9b76] to-[#ff3232]' },
  { key: 'diceCount', label: '投骰总数', icon: Dice5, color: 'from-[#89dcff] to-[#3178ff]' },
  { key: 'starCount', label: '获得星星总数', icon: Star, color: 'from-[#ffe477] to-[#ffab24]' },
  { key: 'roleCount', label: '解锁角色数', icon: Bot, color: 'from-[#ff97d6] to-[#8e55ff]' },
  { key: 'diceUnlockCount', label: '解锁骰子数', icon: Gem, color: 'from-[#9ae6ff] to-[#2a64ff]' },
];

function formatValue(value: number, suffix = '') {
  if (suffix) return `${value}${suffix}`;
  return value.toLocaleString();
}

export function OverviewPanel({ overview, achievements, onShowAchievements }: OverviewPanelProps) {
  const previewAchievements = achievements.slice(0, 8);

  return (
    <motion.section
      className="grid grid-cols-[1fr_1.12fr] gap-5"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.26, ease: 'easeOut' }}
    >
      <section className="relative rounded-[22px] border border-[#9bd8ff]/80 bg-white/92 p-7 shadow-[0_24px_48px_rgba(0,55,150,0.22),0_0_24px_rgba(74,181,255,0.28),inset_0_2px_0_rgba(255,255,255,0.85)]">
        <h2 className="absolute -top-1 left-8 min-w-[184px] rounded-b-[9px] bg-gradient-to-r from-[#2f9bff] to-[#1265e9] px-8 py-3 text-center text-[25px] font-black text-white shadow-[0_8px_18px_rgba(21,98,218,0.34)]">
          数据总览
        </h2>
        <div className="mt-16 grid grid-cols-2 gap-5">
          {statsConfig.map(item => {
            const Icon = item.icon;
            const value = overview[item.key];

            return (
              <motion.article
                key={item.key}
                whileHover={{ y: -5, scale: 1.025 }}
                className="flex h-[82px] items-center gap-5 rounded-[18px] border border-[#d7e9ff] bg-[linear-gradient(180deg,#f9fcff,#edf6ff)] px-5 shadow-[0_10px_22px_rgba(53,118,206,0.12),inset_0_2px_0_rgba(255,255,255,0.9)]"
              >
                <span className={`grid h-[58px] w-[58px] place-items-center rounded-full bg-gradient-to-br ${item.color} text-white shadow-[0_8px_16px_rgba(40,110,210,0.22)]`}>
                  {item.key === 'starCount' ? <StarIcon size={33} /> : <Icon size={32} strokeWidth={2.8} />}
                </span>
                <div>
                  <p className="m-0 text-[17px] font-black text-[#174491]">{item.label}</p>
                  <strong className="text-[27px] font-black leading-none text-[#071a72]">
                    {formatValue(value, item.suffix)}
                  </strong>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="relative rounded-[22px] border border-[#9bd8ff]/80 bg-white/92 p-7 shadow-[0_24px_48px_rgba(0,55,150,0.22),0_0_24px_rgba(116,75,255,0.25),inset_0_2px_0_rgba(255,255,255,0.85)]">
        <div className="flex items-start justify-between">
          <h2 className="min-w-[184px] rounded-b-[9px] bg-gradient-to-r from-[#8c45ff] to-[#6628dc] px-8 py-3 text-center text-[25px] font-black text-white shadow-[0_8px_18px_rgba(101,54,214,0.32)]">
            成就徽章
          </h2>
          <button
            type="button"
            onClick={onShowAchievements}
            className="mt-2 rounded-full px-4 py-2 text-[18px] font-black text-[#1165dd] transition-all duration-300 hover:-translate-y-1 hover:bg-[#e8f4ff]"
          >
            更多 &gt;
          </button>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-x-7 gap-y-6 rounded-[18px] border border-[#d8e8ff] bg-[#f7fbff] p-8 shadow-[inset_0_2px_8px_rgba(31,96,170,0.08)]">
          {previewAchievements.map(item => (
            <motion.article
              key={item.id}
              whileHover={{ y: -5, scale: 1.04 }}
              className="grid justify-items-center gap-3 text-center"
            >
              <span className={`grid h-[82px] w-[82px] place-items-center rounded-[22px] border-2 border-white text-[38px] shadow-[0_12px_20px_rgba(20,70,150,0.18)] ${
                item.claimable
                  ? 'bg-gradient-to-br from-[#fff5a8] via-[#ffb72e] to-[#ff5a23] animate-pulse shadow-[0_0_25px_rgba(255,215,0,0.72)]'
                  : item.unlocked
                    ? 'bg-gradient-to-br from-[#fff6bf] via-[#49a3ff] to-[#6a35e8]'
                    : 'bg-gradient-to-br from-[#d7deea] to-[#8091aa] grayscale opacity-60'
              }`}>
                {item.icon === 'dice' ? '🎲' : item.icon === 'target' ? '🎯' : item.icon === 'star' ? '⭐' : item.icon === 'gem' ? '💎' : '🏅'}
              </span>
              <strong className="text-[18px] font-black text-[#092d85]">{item.name}</strong>
            </motion.article>
          ))}
        </div>
      </section>
    </motion.section>
  );
}
