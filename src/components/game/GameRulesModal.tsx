'use client';

import type { LucideIcon } from 'lucide-react';
import { Anchor, Calculator, Dice5, LockKeyhole, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface GameRulesModalProps {
  open: boolean;
  onClose: () => void;
}

interface RuleItem {
  title: string;
  description: string;
  score?: string;
  icon: LucideIcon;
  tone: string;
}

interface RuleSection {
  title: string;
  subtitle?: string;
  items: RuleItem[];
  highlight?: string;
}

const upperRules: RuleItem[] = [
  {
    title: '一点～六点',
    description: '投出相应点数的骰子全部相加得分。',
    icon: Dice5,
    tone: 'from-[#64d8ff] to-[#1d7dff] text-white',
  },
];

const lowerRules: RuleItem[] = [
  {
    title: '三条',
    description: '至少三颗相同，全部骰子点数相加。',
    icon: Dice5,
    tone: 'from-[#6ee7a8] to-[#16a46c] text-white',
  },
  {
    title: '四条',
    description: '至少四颗相同，全部骰子点数相加。',
    icon: Dice5,
    tone: 'from-[#63b8ff] to-[#245cff] text-white',
  },
  {
    title: '葫芦',
    description: '三颗相同 + 两颗相同。',
    score: '固定 25 分',
    icon: Trophy,
    tone: 'from-[#b96cff] to-[#7542e9] text-white',
  },
  {
    title: '小顺子',
    description: '四个连续数字。',
    score: '固定 30 分',
    icon: RotateCcw,
    tone: 'from-[#ff8ecb] to-[#e44891] text-white',
  },
  {
    title: '大顺子',
    description: '五个连续数字。',
    score: '固定 40 分',
    icon: Sparkles,
    tone: 'from-[#ff8068] to-[#d84a2d] text-white',
  },
  {
    title: '快艇',
    description: '五颗完全相同。',
    score: '固定 50 分',
    icon: Trophy,
    tone: 'from-[#ffc75a] to-[#f08a24] text-[#764100]',
  },
  {
    title: '机会',
    description: '无要求，全部骰子点数相加。',
    icon: Calculator,
    tone: 'from-[#ffe27a] to-[#ffad27] text-[#764100]',
  },
];

const bonusRules: RuleItem[] = [
  {
    title: '上层达标奖励',
    description: '上层6格总分 ≥ 63 分。',
    score: '额外奖励 35 分',
    icon: Sparkles,
    tone: 'from-[#65e4ff] to-[#237cff] text-white',
  },
  {
    title: '重复快艇',
    description: '第一次 50 分，后续每次额外 +100 分。',
    score: '娱乐场可用，比赛可取消',
    icon: Trophy,
    tone: 'from-[#ffe071] to-[#ff9f25] text-[#734100]',
  },
];

const commonRules: RuleItem[] = [
  {
    title: '必须选择计分',
    description: '不可跳过回合，最差填 0 分。',
    icon: LockKeyhole,
    tone: 'from-[#7fdcff] to-[#286dff] text-white',
  },
  {
    title: '顺子判定',
    description: '小顺子允许多余骰子，大顺子必须五颗连续无重复。',
    icon: RotateCcw,
    tone: 'from-[#c29cff] to-[#7654f2] text-white',
  },
  {
    title: '最终总分 =',
    description: '上层分 + 下层分 + 奖励分，分数最高获胜。',
    icon: Calculator,
    tone: 'from-[#ffb2d7] to-[#ff5f91] text-white',
  },
];

const ruleSections: RuleSection[] = [
  {
    title: '上层数字区（共6格）',
    subtitle: '一点～六点',
    items: upperRules,
    highlight: '上层6格总分 ≥ 63 分，额外奖励 35 分。',
  },
  {
    title: '下层组合区（共7格）',
    items: lowerRules,
  },
  {
    title: '额外奖励',
    items: bonusRules,
  },
  {
    title: '通用补充规则',
    items: commonRules,
  },
];

function RuleBadge({ item, index }: { item: RuleItem; index: number }) {
  const Icon = item.icon;

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * index, duration: 0.22 }}
      className="group flex gap-3 rounded-[15px] border border-[#cfe5ff]/72 bg-white/54 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_8px_18px_rgba(26,86,164,0.08)] transition-all duration-300 hover:-translate-y-[2px] hover:border-[#80cfff] hover:bg-white/72 hover:shadow-[0_12px_24px_rgba(35,122,255,0.16),0_0_18px_rgba(83,188,255,0.26)]"
    >
      <span
        className={`grid h-[34px] w-[34px] flex-none place-items-center rounded-[10px] bg-gradient-to-br ${item.tone} shadow-[0_7px_14px_rgba(25,88,170,0.2)]`}
      >
        <Icon size={21} strokeWidth={2.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <strong className="text-[16px] font-black leading-5 text-[#0b48b4]">{item.title}</strong>
          {item.score && (
            <em className="not-italic bg-gradient-to-r from-[#ff4f4f] via-[#ff8a24] to-[#f0b900] bg-clip-text text-[14px] font-black text-transparent drop-shadow-[0_1px_4px_rgba(255,174,42,0.28)]">
              {item.score}
            </em>
          )}
        </span>
        <span className="mt-1 block text-[14px] font-bold leading-6 text-[#244d92]">{item.description}</span>
      </span>
    </motion.li>
  );
}

