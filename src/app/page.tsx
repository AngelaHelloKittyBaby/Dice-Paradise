'use client';

import { useState, type CSSProperties, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
  Anchor,
  Bot,
  CalendarCheck,
  Crown,
  Dice5,
  Gift,
  Home,
  Palette,
  Rocket,
  Settings,
  Sparkles,
  Trophy,
  User,
  Volume2,
} from 'lucide-react';
import lobbyBackground from '@/assets/images/backgrounds/lobby/lobby-bg.png';
import activeBackground from '@/assets/images/ui/buttons/active.png';
import beganGameBackground from '@/assets/images/ui/buttons/begangame.png';
import beganRebotBackground from '@/assets/images/ui/buttons/beganrebot.png';
import beganRoomBackground from '@/assets/images/ui/buttons/beganroom.png';
import defaultAvatar from '@/assets/images/avatars/default-player.png';
import { LobbyAmbientEffects, ResponsiveStage } from '@/components/layout';
import { GameChat, StarIcon, type GameChatMessage } from '@/components/ui';
import { usePlayerStore } from '@/stores';
import styles from './home-lobby.module.css';

interface ActionCard {
  title: string;
  subtitle: string;
  href: string;
  modifier: string;
  icon: LucideIcon;
  backgroundImage: string;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  icon: LucideIcon;
}

interface DailyTask {
  title: string;
  progress: string;
  reward: string;
  action: string;
  icon: LucideIcon;
  iconTone: string;
}

const actionCards: ActionCard[] = [
  {
    title: '开始游戏',
    subtitle: '快速匹配对手',
    href: '/game?mode=single',
    modifier: styles.startGame,
    icon: Anchor,
    backgroundImage: beganGameBackground.src,
  },
  {
    title: '开房间',
    subtitle: '邀请好友一起玩',
    href: '/room',
    modifier: styles.createRoom,
    icon: Home,
    backgroundImage: beganRoomBackground.src,
  },
  {
    title: '人机对战',
    subtitle: '挑战AI，提升技巧',
    href: '/game?mode=ai',
    modifier: styles.botBattle,
    icon: Bot,
    backgroundImage: beganRebotBackground.src,
  },
  {
    title: '活动',
    subtitle: '精彩活动进行中',
    href: '/activity',
    modifier: styles.events,
    icon: Gift,
    backgroundImage: activeBackground.src,
  },
];

const leaderboardEntries: LeaderboardEntry[] = [
  { rank: 1, name: '乐乐玩家', score: 12560, icon: Dice5 },
  { rank: 2, name: 'AI机器人', score: 9860, icon: Bot },
  { rank: 3, name: '小可爱', score: 8650, icon: User },
];

const dailyTasks: DailyTask[] = [
  {
    title: '登录游戏',
    progress: '1/1',
    reward: 'x200',
    action: '领取',
    icon: CalendarCheck,
    iconTone: styles.taskIconGold,
  },
  {
    title: '完成1局对战',
    progress: '0/1',
    reward: 'x300',
    action: '去完成',
    icon: Dice5,
    iconTone: styles.taskIconBlue,
  },
  {
    title: '累计投掷骰子20次',
    progress: '8/20',
    reward: 'x200',
    action: '去完成',
    icon: Rocket,
    iconTone: styles.taskIconPurple,
  },
  {
    title: '获得1次胜利',
    progress: '0/1',
    reward: 'x500',
    action: '去完成',
    icon: Trophy,
    iconTone: styles.taskIconGreen,
  },
];

