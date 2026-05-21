'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Coins, Gift, House, Paintbrush, type LucideIcon } from 'lucide-react';

export type IslandNavKey = 'home' | 'leaderboard' | 'activity' | 'profile';

interface IslandNavItem {
  key: IslandNavKey;
  label: string;
  href: string;
  icon: LucideIcon;
  iconClassName: string;
  activeIconClassName: string;
  iconBackgroundClassName: string;
  activeIconBackgroundClassName: string;
  fill: string;
  activeFill: string;
  accentClassName: string;
}

export interface IslandTopNavProps {
  activeItem: IslandNavKey;
  rightSlot?: ReactNode;
  className?: string;
}

const islandNavItems: IslandNavItem[] = [
  {
    key: 'home',
    label: '游戏大厅',
    href: '/',
    icon: House,
    iconClassName: 'text-[#e8fbff]',
    activeIconClassName: 'text-[#1383ff]',
    iconBackgroundClassName: 'from-[#53d8ff] via-[#1f94ff] to-[#0a56e8]',
    activeIconBackgroundClassName: 'from-[#f4fcff] via-[#bdefff] to-[#60b7ff]',
    fill: 'rgba(214, 249, 255, 0.26)',
    activeFill: 'rgba(55, 162, 255, 0.28)',
    accentClassName: '-right-[3px] -top-[3px] h-[8px] w-[8px] rounded-full bg-[#fff27a]',
  },
  {
    key: 'leaderboard',
    label: '排行榜',
    href: '/leaderboard',
    icon: Coins,
    iconClassName: 'text-[#fff2a7]',
    activeIconClassName: 'text-[#f49b16]',
    iconBackgroundClassName: 'from-[#ffe278] via-[#ffad2d] to-[#e36b1f]',
    activeIconBackgroundClassName: 'from-[#fff8c9] via-[#ffd260] to-[#ff9838]',
    fill: 'rgba(255, 220, 90, 0.34)',
    activeFill: 'rgba(255, 164, 38, 0.36)',
    accentClassName: '-bottom-[2px] -right-[4px] h-[11px] w-[11px] rounded-full border border-white/80 bg-[#ff7b2a]',
  },
  {
    key: 'activity',
    label: '活动',
    href: '/activity',
    icon: Gift,
    iconClassName: 'text-[#fff2ba]',
    activeIconClassName: 'text-[#ef3f3f]',
    iconBackgroundClassName: 'from-[#ff7373] via-[#f5414a] to-[#c81842]',
    activeIconBackgroundClassName: 'from-[#fff0a8] via-[#ffce51] to-[#ff8c35]',
    fill: 'rgba(255, 232, 110, 0.34)',
    activeFill: 'rgba(255, 80, 73, 0.22)',
    accentClassName: '-right-[3px] -top-[3px] h-[9px] w-[9px] rotate-45 rounded-[2px] bg-[#50d8ff]',
  },
  {
    key: 'profile',
    label: '个人中心',
    href: '/profile',
    icon: Paintbrush,
    iconClassName: 'text-[#c9f5ff]',
    activeIconClassName: 'text-[#2478e8]',
    iconBackgroundClassName: 'from-[#5ce5ff] via-[#3594ff] to-[#164dd9]',
    activeIconBackgroundClassName: 'from-[#f7fbff] via-[#9fe9ff] to-[#58a6ff]',
    fill: 'rgba(255, 165, 42, 0.24)',
    activeFill: 'rgba(255, 154, 39, 0.26)',
    accentClassName: '-bottom-[3px] -right-[2px] h-[12px] w-[6px] rotate-45 rounded-full bg-[#ff9f27]',
  },
];

function DiceParadiseLogo() {
  return (
    <Link href="/" aria-label="返回投骰乐园首页" className="pointer-events-auto flex items-center gap-3 text-white no-underline">
      <span className="grid h-[58px] w-[58px] place-items-center rounded-[16px] border-2 border-white/80 bg-gradient-to-br from-white to-[#9ed5ff] text-[36px] text-[#0a64c8] shadow-[0_10px_22px_rgba(0,20,60,0.28),inset_0_3px_8px_rgba(255,255,255,0.7)]">
        🎲
      </span>
      <strong className="text-[32px] font-black leading-[0.92] tracking-[0] text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]">
        投骰乐园
        <small className="mt-2 block text-[15px] font-black tracking-[2px]">DICE PARADISE</small>
      </strong>
    </Link>
  );
}

function IslandNavIcon({ item, active }: { item: IslandNavItem; active: boolean }) {
  const Icon = item.icon;

  return (
    <span
      className={`relative grid h-[27px] w-[27px] shrink-0 place-items-center rounded-[10px] border border-white/55 bg-gradient-to-br ${
        active ? item.activeIconBackgroundClassName : item.iconBackgroundClassName
      } shadow-[0_5px_10px_rgba(0,39,125,0.24),inset_0_1px_5px_rgba(255,255,255,0.42)]`}
      aria-hidden="true"
    >
      <Icon
        size={18}
        strokeWidth={3}
        className={active ? item.activeIconClassName : item.iconClassName}
        fill={active ? item.activeFill : item.fill}
      />
      <span className={`absolute ${item.accentClassName} shadow-[0_2px_5px_rgba(0,40,120,0.28)]`} />
    </span>
  );
}

export function IslandTopNav({ activeItem, rightSlot, className = '' }: IslandTopNavProps) {
  return (
    <header
      className={`pointer-events-none absolute left-0 top-0 z-30 flex h-[86px] w-full items-center justify-between px-[40px] ${className}`}
    >
      <DiceParadiseLogo />

      <nav
        aria-label="主导航"
        className="pointer-events-auto absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full border border-white/20 bg-[#0869e8]/48 px-3 py-2 shadow-[0_12px_28px_rgba(0,31,132,0.22),inset_0_2px_8px_rgba(255,255,255,0.16)] backdrop-blur-[10px]"
      >
        {islandNavItems.map(item => {
          const active = item.key === activeItem;

          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={`flex h-[45px] min-w-[138px] items-center justify-center gap-2 rounded-full px-5 text-[18px] font-black tracking-[0] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_10px_22px_rgba(64,156,255,0.34)] ${
                active
                  ? 'bg-gradient-to-b from-white via-[#fff8d8] to-[#ffd76b] text-[#1251b6] shadow-[0_8px_18px_rgba(255,184,45,0.34),inset_0_2px_7px_rgba(255,255,255,0.72)]'
                  : 'text-white/96 hover:bg-white/12'
              }`}
            >
              <IslandNavIcon item={item} active={active} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pointer-events-auto flex min-w-[260px] justify-end">{rightSlot}</div>
    </header>
  );
}
