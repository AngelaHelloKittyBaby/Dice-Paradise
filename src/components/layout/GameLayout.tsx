'use client';

import React from 'react';

export interface GameLayoutProps {
  children: React.ReactNode;
  topContent?: React.ReactNode;
  centerContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  sideContent?: React.ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  children,
  topContent,
  centerContent,
  bottomContent,
  sideContent,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-game-bg flex flex-col">
      {/* Top Section */}
      {topContent && (
        <div className="flex-shrink-0 px-4 py-3">
          {topContent}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-4">
        {sideContent ? (
          <div className="w-full max-w-4xl flex gap-4">
            {/* Center - Game Area */}
            <div className="flex-1 flex flex-col items-center justify-center gap-6">
              {centerContent}
              {children}
            </div>
            {/* Side - Score Board */}
            <div className="hidden md:block w-80">
              {sideContent}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6">
            {centerContent}
            {children}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      {bottomContent && (
        <div className="flex-shrink-0 px-4 py-4 safe-area-bottom">
          {bottomContent}
        </div>
      )}
    </div>
  );
};