function RuleSectionBlock({ section, sectionIndex }: { section: RuleSection; sectionIndex: number }) {
  return (
    <section className="border-b border-[#c8ddf6] pb-5 last:border-b-0 last:pb-0">
      <h3 className="flex items-center gap-2 text-[20px] font-black text-[#0649b8] drop-shadow-[0_1px_5px_rgba(88,170,255,0.25)]">
        <span className="h-[8px] w-[8px] rounded-full bg-[#2c8dff] shadow-[0_0_12px_rgba(44,141,255,0.7)]" />
        {section.title}
      </h3>
      {section.subtitle && (
        <p className="mt-2 text-[15px] font-bold text-[#244d92]">
          {section.subtitle}：投出相应点数的骰子全部相加得分。
        </p>
      )}
      {section.highlight && (
        <div className="mt-3 rounded-[14px] border border-[#ffb7a8]/70 bg-gradient-to-r from-[#fff5f1]/88 to-[#fff8d8]/88 px-4 py-3 text-[15px] font-black text-[#e24b39] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          {section.highlight}
        </div>
      )}
      <ul className="mt-3 grid gap-2.5">
        {section.items.map((item, itemIndex) => (
          <RuleBadge key={`${section.title}-${item.title}`} item={item} index={sectionIndex + itemIndex} />
        ))}
      </ul>
    </section>
  );
}

export function GameRulesModal({ open, onClose }: GameRulesModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-[90] grid place-items-center bg-[#041338]/54 backdrop-blur-[12px]"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.section
            className="relative w-[620px] overflow-hidden rounded-[24px] border-[3px] border-[#8fd8ff] bg-white/88 text-[#153772] shadow-[0_30px_80px_rgba(5,30,92,0.38),0_0_36px_rgba(93,190,255,0.55),inset_0_2px_16px_rgba(255,255,255,0.78)] backdrop-blur-[12px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-rules-title"
            initial={{ opacity: 0, scale: 0.93, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={event => event.stopPropagation()}
          >
            <div className="pointer-events-none absolute inset-x-5 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-[190px] w-[190px] rounded-full bg-[#5ecbff]/22 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-14 h-[210px] w-[210px] rounded-full bg-[#7763ff]/16 blur-3xl" />

            <header className="relative flex h-[82px] items-center gap-4 border-b border-[#cfe1f7] bg-gradient-to-r from-[#f7fbff]/88 via-[#eaf5ff]/92 to-[#f7fbff]/88 px-7">
              <span className="grid h-[44px] w-[44px] place-items-center rounded-[14px] bg-gradient-to-br from-[#7bdcff] to-[#166fff] text-white shadow-[0_10px_20px_rgba(26,111,225,0.28)]">
                <Anchor size={28} strokeWidth={3} />
              </span>
              <div>
                <h2
                  id="game-rules-title"
                  className="m-0 bg-gradient-to-r from-[#073da7] via-[#0d66df] to-[#43b9ff] bg-clip-text text-[25px] font-black leading-none text-transparent drop-shadow-[0_2px_8px_rgba(71,159,255,0.2)]"
                >
                  计分规则（标准版）
                </h2>
                <p className="mt-2 text-[13px] font-bold text-[#5a7cb4]">快艇骰子 · 标准计分面板</p>
              </div>
              <button
                type="button"
                aria-label="关闭规则说明"
                onClick={onClose}
                className="absolute right-5 top-1/2 grid h-[40px] w-[40px] -translate-y-1/2 place-items-center rounded-full border border-[#b8d7ff] bg-white/78 text-[#1455b8] shadow-[0_8px_16px_rgba(28,90,170,0.16),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 hover:scale-110 hover:bg-[#eaf6ff] hover:text-[#0c6af1]"
              >
                <X size={22} strokeWidth={3} />
              </button>
            </header>

            <div
              className="relative max-h-[760px] overflow-y-auto px-7 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              <div className="grid gap-5">
                {ruleSections.map((section, index) => (
                  <RuleSectionBlock key={section.title} section={section} sectionIndex={index} />
                ))}
              </div>

              <div className="pointer-events-none sticky bottom-0 mt-4 flex justify-end bg-gradient-to-t from-white/88 via-white/58 to-transparent pt-12">
                <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-gradient-to-br from-[#ffef78] via-[#ff744a] to-[#3269d9] text-[36px] shadow-[0_12px_26px_rgba(24,82,170,0.22),inset_0_4px_10px_rgba(255,255,255,0.46)]">
                  🛟
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
