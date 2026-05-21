'use client';

import React from 'react';
import clsx from 'clsx';
import type { ScoreCategory, ScoreItem } from '@/types/game';
import { CATEGORY_NAMES, UPPER_CATEGORIES, LOWER_CATEGORIES, UPPER_BONUS_THRESHOLD } from '@/constants/gameRules';

export interface ScoreBoardProps {
  scores: Partial<Record<ScoreCategory, number>>;
  completedCategories: ScoreCategory[];
  possibleScores?: Partial<Record<ScoreCategory, number>>;
  onSelectCategory?: (category: ScoreCategory) => void;
  disabled?: boolean;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scores,
  completedCategories,
  possibleScores,
  onSelectCategory,
  disabled = false,
}) => {
  const upperSubtotal = UPPER_CATEGORIES.reduce((sum, cat) => sum + (scores[cat] ?? 0), 0);
  const upperBonus = upperSubtotal >= UPPER_BONUS_THRESHOLD ? 35 : 0;
  const upperTotal = upperSubtotal + upperBonus;
  const lowerTotal = LOWER_CATEGORIES.reduce((sum, cat) => sum + (scores[cat] ?? 0), 0);
  const grandTotal = upperTotal + lowerTotal;

  const renderScoreRow = (category: ScoreCategory) => {
    const isCompleted = completedCategories.includes(category);
    const score = scores[category];
    const possible = possibleScores?.[category];

    return (
      <button
        key={category}
        onClick={() => !isCompleted && !disabled && possible !== undefined && onSelectCategory?.(category)}
        disabled={isCompleted || disabled || possible === undefined}
        className={clsx(
          'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200',
          !isCompleted && possible !== undefined && !disabled && 'hover:bg-primary-50 cursor-pointer',
          isCompleted && 'bg-gray-50',
          !isCompleted && possible === undefined && 'opacity-50'
        )}
      >
        <span className="font-medium text-gray-700">{CATEGORY_NAMES[category]}</span>
        <span
          className={clsx(
            'font-bold min-w-[3rem] text-right',
            isCompleted ? 'text-gray-900' : 'text-primary-500'
          )}
        >
          {isCompleted ? score : possible ?? '-'}
        </span>
      </button>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-4 w-full max-w-xs">
      {/* Upper Section */}
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-500 mb-2 px-3">上半部分</h3>
        <div className="space-y-1">
          {UPPER_CATEGORIES.map(renderScoreRow)}
          <div className="border-t border-gray-100 mt-2 pt-2 space-y-1">
            <div className="flex justify-between px-3 py-1 text-sm text-gray-600">
              <span>小计</span>
              <span>{upperSubtotal}</span>
            </div>
            <div className="flex justify-between px-3 py-1 text-sm text-gray-600">
              <span>奖励 (≥{UPPER_BONUS_THRESHOLD})</span>
              <span className={upperBonus > 0 ? 'text-success-500 font-bold' : ''}>
                {upperBonus}
              </span>
            </div>
            <div className="flex justify-between px-3 py-1 font-bold text-gray-900">
              <span>上半总计</span>
              <span>{upperTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 mb-2 px-3">下半部分</h3>
        <div className="space-y-1">
          {LOWER_CATEGORIES.map(renderScoreRow)}
          <div className="border-t border-gray-100 mt-2 pt-2">
            <div className="flex justify-between px-3 py-1 font-bold text-gray-900">
              <span>下半总计</span>
              <span>{lowerTotal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grand Total */}
      <div className="mt-4 pt-4 border-t-2 border-primary-100">
        <div className="flex justify-between px-3 py-2 text-xl font-bold text-primary-600">
          <span>总分</span>
          <span>{grandTotal}</span>
        </div>
      </div>
    </div>
  );
};
