'use client';

import clsx from 'clsx';
import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Crown,
  Dice5,
  Download,
  Home,
  RotateCcw,
  Share2,
  Ship,
  Sparkles,
  Target,
  Trophy,
  X,
} from 'lucide-react';
import { StarIcon } from '@/components/ui';
import { mockGameResult, mockPlayerDetail } from '@/mocks/gameResult';
import type {
  GameResultData,
  GameResultPlayer,
  PlayerScoreDetail,
  ResultHighlight,
} from '@/types/gameResult';
import styles from './GameResultModal.module.css';

export interface ScoreDetailProps {
  player: PlayerScoreDetail;
  loading?: boolean;
}

export interface GameResultModalProps {
  open: boolean;
  result?: GameResultData;
  initialSelectedPlayerId?: number;
  loading?: boolean;
  onClose?: () => void;
  onBackLobby?: () => void;
  onReplay?: () => void | Promise<void>;
  onShare?: () => void | Promise<void>;
  onSave?: (autoSave: boolean) => void | Promise<void>;
}

const scoreRows = [
  {
    label: '上层数字区',
    hint: '共6格',
    getScore: (player: PlayerScoreDetail) => `${player.upperScore}分`,
    getBonus: (player: PlayerScoreDetail) => `+${player.bonusScore}分`,
    getTotal: (player: PlayerScoreDetail) => `${player.upperTotal}分`,
  },
  {
    label: '下层组合区',
    hint: '共7格',
    getScore: (player: PlayerScoreDetail) => `${player.lowerScore}分`,
    getBonus: () => '-',
    getTotal: (player: PlayerScoreDetail) => `${player.lowerScore}分`,
  },
  {
    label: '额外奖励',
    hint: '重复快艇奖励',
    getScore: (player: PlayerScoreDetail) => `${player.extraReward}分`,
    getBonus: () => '-',
    getTotal: (player: PlayerScoreDetail) => `${player.extraReward}分`,
  },
  {
    label: '上层达标奖励',
    hint: '上层63分奖励',
    getScore: (player: PlayerScoreDetail) => `${player.extraBonus}分`,
    getBonus: () => '-',
    getTotal: (player: PlayerScoreDetail) => `${player.extraBonus}分`,
  },
];

function getAvatarFallback(player: GameResultPlayer): string {
  if (player.nickname.toLowerCase().includes('ai')) {
    return 'AI';
  }

  return player.nickname.slice(0, 1);
}

function getRankTitle(rank: number): string {
  if (rank === 1) return '冠军';
  if (rank === 2) return '亚军';
  if (rank === 3) return '季军';
  return `第${rank}名`;
}

function getHighlightIcon(item: ResultHighlight) {
  if (item.icon === 'yacht') return <Ship size={54} strokeWidth={2.4} />;
  if (item.icon === 'straight') return <Target size={54} strokeWidth={2.4} />;
  if (item.icon === 'fourKind') return <Dice5 size={54} strokeWidth={2.4} />;
  return <StarIcon size={54} strokeWidth={2.4} />;
}

export function ScoreDetailPanel({ player, loading = false }: ScoreDetailProps) {
  return (
    <section className={styles.detailPanel} aria-label="分数明细">
      <h3>
        <span />
        分数明细
        <span />
      </h3>

      <div className={styles.scoreTable}>
        <div className={styles.tableHeader}>
          <span />
          <strong>上层得分</strong>
          <strong>达标奖励</strong>
          <strong>小计</strong>
        </div>

        {scoreRows.map(row => (
          <div className={styles.tableRow} key={row.label}>
            <div className={styles.tableLabel}>
              <strong>{row.label}</strong>
              <small>({row.hint})</small>
            </div>
            <span>{row.getScore(player)}</span>
            <span>{row.getBonus(player)}</span>
            <strong>{row.getTotal(player)}</strong>
          </div>
        ))}

        <div className={styles.totalRow}>
          <strong>总分</strong>
          <em>{player.totalScore}</em>
          <span>分</span>
        </div>
      </div>

      {loading && (
        <div className={styles.detailLoading} aria-live="polite">
          分数刷新中...
        </div>
      )}
    </section>
  );
}

