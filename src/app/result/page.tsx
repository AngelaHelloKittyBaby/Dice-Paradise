'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageContainer } from '@/components/layout';
import { Card, Button, Avatar, Badge } from '@/components/ui';
import { useGame, useAuth } from '@/hooks';

export default function ResultPage() {
  const router = useRouter();
  const { player } = useAuth();
  const { players, winner, resetGame } = useGame();

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.totalScore - a.totalScore);
  }, [players]);

  const handlePlayAgain = () => {
    resetGame();
    router.push('/game');
  };

  if (players.length === 0) {
    return (
      <PageContainer title="游戏结束" showBack player={player}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">暂无游戏数据</p>
            <Link href="/" className="text-primary-600 hover:underline mt-4 inline-block">
              返回首页
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="游戏结束" showBack player={player} showFooter={false}>
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Winner Banner */}
        {winner && (
          <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-8">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-2xl font-bold">{winner.name} 获胜！</h1>
            <p className="text-white/80 mt-2">最终得分: {winner.totalScore}</p>
          </Card>
        )}

        {/* Rankings */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-900">最终排名</h2>
          {sortedPlayers.map((p, index) => (
            <Card
              key={p.id}
              className={index === 0 ? 'ring-2 ring-yellow-400' : ''}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 font-bold text-gray-600">
                  {index + 1}
                </div>
                <Avatar src={p.avatar} alt={p.name} size="md" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{p.name}</h3>
                  {index === 0 && (
                    <Badge variant="warning" size="sm">冠军</Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">{p.totalScore}</p>
                  <p className="text-xs text-gray-500">总分</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Score Details */}
        <Card>
          <h3 className="font-bold text-gray-900 mb-4">得分详情</h3>
          <div className="space-y-4">
            {sortedPlayers.map((p) => (
              <div key={p.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <p className="font-medium text-gray-700 mb-2">{p.name}</p>
                <div className="grid grid-cols-6 gap-2 text-sm">
                  {Object.entries(p.scores).map(([category, score]) => (
                    <div key={category} className="text-center">
                      <p className="text-gray-500 text-xs">{category.slice(0, 3)}</p>
                      <p className="font-medium">{score}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" fullWidth onClick={() => router.push('/')}>
            返回首页
          </Button>
          <Button fullWidth onClick={handlePlayAgain}>
            再来一局
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
