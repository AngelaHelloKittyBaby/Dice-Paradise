'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bot,
  Dice5,
  DoorOpen,
  Info,
  LockKeyhole,
  Speaker,
  VolumeX,
} from 'lucide-react';
import { GameResultModal, GameRulesModal } from '@/components/game';
import { ResponsiveStage } from '@/components/layout';
import { GameChat, StarIcon, type GameChatMessage } from '@/components/ui';
import { CATEGORY_NAMES, MAX_ROLLS_PER_TURN, SCORE_CATEGORIES } from '@/constants/gameRules';
import gameBackground from '@/assets/images/backgrounds/game/game-bg.png';
import { usePlayerStore, useRoomStore } from '@/stores';
import type { DiceValue, ScoreCategory } from '@/types/game';
import type { GameResultData } from '@/types/gameResult';
import {
  calculateGrandTotal,
  calculateLowerTotal,
  calculateScore,
  calculateUpperBonus,
  calculateUpperSubtotal,
  getPossibleScores,
} from '@/utils/scoreCalculator';
import styles from './game.module.css';

interface GamePlayer {
  id: string;
  name: string;
  score: number;
  isHost?: boolean;
  avatarClass: string;
  avatarLabel: string;
}

interface GameEventItem {
  id: string;
  text: string;
  score?: string;
}

interface RollDicePayload {
  roomId: string;
  playerId: string;
  dice: DiceValue[];
  locked: boolean[];
}

interface SelectScorePayload {
  roomId: string;
  playerId: string;
  category: ScoreCategory;
  dice: DiceValue[];
  locked: boolean[];
}

const initialDice: DiceValue[] = [1, 1, 1, 1, 1];
const initialLocked = [false, false, false, false, false];

const avatarClasses = [
  styles.avatarCaptain,
  styles.avatarBot,
  styles.avatarCute,
  styles.avatarLucky,
  styles.avatarGreen,
  styles.avatarPurple,
];

const defaultGameEvents: GameEventItem[] = [
  { id: 'event-1', text: '本局开始，等待玩家首次投骰。' },
  { id: 'event-2', text: '每回合最多 3 次投掷，可以保留想要的骰子。' },
  { id: 'event-3', text: '投骰后选择一个计分项，本项得分会加入总分。' },
];

function delay(ms: number) {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms);
  });
}

function randomDiceValue(): DiceValue {
  return (Math.floor(Math.random() * 6) + 1) as DiceValue;
}

async function mockRollDice(payload: RollDicePayload): Promise<DiceValue[]> {
  await delay(760);

  return payload.dice.map((value, index) => (payload.locked[index] ? value : randomDiceValue()));
}

async function mockSyncLockedDice(payload: RollDicePayload): Promise<boolean[]> {
  await delay(120);
  return payload.locked;
}

async function mockSelectScore(payload: SelectScorePayload): Promise<number> {
  await delay(240);
  return calculateScore(payload.dice, payload.category);
}

function formatDiceValues(values: DiceValue[]) {
  return values.map(value => `${value}点`).join('、');
}

function getBestPossibleScore(possibleScores: Partial<Record<ScoreCategory, number>>) {
  return Object.entries(possibleScores).reduce<{ category: ScoreCategory; score: number } | null>(
    (best, [category, score]) => {
      if (score === undefined) return best;
      if (!best || score > best.score) {
        return { category: category as ScoreCategory, score };
      }

      return best;
    },
    null
  );
}

function getUpperBonusAward(
  previousScores: Partial<Record<ScoreCategory, number>>,
  nextScores: Partial<Record<ScoreCategory, number>>
) {
  const previousBonus = calculateUpperBonus(calculateUpperSubtotal(previousScores));
  const nextBonus = calculateUpperBonus(calculateUpperSubtotal(nextScores));

  return Math.max(0, nextBonus - previousBonus);
}

