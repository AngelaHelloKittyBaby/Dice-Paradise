'use client';

import { BarChart3, History, Medal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ProfilePanelType } from '@/types/profile';

interface SidebarItem {
  type: ProfilePanelType;
  label: string;
  icon: LucideIcon;
}

export interface SidebarProps {
  activePanel: ProfilePanelType;
  onChange: (panel: ProfilePanelType) => void;
}

const sidebarItems: SidebarItem[] = [
  { type: 'overview', label: '数据总览', icon: BarChart3 },
  { type: 'achievement', label: '成就勋章', icon: Medal },
  { type: 'history', label: '历史记录', icon: History },
];

export function Sidebar({ activePanel, onChange }: SidebarProps) {
  return (
    <aside className="absolute left-[24px] top-[122px] z-20 w-[244px] overflow-hidden rounded-[18px] border border-[#5dbaff]/35 bg-[linear-gradient(180deg,rgba(14,58,127,0.94),rgba(9,32,82,0.96))] p-3 shadow-[0_22px_46px_rgba(0,22,74,0.34),inset_0_2px_10px_rgba(255,255,255,0.14)]">
      <div className="grid gap-3">
        {sidebarItems.map(item => {
          const Icon = item.icon;
          const active = activePanel === item.type;

          return (
            <button
              key={item.type}
              type="button"
              onClick={() => onChange(item.type)}
              className={`relative flex h-[80px] items-center gap-4 rounded-[14px] px-7 text-left text-[24px] font-black transition-all duration-300 hover:-translate-y-[3px] ${
                active
                  ? 'bg-gradient-to-r from-[#fff7aa] to-[#ffc83c] text-[#061a52] shadow-[0_12px_24px_rgba(166,96,0,0.26),inset_0_2px_0_rgba(255,255,255,0.75)]'
                  : 'text-white hover:bg-white/12 hover:shadow-[0_12px_24px_rgba(70,166,255,0.2)]'
              }`}
            >
              {active && (
                <span className="absolute -right-5 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[18px] border-l-[20px] border-y-transparent border-l-[#ffc83c]" />
              )}
              <Icon
                size={32}
                strokeWidth={3}
                className={active ? 'text-[#07174a]' : 'text-[#e7f6ff] drop-shadow-[0_4px_8px_rgba(0,24,90,0.4)]'}
                fill={active ? 'rgba(7,23,74,0.12)' : 'transparent'}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