const chatMessages: GameChatMessage[] = [
  { id: 'home-system-1', type: 'system', author: '系统消息', text: '排行榜奖励将在今晚 22:00 结算。' },
  { id: 'home-system-2', type: 'system', author: '系统消息', text: '每日任务已刷新，记得领取奖励。' },
  { id: 'home-player-1', type: 'player', author: '骰子达人', text: '刚刚开了房间，等两位一起上船。' },
  { id: 'home-player-2', type: 'player', author: '海风轻语', text: '大家好呀~' },
  { id: 'home-player-3', type: 'player', author: '阳光骰童', text: '这局太刺激了！' },
  { id: 'home-player-4', type: 'player', author: '幸运星', text: '一起开黑吗？' },
  { id: 'home-player-5', type: 'player', author: '乐乐玩家', text: '谁来挑战人机模式？' },
  { id: 'home-player-6', type: 'player', author: '小蓝骰', text: '我差一个快艇就能翻盘。' },
];

function getProgressWidth(progress: string): string {
  if (progress === '1/1') return '100%';
  if (progress === '8/20') return '40%';
  return '8%';
}

export default function HomePage() {
  const router = useRouter();
  const player = usePlayerStore(state => state.player);
  const isLoggedIn = usePlayerStore(state => state.isLoggedIn);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);

  const playerName = player?.name ?? '乐乐玩家';
  const playerLevel = player?.level ?? 28;
  const playerStars = player?.gems ?? 12560;
  const topStars = player?.coins ?? 23560;
  const hasUserSession = Boolean(isLoggedIn && player);
  const playerAvatar = hasUserSession && player?.avatar ? player.avatar : defaultAvatar.src;

  const handlePlayerProfileClick = () => {
    if (hasUserSession) {
      router.push('/profile');
      return;
    }

    setIsAuthPromptOpen(true);
  };

  const handlePlayerProfileKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    handlePlayerProfileClick();
  };

  const handleAuthPromptLogin = () => {
    router.push('/login?mode=login');
  };

  const handleAuthPromptRegister = () => {
    router.push('/login?mode=register');
  };

  return (
    <ResponsiveStage
      className={styles.gameLobbyPage}
      viewportClassName={styles.lobbyViewport}
      stageClassName={styles.lobbyStage}
      backgroundImage={lobbyBackground.src}
    >
      <LobbyAmbientEffects />

      <header className={styles.lobbyHeader}>
        <section
          className={styles.playerProfile}
          aria-label="用户信息栏，点击打开个人中心"
          role="button"
          tabIndex={0}
          onClick={handlePlayerProfileClick}
          onKeyDown={handlePlayerProfileKeyDown}
        >
          <span
            className={styles.avatarSlot}
            aria-label={`${playerName}头像`}
            style={{ backgroundImage: `url(${playerAvatar})` }}
          />
          <div className={styles.playerInfo}>
            <div className={styles.playerNameRow}>
              <h1 className={styles.playerName}>{playerName}</h1>
              <div className={styles.vipBadgeSlot} aria-label="VIP 等级标识">
                VIP4
              </div>
            </div>
            <div className={styles.playerMeta}>
              <span>Lv.{playerLevel}</span>
              <span className={styles.playerStars}>
                <StarIcon size={15} />
                {playerStars.toLocaleString()}
              </span>
            </div>
            <div className={styles.levelTrack} aria-hidden="true">
              <span style={{ width: '62%' }} />
            </div>
          </div>
        </section>

        <div className={styles.headerNotice}>
          <Volume2 size={19} fill="currentColor" />
          <span>恭喜 幸运星 在高级宝箱中获得 传说骰子</span>
        </div>

        <section className={styles.headerTools} aria-label="顶部工具栏">
          <div className={styles.currencyPill}>
            <span className={styles.rewardIconSlot} aria-hidden="true">
              <StarIcon size={25} />
            </span>
            <strong>{topStars.toLocaleString()}</strong>
          </div>
          <button className={styles.toolButton} type="button" aria-label="设置">
            <Settings size={30} />
          </button>
        </section>
      </header>

      {isAuthPromptOpen && (
        <div
          className={styles.authPromptOverlay}
          role="presentation"
          onClick={() => setIsAuthPromptOpen(false)}
        >
          <section
            className={styles.authPromptDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-prompt-title"
            onClick={event => event.stopPropagation()}
          >
            <h2 id="auth-prompt-title">请先登录</h2>
            <p>登录或注册后可以查看个人中心、保存战绩和同步奖励。</p>
            <div className={styles.authPromptActions}>
              <button type="button" onClick={handleAuthPromptLogin}>
                登录账号
              </button>
              <button type="button" onClick={handleAuthPromptRegister}>
                注册账号
              </button>
              <button type="button" onClick={() => setIsAuthPromptOpen(false)}>
                暂不登录
              </button>
            </div>
          </section>
        </div>
      )}

      <aside className={styles.leftSidebar} aria-label="排行榜">
        <section className={`${styles.sidePanel} ${styles.leaderboardPanel}`}>
          <div className={styles.panelHeader}>
            <h2>排行榜</h2>
            <Link href="/leaderboard">更多</Link>
          </div>
          <ol className={styles.leaderboardList}>
            {leaderboardEntries.map(entry => {
              const EntryIcon = entry.icon;

              return (
                <li key={entry.rank} className={styles.leaderboardItem}>
                  <span className={styles.rankBadge}>{entry.rank}</span>
                  <span className={styles.miniAvatarSlot} aria-hidden="true">
                    <EntryIcon size={25} strokeWidth={2.6} />
                  </span>
                  <span className={styles.entryName}>{entry.name}</span>
                  <span className={styles.entryScore}>
                    <StarIcon size={14} />
                    {entry.score}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </aside>

      <section className={styles.mainActions} aria-label="主要功能按钮区域">
        {actionCards.map(card => {
          const Icon = card.icon;
          const actionCardStyle = {
            '--action-bg': `url(${card.backgroundImage})`,
          } as CSSProperties;

          return (
            <Link
              key={card.title}
              href={card.href}
              className={`${styles.actionCard} ${card.modifier}`}
              style={actionCardStyle}
            >
              <span className={styles.primaryTag}>主按钮</span>
              <div className={styles.actionCopy}>
                <h2>{card.title}</h2>
                <p>{card.subtitle}</p>
              </div>
              <span className={styles.actionIconSlot} aria-hidden="true">
                <Icon size={38} strokeWidth={2.7} />
              </span>
            </Link>
          );
        })}
      </section>

      <aside className={styles.dailyTasks} aria-label="每日任务列表">
        <div className={styles.panelHeader}>
          <h2>每日任务</h2>
          <Link href="/activity">更多</Link>
        </div>
        <ul className={styles.taskList}>
          {dailyTasks.map(task => {
            const TaskIcon = task.icon;

            return (
              <li key={task.title} className={styles.taskItem}>
                <span className={`${styles.taskIconSlot} ${task.iconTone}`} aria-hidden="true">
                  <TaskIcon size={24} strokeWidth={2.8} />
                </span>
                <div className={styles.taskContent}>
                  <div className={styles.taskTitleRow}>
                    <strong>{task.title}</strong>
                    <span>
                      <span className={styles.rewardIconSlot} aria-hidden="true">
                        <StarIcon size={14} />
                      </span>
                      {task.reward}
                    </span>
                  </div>
                  <div className={styles.taskProgress}>
                    <span style={{ width: getProgressWidth(task.progress) }} />
                  </div>
                  <small>{task.progress}</small>
                </div>
                <button className={styles.taskAction} type="button">
                  {task.action}
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <GameChat
        className={styles.chatDock}
        ariaLabel="聊天窗口"
        messages={chatMessages}
        currentUserName={playerName}
        currentUserAvatar={playerAvatar}
        defaultHeight={196}
        minHeight={170}
        maxHeight={340}
      />

      <button className={styles.customizeButton} type="button">
        <span className={styles.actionIconSlot} aria-hidden="true">
          <Palette size={32} strokeWidth={2.5} />
          <Sparkles size={15} strokeWidth={3} />
        </span>
        个性化
      </button>
    </ResponsiveStage>
  );
}
