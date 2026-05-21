'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: '首页', icon: '🏠' },
  { href: '/room', label: '房间', icon: '🚪' },
  { href: '/leaderboard', label: '排行', icon: '🏆' },
  { href: '/activity', label: '活动', icon: '🎁' },
  { href: '/profile', label: '我的', icon: '👤' },
];

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // 游戏页面不显示底部导航
  if (pathname?.startsWith('/game') || pathname?.startsWith('/result')) {
    return null;
  }

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 safe-area-bottom">
      <nav className="max-w-4xl mx-auto px-4">
        <ul className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex flex-col items-center gap-0.5 py-1 px-3 transition-colors',
                    isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
};