async function mockFetchGameEvents(
  roomId: string,
  playerName: string,
  rolledDice: DiceValue[],
  nextPossibleScores: Partial<Record<ScoreCategory, number>>,
  nextRollsLeft: number
): Promise<GameEventItem[]> {
  await delay(120);

  const bestScore = getBestPossibleScore(nextPossibleScores);
  const bestScoreEvent = bestScore
    ? {
        id: `${roomId}-best`,
        text: `${CATEGORY_NAMES[bestScore.category]} 当前可得 ${bestScore.score} 分，可以选择计分或继续重掷。`,
        score: `+${bestScore.score}`,
      }
    : {
        id: `${roomId}-best`,
        text: '当前没有更高的组合项，可以考虑保留骰子后继续重掷。',
      };

  return [
    { id: `${roomId}-roll`, text: `${playerName} 掷出了 ${formatDiceValues(rolledDice)}。`, score: `剩余 ${nextRollsLeft} 次` },
    bestScoreEvent,
    { id: `${roomId}-lock`, text: '已保留的骰子本回合会固定，其余骰子可继续重掷。' },
    { id: `${roomId}-tip`, text: '小顺子需要连续 4 个点数，大顺子需要连续 5 个点数。' },
  ];
}

function getDiceDots(value: DiceValue) {
  const dotMap: Record<DiceValue, number[]> = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };

  return Array.from({ length: 9 }, (_, index) => dotMap[value].includes(index));
}

function getCategoryHint(category: ScoreCategory) {
  const hints: Record<ScoreCategory, string> = {
    ones: '所有 1 点相加',
    twos: '所有 2 点相加',
    threes: '所有 3 点相加',
    fours: '所有 4 点相加',
    fives: '所有 5 点相加',
    sixes: '所有 6 点相加',
    threeOfAKind: '至少三颗相同，计总点数',
    fourOfAKind: '至少四颗相同，计总点数',
    fullHouse: '三颗相同 + 两颗相同，25 分',
    smallStraight: '连续四个点数，30 分',
    largeStraight: '连续五个点数，40 分',
    yacht: '五颗全部相同，50 分',
    chance: '任意组合，计总点数',
  };

  return hints[category];
}

function getCategoryIcon(category: ScoreCategory) {
  const icons: Record<ScoreCategory, string> = {
    ones: '⚀',
    twos: '⚁',
    threes: '⚂',
    fours: '⚃',
    fives: '⚄',
    sixes: '⚅',
    threeOfAKind: '🔷',
    fourOfAKind: '💠',
    fullHouse: '🏠',
    smallStraight: '🌈',
    largeStraight: '🚀',
    yacht: '⛵',
    chance: '☘️',
  };

  return icons[category];
}

function PlayerCard({ player }: { player: GamePlayer }) {
  return (
    <article className={styles.playerCard}>
      <div className={styles.rankBadge}>{player.score > 0 ? '★' : player.avatarLabel}</div>
      <div className={`${styles.playerAvatar} ${player.avatarClass}`}>{player.avatarLabel}</div>
      <div className={styles.playerInfo}>
        <div className={styles.playerNameRow}>
          <strong>{player.name}</strong>
          {player.isHost && <span>房主</span>}
        </div>
        <div className={styles.playerScore}>
          <StarIcon size={21} />
          {player.score.toLocaleString()}
        </div>
      </div>
    </article>
  );
}

function DiceFace({
  value,
  locked,
  rolling,
  index,
  onToggle,
}: {
  value: DiceValue;
  locked: boolean;
  rolling: boolean;
  index: number;
  onToggle: () => void;
}) {
  const dots = getDiceDots(value);

  return (
    <div className={styles.diceSlot}>
      <button
        type="button"
        className={`${styles.diceFace} ${rolling && !locked ? styles.diceFaceRolling : ''} ${
          locked ? styles.diceFaceLocked : ''
        }`}
        style={{ '--dice-index': index } as CSSProperties}
        onClick={onToggle}
        aria-pressed={locked}
        aria-label={`骰子 ${index + 1}，当前 ${value} 点，${locked ? '已锁定' : '未锁定'}`}
      >
        {dots.map((active, dotIndex) => (
          <span key={dotIndex} className={active ? styles.dotActive : undefined} />
        ))}
      </button>
      <button type="button" onClick={onToggle} className={locked ? styles.keepButtonActive : undefined}>
        <LockKeyhole size={17} />
        {locked ? '已保留' : '保留'}
      </button>
    </div>
  );
}

