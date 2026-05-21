'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Info, Plus, Settings, Speaker, UserPlus, VolumeX, X } from 'lucide-react';
import { GameRulesModal } from '@/components/game';
import { ResponsiveStage } from '@/components/layout';
import { GameChat, StarIcon, type GameChatMessage } from '@/components/ui';
import roomBackground from '@/assets/images/backgrounds/room/room-bg.png';
import defaultAvatar from '@/assets/images/avatars/default-player.png';
import { useRoomStore } from '@/stores';
import type { Room, RoomMember } from '@/types/room';
import styles from './room.module.css';

const chatMessages: GameChatMessage[] = [
  { id: 'room-system-1', type: 'system', author: '系统消息', text: '房间已创建，等待玩家加入。' },
  { id: 'room-system-2', type: 'system', author: '系统消息', text: '房主可以在玩家准备后开始游戏。' },
  { id: 'room-player-1', type: 'player', author: '小可爱', avatar: defaultAvatar.src, text: '冲鸭！' },
  { id: 'room-player-2', type: 'player', author: '幸运星', avatar: defaultAvatar.src, text: '加油加油！' },
  { id: 'room-player-3', type: 'player', author: '乐乐玩家', avatar: defaultAvatar.src, text: '大家好运~' },
];

const fallbackMembers: RoomMember[] = [
  {
    playerId: 'player-001',
    name: '投骰大师',
    avatar: '',
    isHost: true,
    isReady: true,
    joinedAt: new Date().toISOString(),
  },
];

const CURRENT_PLAYER_ID = 'player-001';
const ROOM_SLOT_COUNT = 4;

const avatarTones = [
  styles.avatarBlue,
  styles.avatarGreen,
  styles.avatarOrange,
  styles.avatarPurple,
  styles.avatarPink,
  styles.avatarCyan,
];

const getMemberAvatar = (avatar?: string) => avatar || defaultAvatar.src;

async function mockStartRoomGame(room: Room | null): Promise<boolean> {
  await new Promise(resolve => {
    window.setTimeout(resolve, 180);
  });

  return Boolean(room);
}

