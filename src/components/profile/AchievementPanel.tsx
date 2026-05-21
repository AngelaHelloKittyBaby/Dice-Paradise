'use client';

import { motion } from 'framer-motion';
import {
  Castle,
  Crown,
  Dice5,
  Flame,
  Gem,
  Medal,
  Rocket,
  Shield,
  Sparkles,
  Star,
  Target,
  Trophy,
} from 'lucide-react';
import type { AchievementIconKey, AchievementItem } from '@/types/profile';

export interface AchievementPanelProps {
  achievements: AchievementItem[];
}

const iconMap = {
  trophy: Trophy,
  dice: Dice5,
  star: Star,
  target: Target,
  crown: Crown,
  flame: Flame,
  gem: Gem,
  shield: Shield,
  castle: Castle,
  sparkles: Sparkles,
  rocket: Rocket,
  medal: Medal,
} satisfies Record<AchievementIconKey, typeof Trophy>;

export function AchievementPanel({ achievements }: AchievementPanelProps) {
  return (
    <motion.section
      className="rounded-[24px] border border-[#99d8ff]/80 bg-white/92 p-7 shadow-[0_26px_54px_rgba(0,55,150,0.24),0_0_30px_rgba(116,75,255,0.26),inset_0_2px_0_rgba(255,255,255,0.9)]"
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ duration: 0.26, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between">
        <h2 className="rounded-b-[10px] bg-gradient-to-r from-[#9b56ff] to-[#5f25d6] px-9 py-3 text-[27px] font-black text-white shadow-[0_8px_18px_rgba(101,54,214,0.32)]">
          成就勋章
        </h2>
        <p className="text-[18px] font-black text-[#1359bf]">已解锁 {achievements.filter(item => item.unlocked).length}/{achievements.length}</p>
      </div>

      <div className="mt-6 max-h-[500px] overflow-y-auto pr-3 [scrollbar-color:#5db8ff_rgba(210,232,255,0.8)] [scrollbar-width:thin]">
        <div className="grid grid-cols-4 gap-5">
          {achievements.map(item => {
            const Icon = iconMap[item.icon];
            const percent = Math.min(100, Math.round((item.progress / item.target) * 100));

            return (
              <motion.article
                key={item.id}
                whileHover={{ y: -6, scale: 1.035 }}
                className={`relative overflow-hidden rounded-[22px] border p-5 text-center transition-all duration-300 ${
                  item.claimable
                    ? 'border-[#ffd76a] bg-gradient-to-b from-[#fff8cf] to-[#fff0a8] shadow-[0_0_28px_rgba(255,215,0,0.62),0_14px_28px_rgba(160,98,0,0.16)]'
                    : item.unlocked
                      ? 'border-[#b8dcff] bg-gradient-to-b from-[#ffffff] to-[#edf7ff] shadow-[0_14px_28px_rgba(32,105,200,0.16)]'
                      : 'border-[#cfd8e8] bg-gradient-to-b from-[#edf1f7] to-[#d5deec] opacity-75 grayscale'
                }`}
              >
                {item.claimable && (
                  <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-[#ffcf4b] to-[#ff8b20] px-3 py-1 text-[13px] font-black text-[#713800] animate-pulse">
                    可领取
                  </span>
                )}
                <span className={`mx-auto grid h-[92px] w-[92px] place-items-center rounded-[24px] border-2 border-white text-white ${
                  item.claimable
                    ? 'bg-gradient-to-br from-[#fff191] via-[#ffb42e] to-[#ff5a23] shadow-[0_0_24px_rgba(255,205,55,0.72)]'
                    : item.unlocked
                      ? 'bg-gradient-to-br from-[#70d9ff] via-[#276cff] to-[#6b37ed] shadow-[0_0_20px_rgba(70,151,255,0.42)]'
                      : 'bg-gradient-to-br from-[#c8d1df] to-[#7f8da3]'
                }`}>
                  <Icon size={48} strokeWidth={2.5} fill={item.icon === 'star' || item.icon === 'crown' ? 'currentColor' : 'transparent'} />
                </span>
                <h3 className="mt-4 text-[20px] font-black text-[#092d85]">{item.name}</h3>
                <p className="mt-2 min-h-[40px] text-[14px] font-bold leading-5 text-[#476b9f]">{item.description}</p>
                <div className="mt-4 h-[8px] overflow-hidden rounded-full bg-[#cfddf0]">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-[#ffd34f] to-[#3289ff]"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="mt-2 text-[13px] font-black text-[#2561bf]">
                  {item.progress}/{item.target}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
