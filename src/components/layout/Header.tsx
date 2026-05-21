'use client';

import React from 'react';
import Link from 'next/link';
import { Avatar } from '@/components/ui';
import type { Player } from '@/types';



export interface HeaderProps {
  player?: Player | null;
  showBack?: boolean;
  title?: string;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  player,
  showBack = false,
  title,
  rightAction,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => window.history.back()}
              className="p-2 -ml-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {title ? (
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          ) : (
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🎲</span>
              <span className="text-xl font-bold text-primary-600">投骰乐园</span>
            </Link>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {rightAction}
          {player && (
            <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{player.name}</p>
                <p className="text-xs text-gray-500">Lv.{player.level}</p>
              </div>
              <Avatar src={player.avatar} alt={player.name} size="md" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