export default function RoomPage() {
  const router = useRouter();
  const currentRoom = useRoomStore(state => state.currentRoom);
  const isHost = useRoomStore(state => state.isHost);
  const startGame = useRoomStore(state => state.startGame);
  const leaveRoom = useRoomStore(state => state.leaveRoom);
  const toggleReady = useRoomStore(state => state.toggleReady);
  const updateRoomMembers = useRoomStore(state => state.updateRoomMembers);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  const roomId = currentRoom?.id ?? '等待接口返回';
  const members = useMemo(() => currentRoom?.members ?? fallbackMembers, [currentRoom?.members]);
  const orderedMembers = useMemo(() => {
    const hostMember = members.find(member => member.isHost) ?? members[0];
    const otherMembers = members.filter(member => member.playerId !== hostMember?.playerId);

    return [hostMember, ...otherMembers].filter(Boolean).slice(0, ROOM_SLOT_COUNT) as RoomMember[];
  }, [members]);
  const roomSlots = useMemo(
    () => Array.from({ length: ROOM_SLOT_COUNT }, (_, index) => orderedMembers[index] ?? null),
    [orderedMembers]
  );
  const currentPlayerMember = members.find(member => member.playerId === CURRENT_PLAYER_ID);
  const isCurrentPlayerReady = Boolean(currentPlayerMember?.isReady);

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard?.writeText(roomId);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1400);
    } catch {
      setIsCopied(false);
    }
  };

  const handleStartGame = async () => {
    if (!isHost) return;

    const canStart = startGame();
    if (!canStart) return;

    const canEnterGame = await mockStartRoomGame(currentRoom);
    if (canEnterGame) {
      router.push(`/game?roomId=${roomId}`);
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    router.push('/');
  };

  const handleRemovePlayer = (playerId: string) => {
    if (!isHost || !currentRoom) return;

    updateRoomMembers(currentRoom.members.filter(member => member.playerId !== playerId));
  };

  const handleReadyToggle = () => {
    if (isHost) return;
    toggleReady();
  };

  return (
    <ResponsiveStage
      className={styles.roomPage}
      viewportClassName={styles.roomViewport}
      stageClassName={styles.roomStage}
      backgroundImage={roomBackground.src}
    >
      <header className={styles.roomHeader}>
        <section className={styles.headerLeft} aria-label="房间导航">
          <Link className={styles.logoArea} href="/">
            <span className={styles.logoIconSlot} aria-hidden="true">
              🎲
            </span>
            <span className={styles.logoText}>
              投骰乐园
              <small>DICE PARADISE</small>
            </span>
          </Link>
          <Link className={styles.backLobbyButton} href="/">
            <ArrowLeft size={22} strokeWidth={3} />
            返回大厅
          </Link>
        </section>

        <section className={styles.headerRight} aria-label="房间工具栏">
          <button className={`${styles.toolButton} ${styles.ruleButton}`} type="button" onClick={() => setIsRulesOpen(true)}>
            <Info size={21} />
            <span>规则说明</span>
          </button>
          <button className={`${styles.toolButton} ${styles.soundButton}`} type="button" onClick={() => setIsSoundEnabled(value => !value)}>
            {isSoundEnabled ? <Speaker size={22} /> : <VolumeX size={22} />}
            <span>{isSoundEnabled ? '音效开' : '音效关'}</span>
          </button>
          <button className={`${styles.toolButton} ${styles.settingsButton}`} type="button" aria-label="设置">
            <Settings size={24} />
          </button>
          <button className={styles.dismissButton} type="button" onClick={handleLeaveRoom}>
            {isHost ? '解散房间' : '退出房间'}
          </button>
        </section>
      </header>

      <section className={styles.roomNumberBadge} aria-label="房间号">
        <span>房间号：{roomId}</span>
        <button className={styles.copyButton} type="button" onClick={handleCopyRoomId} aria-label="复制房间号">
          <Copy size={20} strokeWidth={2.8} />
        </button>
        {isCopied && <em>已复制</em>}
      </section>

      <section className={styles.roomTableArea} aria-label="房间桌面区域">
        <div className={styles.tableDiceSlot} aria-label="桌面骰子预留位置" />
        <div className={styles.tableHelmSlot} aria-label="桌面船舵预留位置" />
      </section>

      <section className={styles.playerCards} aria-label="玩家卡片">
        {roomSlots.map((member, index) => {
          const statusLabel = member?.isHost ? '房主' : member?.isReady ? '已准备 ✅' : '未准备';
          const isEmptySlot = !member;

          return (
            <article
              key={member?.playerId ?? `empty-room-slot-${index}`}
              className={`${styles.playerCard} ${isEmptySlot ? styles.emptyPlayerCard : styles.occupiedPlayerCard}`}
            >
              <span className={styles.slotIcon} aria-hidden="true">
                <UserPlus size={28} strokeWidth={2.6} />
              </span>

              {member && isHost && !member.isHost && (
                <button
                  className={styles.removePlayerButton}
                  type="button"
                  onClick={() => handleRemovePlayer(member.playerId)}
                  aria-label={`移除 ${member.name}`}
                >
                  <X size={18} strokeWidth={3} />
                  移除玩家
                </button>
              )}

              {member ? (
                <>
                  <div className={`${styles.avatarFrame} ${avatarTones[index % avatarTones.length]}`}>
                    <span
                      className={styles.avatarSlot}
                      aria-label={`${member.name} 头像`}
                      style={{ backgroundImage: `url(${getMemberAvatar(member.avatar)})` }}
                    />
                  </div>
                  <div className={styles.playerContent}>
                    <div className={styles.playerNameRow}>
                      <h2>{member.name}</h2>
                      <span
                        className={`${styles.statusBadge} ${
                          member.isHost ? styles.hostBadge : member.isReady ? styles.readyBadge : styles.waitingBadge
                        }`}
                      >
                        {statusLabel}
                      </span>
                    </div>
                    <div className={styles.starRow}>
                      <StarIcon size={28} />
                      <strong>{(12600 - index * 1360).toLocaleString()}</strong>
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.emptySlotContent}>
                  <Plus size={86} strokeWidth={4.2} />
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section className={styles.hostPrompt} aria-label="房主开始游戏提示">
        <div className={styles.promptText}>
          <strong>{isHost ? '房主可以开始游戏' : isCurrentPlayerReady ? '你已准备，等待房主开始' : '点击准备加入对局'}</strong>
          <p>
            当前 <span>{members.length}</span> 人在房间中
          </p>
        </div>
        {isHost ? (
          <button className={styles.startGameButton} type="button" onClick={handleStartGame}>
            开始游戏
          </button>
        ) : (
          <button
            className={`${styles.startGameButton} ${styles.readyActionButton} ${
              isCurrentPlayerReady ? styles.readyActionButtonActive : ''
            }`}
            type="button"
            onClick={handleReadyToggle}
          >
            {isCurrentPlayerReady ? '已准备 ✅' : '准备'}
          </button>
        )}
      </section>

      <GameChat
        className={styles.chatPanel}
        ariaLabel="房间聊天框"
        messages={chatMessages}
        currentUserName={members[0]?.name ?? '乐乐玩家'}
        currentUserAvatar={getMemberAvatar(members[0]?.avatar)}
        defaultHeight={306}
        minHeight={220}
        maxHeight={430}
      />

      <GameRulesModal open={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </ResponsiveStage>
  );
}