export default function GamePage() {
  const router = useRouter();
  const player = usePlayerStore(state => state.player);
  const currentRoom = useRoomStore(state => state.currentRoom);
  const [queryState, setQueryState] = useState<{ mode: string; roomId: string | null }>({
    mode: 'room',
    roomId: null,
  });
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [dice, setDice] = useState<DiceValue[]>(initialDice);
  const [locked, setLocked] = useState<boolean[]>(initialLocked);
  const [rollsLeft, setRollsLeft] = useState(MAX_ROLLS_PER_TURN);
  const [isRolling, setIsRolling] = useState(false);
  const [possibleScores, setPossibleScores] = useState<Partial<Record<ScoreCategory, number>>>({});
  const [completedCategories, setCompletedCategories] = useState<ScoreCategory[]>([]);
  const [playerScores, setPlayerScores] = useState<Partial<Record<ScoreCategory, number>>>({});
  const [gameEvents, setGameEvents] = useState<GameEventItem[]>(defaultGameEvents);
  const rollingGuardRef = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQueryState({
      mode: params.get('mode') ?? 'room',
      roomId: params.get('roomId'),
    });
  }, []);

  const mode = queryState.mode;
  const roomId = queryState.roomId ?? currentRoom?.id ?? (mode === 'single' ? '单人练习' : '876643');
  const currentPlayerId = player?.id ?? 'player-001';
  const currentPlayerName = player?.name ?? '乐乐玩家';
  const isSingleMode = mode === 'single' && !queryState.roomId;
  const isRoomGame = Boolean(queryState.roomId && currentRoom);
  const showChat = isRoomGame;
  const gameChatMessages = useMemo<GameChatMessage[]>(
    () => [
      { id: 'game-system-start', type: 'system', author: '系统消息', text: `房间 ${roomId} 对局已开始。` },
      { id: 'game-player-hello', type: 'player', author: currentPlayerName, avatar: player?.avatar, text: '大家好运~' },
      { id: 'game-system-tip', type: 'system', author: '系统消息', text: '投骰后请选择一个计分项完成本回合。' },
    ],
    [currentPlayerName, player?.avatar, roomId]
  );

  const players = useMemo<GamePlayer[]>(() => {
    if (isRoomGame && currentRoom) {
      return currentRoom.members.map((member, index) => ({
        id: member.playerId,
        name: member.name,
        score: 0,
        isHost: member.isHost,
        avatarClass: avatarClasses[index % avatarClasses.length],
        avatarLabel: member.isHost ? '🎲' : `${index + 1}`,
      }));
    }

    if (mode === 'ai') {
      return [
        {
          id: currentPlayerId,
          name: currentPlayerName,
          score: 0,
          isHost: true,
          avatarClass: styles.avatarCaptain,
          avatarLabel: '🎲',
        },
        {
          id: 'ai-001',
          name: 'AI机器人',
          score: 0,
          avatarClass: styles.avatarBot,
          avatarLabel: 'AI',
        },
      ];
    }

    return [
      {
        id: currentPlayerId,
        name: currentPlayerName,
        score: calculateGrandTotal(playerScores),
        isHost: true,
        avatarClass: styles.avatarCaptain,
        avatarLabel: '🎲',
      },
    ];
  }, [currentPlayerId, currentPlayerName, currentRoom, isRoomGame, mode, playerScores]);

  const currentUpperScore = calculateUpperSubtotal(playerScores);
  const currentUpperBonus = calculateUpperBonus(currentUpperScore);
  const currentLowerScore = calculateLowerTotal(playerScores);
  const currentTotalScore = calculateGrandTotal(playerScores);

  const gameResultData = useMemo<GameResultData>(() => {
    const resultPlayers = players.map((item, index) => ({
      id: index + 1,
      nickname: item.name,
      avatar: '',
      score: item.id === currentPlayerId ? currentTotalScore : item.score,
      isOwner: item.id === currentPlayerId,
      rank: 0,
    }));

    const rankedPlayers = [...resultPlayers]
      .sort((first, second) => second.score - first.score)
      .map((item, index) => ({ ...item, rank: index + 1 }));

    const currentDetail = {
      upperScore: currentUpperScore,
      bonusScore: currentUpperBonus,
      upperTotal: currentUpperScore + currentUpperBonus,
      lowerScore: currentLowerScore,
      extraReward: 0,
      extraBonus: currentUpperBonus,
      totalScore: currentTotalScore,
    };

    const playerDetails = Object.fromEntries(
      rankedPlayers.map(item => [
        item.id,
        item.isOwner
          ? currentDetail
          : {
              upperScore: 0,
              bonusScore: 0,
              upperTotal: 0,
              lowerScore: item.score,
              extraReward: 0,
              extraBonus: 0,
              totalScore: item.score,
            },
      ])
    );

    const bestRoundScore = Math.max(0, ...Object.values(playerScores).filter((value): value is number => typeof value === 'number'));

    return {
      players: rankedPlayers,
      playerDetails,
      highlights: [
        { id: 'yacht', icon: 'yacht', name: '快艇', value: playerScores.yacht === 50 ? 1 : 0, unit: '次' },
        { id: 'straight', icon: 'straight', name: '大顺子', value: (playerScores.largeStraight ?? 0) > 0 ? 1 : 0, unit: '次' },
        { id: 'four-kind', icon: 'fourKind', name: '四条', value: (playerScores.fourOfAKind ?? 0) > 0 ? 1 : 0, unit: '次' },
        { id: 'best-round', icon: 'bestRound', name: '最高单项', value: bestRoundScore, unit: '分' },
      ],
    };
  }, [
    currentLowerScore,
    currentPlayerId,
    currentTotalScore,
    currentUpperBonus,
    currentUpperScore,
    playerScores,
    players,
  ]);

  const scoreColumns = players.length.toString();
  const scoreTableStyle = { '--score-columns': scoreColumns } as CSSProperties;

  useEffect(() => {
    if (isSingleMode) {
      setGameEvents([{ id: 'single-start', text: '单人练习已开始，聊天功能不会显示。' }]);
    }
  }, [isSingleMode]);

  const toggleDieLock = async (index: number) => {
    if (rollsLeft >= MAX_ROLLS_PER_TURN || isRolling) return;

    const nextLocked = locked.map((value, valueIndex) => (valueIndex === index ? !value : value));
    setLocked(nextLocked);
    setGameEvents(prev => [
      {
        id: `lock-${index}-${Date.now()}`,
        text: `${currentPlayerName} ${nextLocked[index] ? '保留' : '取消保留'}第 ${index + 1} 颗骰子（${dice[index]}点）。`,
      },
      ...prev,
    ]);
    await mockSyncLockedDice({ roomId, playerId: currentPlayerId, dice, locked: nextLocked });
  };

  const handleRollDice = async () => {
    if (rollingGuardRef.current || isRolling || rollsLeft <= 0) return;

    rollingGuardRef.current = true;
    setIsRolling(true);

    try {
      const nextDice = await mockRollDice({ roomId, playerId: currentPlayerId, dice, locked });
      const nextRollsLeft = rollsLeft - 1;
      const nextPossibleScores = getPossibleScores(nextDice, completedCategories);

      setDice(nextDice);
      setRollsLeft(nextRollsLeft);
      setPossibleScores(nextPossibleScores);
      setGameEvents(await mockFetchGameEvents(roomId, currentPlayerName, nextDice, nextPossibleScores, nextRollsLeft));
    } finally {
      rollingGuardRef.current = false;
      setIsRolling(false);
    }
  };

  const handleSelectScore = async (category: ScoreCategory) => {
    if (completedCategories.includes(category) || rollsLeft === MAX_ROLLS_PER_TURN || isRolling) return;

    const score = await mockSelectScore({
      roomId,
      playerId: currentPlayerId,
      category,
      dice,
      locked,
    });

    const nextCompletedCategories = [...completedCategories, category];
    const nextPlayerScores = { ...playerScores, [category]: score };
    const upperBonusAward = getUpperBonusAward(playerScores, nextPlayerScores);
    const isGameComplete = nextCompletedCategories.length >= SCORE_CATEGORIES.length;
    const scoreEvents: GameEventItem[] = [
      {
        id: `${category}-${Date.now()}`,
        text: `${currentPlayerName} 选择「${CATEGORY_NAMES[category]}」计分，本项获得 ${score} 分。`,
        score: `+${score}`,
      },
    ];

    if (upperBonusAward > 0) {
      scoreEvents.push({
        id: `upper-bonus-${Date.now()}`,
        text: `${currentPlayerName} 上层数字区达到 63 分，触发达标奖励。`,
        score: `+${upperBonusAward}`,
      });
    }

    if (isGameComplete) {
      scoreEvents.push({
        id: `game-complete-${Date.now()}`,
        text: '所有计分项已填写，本局进入结算。',
        score: `${calculateGrandTotal(nextPlayerScores)}分`,
      });
    }

    setCompletedCategories(nextCompletedCategories);
    setPlayerScores(nextPlayerScores);
    setPossibleScores({});
    setRollsLeft(MAX_ROLLS_PER_TURN);
    setDice(initialDice);
    setLocked(initialLocked);
    setGameEvents(prev => [...scoreEvents, ...prev]);

    if (isGameComplete) {
      window.setTimeout(() => {
        setIsResultOpen(true);
      }, 420);
    }
  };

  return (
    <>
      <ResponsiveStage
        className={styles.gamePage}
        viewportClassName={styles.gameViewport}
        stageClassName={styles.gameStage}
        backgroundImage={gameBackground.src}
      >
        <header className={styles.topLayer}>
          <Link className={styles.logoArea} href="/" aria-label="返回投骰乐园首页">
            <span className={styles.logoDice}>🎲</span>
            <span>
              投骰乐园
              <small>DICE PARADISE</small>
            </span>
          </Link>

          <div className={styles.statusPill}>
            <strong>对局中</strong>
            <span>房间号：{roomId}</span>
          </div>

          <nav className={styles.topActions} aria-label="对局工具">
            <button type="button" onClick={() => setIsRulesOpen(true)}>
              <Info size={22} />
              规则说明
            </button>
            <button type="button" onClick={() => setIsSoundEnabled(value => !value)}>
              {isSoundEnabled ? <Speaker size={23} /> : <VolumeX size={23} />}
              {isSoundEnabled ? '音效开' : '音效关'}
            </button>
            <button className={styles.exitButton} type="button" onClick={() => router.push('/')}>
              <DoorOpen size={22} />
              退出本局
            </button>
          </nav>

          <Link className={styles.backLobbyButton} href="/">
            <ArrowLeft size={23} />
            返回大厅
          </Link>
        </header>

        <aside className={styles.playerPanel} aria-label="玩家列表">
          {players.map(item => (
            <PlayerCard key={item.id} player={item} />
          ))}
        </aside>

        <section className={styles.diceDock} aria-label="骰子操作区">
          <div className={styles.rollCounter}>
            <Dice5 size={23} />
            剩余投掷次数：<strong>{rollsLeft}</strong>
          </div>
          <div className={styles.diceRow}>
            {dice.map((value, index) => (
              <DiceFace
                key={index}
                value={value}
                locked={locked[index]}
                rolling={isRolling}
                index={index}
                onToggle={() => toggleDieLock(index)}
              />
            ))}
          </div>
          <button
            className={styles.rollButton}
            type="button"
            disabled={isRolling || rollsLeft <= 0}
            onClick={handleRollDice}
          >
            <Dice5 size={36} />
            {isRolling ? '投掷中' : rollsLeft === MAX_ROLLS_PER_TURN ? '投骰子' : '重掷骰子'}
          </button>
        </section>

        {showChat && (
          <GameChat
            className={styles.chatPanel}
            ariaLabel="聊天消息"
            messages={gameChatMessages}
            currentUserName={currentPlayerName}
            currentUserAvatar={player?.avatar}
            placeholder="说点什么..."
            defaultHeight={300}
            minHeight={220}
            maxHeight={430}
          />
        )}

        <aside className={styles.scorePanel} aria-label="计分表" style={scoreTableStyle}>
          <h2>
            快艇骰子计分表<span>（每回合选择一个空格计分）</span>
          </h2>
          <div className={styles.scoreHeader}>
            <span />
            {players.map(item => (
              <div key={item.id} className={styles.scorePlayer}>
                <div className={`${styles.scoreAvatar} ${item.avatarClass}`}>{item.avatarLabel}</div>
                <small>{item.name}</small>
              </div>
            ))}
          </div>
          <div className={styles.scoreBody}>
            {SCORE_CATEGORIES.map((row, index) => {
              const category = row.category;
              const score = playerScores[category];
              const possibleScore = possibleScores[category];
              const isCompleted = completedCategories.includes(category);
              const hasPossibleScore = possibleScore !== undefined;
              const disabled = isCompleted || rollsLeft === MAX_ROLLS_PER_TURN;

              return (
                <button
                  key={category}
                  type="button"
                  className={`${styles.scoreRow} ${!disabled ? styles.scoreRowSelectable : ''}`}
                  onClick={() => handleSelectScore(category)}
                  disabled={disabled}
                >
                  <div className={styles.ruleCell}>
                    {(index === 0 || SCORE_CATEGORIES[index - 1].category === 'sixes') && (
                      <span className={styles.sectionBadge}>{index <= 5 ? '上层' : '下层'}</span>
                    )}
                    <strong>
                      <span>{getCategoryIcon(category)}</span>
                      {row.nameZh}
                    </strong>
                    <small>（{getCategoryHint(category)}）</small>
                  </div>
                  {players.map((item, playerIndex) => (
                    <span
                      key={item.id}
                      className={`${styles.scoreValue} ${
                        playerIndex === 0 && isCompleted ? styles.scoreValueFilled : ''
                      } ${playerIndex === 0 && !isCompleted && hasPossibleScore ? styles.scoreValuePossible : ''}`}
                    >
                      {playerIndex === 0 ? score ?? possibleScore ?? '-' : '-'}
                    </span>
                  ))}
                </button>
              );
            })}
            <div className={styles.scoreRow}>
              <div className={styles.ruleCell}>
                <span className={styles.sectionBadge}>总分</span>
                <strong>⭐ 当前总分</strong>
              </div>
              {players.map((item, playerIndex) => (
                <span key={item.id} className={styles.scoreValue}>
                  {playerIndex === 0 ? calculateGrandTotal(playerScores) : '-'}
                </span>
              ))}
            </div>
          </div>
        </aside>

        <aside className={styles.eventPanel} aria-label="本局事件">
          <h2>本局事件</h2>
          <ul>
            {gameEvents.map(item => (
              <li key={item.id}>
                <span>{item.text}</span>
                {item.score && <em>{item.score}</em>}
              </li>
            ))}
          </ul>
        </aside>

        <GameRulesModal open={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      </ResponsiveStage>

      <GameResultModal
        open={isResultOpen}
        result={gameResultData}
        onClose={() => setIsResultOpen(false)}
        onBackLobby={() => router.push('/')}
        onReplay={() => setIsResultOpen(false)}
        onShare={() => undefined}
        onSave={() => undefined}
      />
    </>
  );
}