export function GameResultModal({
  open,
  result,
  initialSelectedPlayerId,
  loading = false,
  onClose,
  onBackLobby,
  onReplay,
  onShare,
  onSave,
}: GameResultModalProps) {
  const data = result ?? mockGameResult;
  const sortedPlayers = useMemo(
    () => [...data.players].sort((first, second) => first.rank - second.rank),
    [data.players]
  );
  const winner = sortedPlayers[0];
  const [selectedPlayerId, setSelectedPlayerId] = useState(
    initialSelectedPlayerId ?? winner?.id ?? 0
  );
  const [detailLoading, setDetailLoading] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || sortedPlayers.length === 0) return;

    const preferredPlayerId = initialSelectedPlayerId ?? sortedPlayers[0].id;
    const hasSelectedPlayer = sortedPlayers.some(player => player.id === selectedPlayerId);

    if (!hasSelectedPlayer || initialSelectedPlayerId) {
      setSelectedPlayerId(preferredPlayerId);
    }
  }, [initialSelectedPlayerId, open, selectedPlayerId, sortedPlayers]);

  useEffect(() => {
    if (!open) return;

    setDetailLoading(true);
    const timer = window.setTimeout(() => {
      setDetailLoading(false);
    }, 160);

    return () => window.clearTimeout(timer);
  }, [open, selectedPlayerId]);

  if (!open || !winner) {
    return null;
  }

  const selectedPlayer =
    sortedPlayers.find(player => player.id === selectedPlayerId) ?? sortedPlayers[0];
  const selectedDetail = data.playerDetails[selectedPlayer.id] ?? mockPlayerDetail;

  async function handleSave() {
    setSaving(true);

    try {
      await onSave?.(autoSave);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="game-result-title"
        onClick={event => event.stopPropagation()}
      >
        <button className={styles.closeButton} type="button" aria-label="关闭结算弹窗" onClick={onClose}>
          <X size={34} strokeWidth={3.2} />
        </button>

        <header className={styles.header}>
          <span className={styles.confettiOne} />
          <span className={styles.confettiTwo} />
          <span className={styles.confettiThree} />
          <div className={styles.ribbonBack} />
          <div className={styles.trophyWrap}>
            <Trophy size={74} fill="currentColor" strokeWidth={2.4} />
            <Dice5 className={styles.leftDice} size={46} />
            <Dice5 className={styles.rightDice} size={46} />
          </div>
          <div className={styles.laurelLeft} />
          <div className={styles.laurelRight} />
          <h2 id="game-result-title">游戏结束</h2>
          <p>本局游戏已结束，以下是最终结算结果</p>
        </header>

        <div className={styles.championBanner}>
          <span>
            <Crown size={26} fill="currentColor" />
          </span>
          <small>本局冠军</small>
          <strong>{winner.nickname}</strong>
          <em>{winner.score}分</em>
        </div>

        <div className={styles.content}>
          <section className={styles.rankPanel} aria-label="最终排名">
            <h3>
              <span />
              最终排名
              <span />
            </h3>

            <div className={styles.playerList}>
              {sortedPlayers.map(player => {
                const selected = player.id === selectedPlayer.id;
                const avatarStyle = player.avatar
                  ? ({ backgroundImage: `url(${player.avatar})` } as CSSProperties)
                  : undefined;

                return (
                  <button
                    className={clsx(
                      styles.playerItem,
                      styles[`rank${player.rank}`],
                      selected && styles.selectedPlayer
                    )}
                    type="button"
                    key={player.id}
                    onClick={() => setSelectedPlayerId(player.id)}
                    aria-pressed={selected}
                  >
                    <span className={styles.rankMedal}>
                      {player.rank === 1 && <Crown size={28} fill="currentColor" />}
                      <b>{player.rank}</b>
                    </span>
                    <span
                      className={clsx(styles.resultAvatar, player.avatar && styles.avatarImage)}
                      style={avatarStyle}
                    >
                      {!player.avatar && getAvatarFallback(player)}
                    </span>
                    <span className={styles.playerMeta}>
                      <strong>{player.nickname}</strong>
                      <small>{getRankTitle(player.rank)}</small>
                    </span>
                    {player.isOwner && <em>房主</em>}
                    <span className={styles.playerScoreValue}>{player.score}分</span>
                  </button>
                );
              })}
            </div>
          </section>

          <ScoreDetailPanel key={selectedPlayer.id} player={selectedDetail} loading={loading || detailLoading} />
        </div>

        <section className={styles.highlightPanel} aria-label="本局精彩回顾">
          <h3>
            <span />
            本局精彩回顾
            <span />
          </h3>
          <div className={styles.highlightList}>
            {data.highlights.map(item => (
              <article className={styles.highlightItem} key={item.id}>
                <span className={styles.highlightIcon}>{getHighlightIcon(item)}</span>
                <div>
                  <strong>{item.name}</strong>
                  <p>
                    <em>{item.value}</em>
                    {item.unit}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.actionRow}>
            <button className={clsx(styles.actionButton, styles.blueButton)} type="button" onClick={onBackLobby}>
              <Home size={34} fill="currentColor" />
              返回大厅
            </button>
            <button className={clsx(styles.actionButton, styles.blueButton)} type="button" onClick={onReplay}>
              <RotateCcw size={34} />
              再来一局
            </button>
            <button className={clsx(styles.actionButton, styles.goldButton)} type="button" onClick={onShare}>
              <Share2 size={34} />
              分享战绩
            </button>
            <button
              className={clsx(styles.actionButton, styles.greenButton)}
              type="button"
              onClick={handleSave}
              disabled={saving}
            >
              <Download size={34} />
              {saving ? '保存中' : '保存战绩'}
            </button>
          </div>

          <label className={styles.autoSave}>
            <input
              type="checkbox"
              checked={autoSave}
              onChange={event => setAutoSave(event.target.checked)}
            />
            <span>
              <Check size={22} strokeWidth={3.2} />
            </span>
            自动保存本局战绩（可在历史记录中查看）
          </label>
        </footer>

        <Sparkles className={styles.sparkleTop} size={28} fill="currentColor" />
        <Sparkles className={styles.sparkleBottom} size={22} fill="currentColor" />
      </section>
    </div>
  );
}
