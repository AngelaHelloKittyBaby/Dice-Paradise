'use client';

import Image from 'next/image';
import { useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, RefreshCw, Users, X } from 'lucide-react';
import joinRoomBoardImage from '@/assets/images/ui/panels/joinroomboard.png';
import searchImage from '@/assets/images/ui/panels/search.png';
import defaultAvatar from '@/assets/images/avatars/default-player.png';
import type { RoomListItem } from '@/types/room';
import { CustomScrollbar } from './CustomScrollbar';
import { RoomListItemCard, type RoomData } from './RoomListItemCard';

interface JoinRoomModalProps {
  isOpen: boolean;
  joinRoomCode: string;
  roomNumberLabel: string[];
  isLoading?: boolean;
  isRoomListLoading?: boolean;
  error?: string | null;
  rooms?: RoomListItem[];
  onRoomCodeChange: (roomCode: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  onJoinRoom?: (roomCode: string) => void;
  onRefreshRooms?: () => void;
}

type AmbientParticleKind = 'star' | 'magic' | 'coin';

interface AmbientParticle {
  id: number;
  kind: AmbientParticleKind;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}

const ambientParticles: AmbientParticle[] = Array.from({ length: 44 }, (_, index) => {
  const kind: AmbientParticleKind = index % 11 === 0 ? 'coin' : index % 3 === 0 ? 'magic' : 'star';

  return {
    id: index,
    kind,
    x: 5 + ((index * 37) % 90),
    y: 8 + ((index * 53) % 84),
    size: kind === 'coin' ? 11 + (index % 3) * 3 : kind === 'magic' ? 5 + (index % 4) * 2 : 7 + (index % 5) * 2,
    delay: (index % 9) * 0.18,
    duration: 3.2 + (index % 6) * 0.45,
    drift: index % 2 === 0 ? 16 : -16,
  };
});

const backgroundStars = Array.from({ length: 36 }, (_, index) => ({
  id: index,
  x: 3 + ((index * 29) % 94),
  y: 4 + ((index * 47) % 90),
  size: 2 + (index % 4),
  delay: (index % 12) * 0.24,
}));

const buttonSparks = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  angle: index * 30,
  delay: (index % 6) * 0.06,
}));

export function JoinRoomModal({
  isOpen,
  joinRoomCode,
  roomNumberLabel,
  isLoading = false,
  isRoomListLoading = false,
  error,
  rooms = [],
  onRoomCodeChange,
  onClose,
  onSubmit,
  onJoinRoom,
  onRefreshRooms,
}: JoinRoomModalProps) {
  const [searchInputFocused, setSearchInputFocused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const displayedRooms: RoomData[] = rooms.map((room, index) => ({
    id: room.id,
    avatar: defaultAvatar.src,
    roomName: room.name,
    mode: 'online',
    tag: room.hostName || '小幸运',
    players: room.playerCount,
    maxPlayers: room.maxPlayers,
    isFull: room.playerCount >= room.maxPlayers,
    hasCrown: index === 0,
  }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const handleJoinRoom = (roomId: string) => {
    onJoinRoom?.(roomId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-[#070b28]"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            className="absolute inset-0 cursor-default bg-[radial-gradient(circle_at_48%_45%,rgba(81,54,168,0.25),transparent_36%),linear-gradient(180deg,rgba(3,7,30,0.94),rgba(6,5,28,0.98))]"
            aria-label="关闭加入房间"
            onClick={onClose}
            disabled={isLoading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="pointer-events-none absolute inset-0"
            animate={{ backgroundPosition: ['0% 0%', '100% 60%', '0% 0%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              backgroundImage:
                'radial-gradient(circle at 14% 20%, rgba(255, 206, 83, 0.2) 0 1px, transparent 2px), radial-gradient(circle at 72% 18%, rgba(168, 96, 255, 0.28) 0 1px, transparent 2px), radial-gradient(circle at 46% 72%, rgba(255, 233, 128, 0.16) 0 1px, transparent 2px)',
              backgroundSize: '140px 140px, 210px 210px, 180px 180px',
            }}
          />

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {backgroundStars.map(star => (
              <motion.span
                key={star.id}
                className="absolute rounded-full"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size,
                  height: star.size,
                  background: star.id % 3 === 0 ? '#b675ff' : '#ffd766',
                  boxShadow:
                    star.id % 3 === 0 ? '0 0 16px rgba(179, 105, 255, 0.9)' : '0 0 14px rgba(255, 210, 88, 0.92)',
                }}
                animate={{ y: [0, -18, 0], opacity: [0.2, 1, 0.28], scale: [0.7, 1.3, 0.7] }}
                transition={{
                  duration: 3.4 + (star.id % 6) * 0.4,
                  delay: star.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <motion.section
            className="relative z-10 h-[654px] w-[990px]"
            role="dialog"
            aria-modal="true"
            aria-label="加入房间"
            initial={{ opacity: 0, scale: 0.82, y: 24 }}
            animate={{
              opacity: 1,
              scale: [0.995, 1.005, 0.995],
              y: [-6, 6, -6],
            }}
            exit={{ opacity: 0, scale: 0.82, y: 24 }}
            transition={{
              opacity: { duration: 0.26 },
              scale: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            onClick={event => event.stopPropagation()}
            style={{
              filter:
                'drop-shadow(0 34px 60px rgba(5, 5, 24, 0.58)) drop-shadow(0 0 46px rgba(255, 190, 65, 0.26))',
            }}
          >
            <Image src={joinRoomBoardImage} alt="" fill sizes="990px" className="pointer-events-none object-contain" priority />

            <motion.div
              className="pointer-events-none absolute left-[50%] top-[28px] h-[102px] w-[270px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,242,166,0.52),rgba(255,182,55,0.12)_54%,transparent_72%)] blur-[8px]"
              animate={{ opacity: [0.2, 0.72, 0.2], scale: [0.9, 1.12, 0.9] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            />

            <form className="absolute inset-0 z-10" onSubmit={handleSubmit}>
              <div className="absolute left-[192px] top-[90px] z-20 -translate-x-1/2 text-center">
                <h2 className="text-[52px] font-black leading-none text-[#f8e7aa] drop-shadow-[0_3px_0_rgba(67,52,127,0.58)]">
                  加入房间
                </h2>
              </div>

              <div className="absolute left-[106px] top-[214px] z-20 text-[18px] font-black text-[#6b401c]">输入房间号</div>

              <div
                data-join-room-layer="searchStage"
                className="absolute left-[184px] top-[260px] h-[64px] w-[266px] -translate-x-1/2"
              >
                <motion.div
                  className="relative h-full w-full"
                  whileHover={!isLoading ? { scale: 1.02 } : undefined}
                  animate={{
                    filter: searchInputFocused
                      ? [
                          'drop-shadow(0 0 16px rgba(181, 83, 255, 0.56)) drop-shadow(0 0 24px rgba(255, 207, 87, 0.24))',
                          'drop-shadow(0 0 28px rgba(190, 89, 255, 0.76)) drop-shadow(0 0 34px rgba(255, 221, 95, 0.38))',
                          'drop-shadow(0 0 16px rgba(181, 83, 255, 0.56)) drop-shadow(0 0 24px rgba(255, 207, 87, 0.24))',
                        ]
                      : [
                          'drop-shadow(0 0 10px rgba(168, 78, 255, 0.28))',
                          'drop-shadow(0 0 18px rgba(177, 84, 255, 0.42))',
                          'drop-shadow(0 0 10px rgba(168, 78, 255, 0.28))',
                        ],
                  }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Image src={searchImage} alt="" fill sizes="266px" className="pointer-events-none object-cover opacity-90" priority />

                  <motion.span
                    className="pointer-events-none absolute right-[17px] top-[18px] h-[30px] w-[30px] rounded-[7px]"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    style={{
                      background:
                        'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.76), rgba(180,76,255,0.9), transparent, rgba(122,61,255,0.78), transparent)',
                      filter: 'blur(2px)',
                      mixBlendMode: 'screen',
                    }}
                  />

                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[14px]">
                    {ambientParticles.map(particle => (
                      <motion.span
                        key={particle.id}
                        className="absolute"
                        style={{
                          left: `${particle.x}%`,
                          top: `${particle.y}%`,
                          width: particle.size * 0.42,
                          height: particle.size * 0.42,
                        }}
                        animate={{
                          x: searchInputFocused ? [0, (50 - particle.x) * 0.25, particle.drift * 0.28] : [0, particle.drift * 0.25, 0],
                          y: particle.kind === 'magic' ? [0, -10, -18] : particle.kind === 'coin' ? [0, -6, 3, 0] : [0, -8, 0],
                          opacity: [0, particle.kind === 'magic' ? 0.52 : 0.72, 0],
                          rotate: particle.kind === 'coin' ? [0, 180, 360] : [0, 18, 0],
                          scale: [0.72, searchInputFocused ? 1.18 : 1.02, 0.72],
                        }}
                        transition={{
                          duration: particle.duration,
                          delay: particle.delay,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        {particle.kind === 'coin' ? <CoinParticle /> : particle.kind === 'magic' ? <MagicParticle /> : <StarParticle />}
                      </motion.span>
                    ))}
                  </div>

                  <div className="absolute left-[17px] top-1/2 flex h-[48px] w-[188px] -translate-y-1/2 items-center">
                    <input
                      id="join-room-code-input"
                      className="peer h-full w-full bg-transparent pl-[2px] pr-[8px] text-[18px] font-black text-[#8c5327] outline-none placeholder:text-transparent disabled:cursor-wait"
                      type="text"
                      inputMode="text"
                      maxLength={12}
                      autoComplete="off"
                      required
                      placeholder=" "
                      value={joinRoomCode}
                      disabled={isLoading}
                      onFocus={() => setSearchInputFocused(true)}
                      onBlur={() => setSearchInputFocused(false)}
                      onChange={event => onRoomCodeChange(event.target.value.slice(0, 12))}
                    />
                    <label
                      className="pointer-events-none absolute left-[2px] top-1/2 flex -translate-y-1/2 items-center gap-[1px] text-[15px] font-black text-[#a56d3d] transition-colors duration-300 peer-focus:text-[#7f3bff] peer-[:not(:placeholder-shown)]:opacity-0"
                      htmlFor="join-room-code-input"
                      aria-label="Room number"
                    >
                      {roomNumberLabel.map((character, index) => (
                        <motion.span
                          key={`${character}-${index}`}
                          animate={searchInputFocused ? { y: [0, -4, 0], color: ['#a56d3d', '#8d45ff', '#a56d3d'] } : undefined}
                          transition={{ duration: 1.4, delay: index * 0.05, repeat: searchInputFocused ? Infinity : 0 }}
                        >
                          {character === ' ' ? '\u00A0' : character}
                        </motion.span>
                      ))}
                    </label>
                  </div>
                </motion.div>
              </div>

              <div data-join-room-layer="joinButtonAnchor" className="absolute left-[184px] top-[374px] h-[62px] w-[250px] -translate-x-1/2">
                <motion.button
                  type="submit"
                  className="group relative grid h-full w-full place-items-center rounded-[999px] border-[3px] border-[#9ec0ff] bg-gradient-to-b from-[#5f8cff] via-[#3568da] to-[#234cae] text-[26px] font-black text-white outline-none disabled:cursor-wait disabled:saturate-50"
                  disabled={!joinRoomCode.trim() || isLoading}
                  animate={{
                    y: [0, -2, 0],
                    scale: [1, 1.012, 1],
                    boxShadow: [
                      'inset 0 5px 0 rgba(255,255,255,0.34), inset 0 -6px 0 rgba(16,45,112,0.28), 0 6px 0 rgba(43,38,104,0.34), 0 0 12px rgba(80,123,255,0.24)',
                      'inset 0 6px 0 rgba(255,255,255,0.42), inset 0 -7px 0 rgba(16,45,112,0.34), 0 8px 0 rgba(43,38,104,0.38), 0 0 24px rgba(80,123,255,0.42)',
                      'inset 0 5px 0 rgba(255,255,255,0.34), inset 0 -6px 0 rgba(16,45,112,0.28), 0 6px 0 rgba(43,38,104,0.34), 0 0 12px rgba(80,123,255,0.24)',
                    ],
                  }}
                  whileHover={!isLoading && joinRoomCode.trim() ? { scale: 1.05 } : undefined}
                  whileTap={!isLoading && joinRoomCode.trim() ? { scale: 0.92 } : undefined}
                  transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="pointer-events-none absolute inset-[5px] rounded-[999px] bg-gradient-to-b from-white/22 via-transparent to-[#0d2c7a]/18" />
                  <span className="relative z-10 drop-shadow-[0_2px_0_rgba(25,47,117,0.65)]">
                    {isLoading ? '加入中' : '加入房间'}
                  </span>
                  {buttonSparks.map(spark => (
                    <motion.span
                      key={spark.id}
                      className="pointer-events-none absolute left-1/2 top-1/2 h-[8px] w-[8px] rounded-full bg-[#dce8ff] opacity-0 group-hover:opacity-100"
                      animate={{
                        x: [0, Math.cos((spark.angle * Math.PI) / 180) * 112],
                        y: [0, Math.sin((spark.angle * Math.PI) / 180) * 48],
                        scale: [0.4, 1.2, 0.4],
                        opacity: [0, 1, 0],
                      }}
                      transition={{ duration: 1.2, delay: spark.delay, repeat: Infinity, ease: 'easeOut' }}
                    />
                  ))}
                </motion.button>
              </div>

              <section className="absolute left-[426px] top-[164px] z-20 h-[402px] w-[470px]" aria-label="推荐房间">
                <div className="mb-[10px] flex h-[58px] items-center justify-between rounded-[14px] border-2 border-[#c78337] bg-[#ffe0a1] px-[22px] text-[#6d421f] shadow-[inset_0_2px_6px_rgba(255,255,255,0.62),0_3px_0_rgba(124,70,24,0.18)]">
                  <strong className="text-[18px] font-black">推荐房间</strong>
                  <motion.button
                    type="button"
                    className="grid h-[38px] w-[38px] place-items-center rounded-full text-[#875225] outline-none hover:bg-[#f4ce8d]/60 disabled:cursor-wait"
                    aria-label="刷新推荐房间"
                    onClick={onRefreshRooms}
                    disabled={isRoomListLoading || isLoading}
                    animate={isRoomListLoading ? { rotate: 360 } : { rotate: 0 }}
                    transition={isRoomListLoading ? { duration: 0.9, repeat: Infinity, ease: 'linear' } : undefined}
                  >
                    <RefreshCw size={24} strokeWidth={3} />
                  </motion.button>
                </div>

                <div className="flex h-[326px] gap-[10px] rounded-[16px] border-2 border-[#d29b4a] bg-[#f0c875] p-[10px] shadow-[inset_0_3px_10px_rgba(112,65,22,0.14)]">
                  <div ref={scrollContainerRef} className="relative flex-1 overflow-y-auto pr-1 no-scrollbar" style={{ scrollBehavior: 'smooth' }}>
                    <div ref={scrollContentRef} className="pb-2">
                      {displayedRooms.map(room => (
                        <RoomListItemCard key={room.id} room={room} onJoin={handleJoinRoom} />
                      ))}
                      {displayedRooms.length === 0 && (
                        <div className="grid h-[246px] place-items-center rounded-[14px] border-2 border-dashed border-[#b97b2f] bg-[#ffe8aa] text-[18px] font-black text-[#7b4a1c]">
                          {isRoomListLoading ? '正在获取房间列表' : '暂无等待中的房间'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="relative w-[24px]">
                    <CustomScrollbar containerRef={scrollContainerRef} contentRef={scrollContentRef} />
                  </div>
                </div>
              </section>

              <div className="absolute bottom-[47px] left-[160px] right-[160px] z-20 flex items-center justify-between text-[15px] font-black text-[#d4af37]">
                <div className="flex items-center gap-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                  <Home size={20} fill="currentColor" className="opacity-80" />
                  <span>在线房间：{displayedRooms.length}</span>
                </div>
                <div className="flex items-center gap-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                  <Users size={20} fill="currentColor" className="opacity-80" />
                  <span>当前在线：{displayedRooms.reduce((total, room) => total + room.players, 0)}</span>
                </div>
              </div>

              {error && (
                <motion.p
                  className="absolute bottom-[86px] left-1/2 z-30 m-0 -translate-x-1/2 rounded-full border border-[#ffd270]/60 bg-[#3a124f]/88 px-5 py-2 text-[15px] font-black text-[#ffe59b] shadow-[0_0_24px_rgba(164,69,255,0.42)]"
                  role="alert"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}
            </form>

            <motion.button
              type="button"
              aria-label="关闭加入房间"
              className="absolute right-[76px] top-[64px] z-20 grid h-[58px] w-[58px] place-items-center rounded-full border-[4px] border-[#ffe08d] bg-gradient-to-b from-[#ff7162] to-[#c51d35] text-white shadow-[inset_0_4px_0_rgba(255,255,255,0.34),0_8px_0_rgba(102,36,18,0.36),0_0_22px_rgba(255,210,93,0.5)] outline-none disabled:cursor-wait"
              onClick={onClose}
              disabled={isLoading}
              initial={{ opacity: 0, scale: 0.72, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              whileHover={!isLoading ? { scale: 1.08, rotate: 3 } : undefined}
              whileTap={!isLoading ? { scale: 0.92 } : undefined}
            >
              <X size={34} strokeWidth={4.5} aria-hidden="true" />
            </motion.button>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StarParticle() {
  return (
    <span
      className="block h-full w-full rotate-45 rounded-[2px]"
      style={{
        background: 'linear-gradient(135deg, #fff9c9, #ffd45e 56%, #ff9d27)',
        boxShadow: '0 0 14px rgba(255, 217, 92, 0.95)',
      }}
    />
  );
}

function MagicParticle() {
  return (
    <span
      className="block h-full w-full rounded-full blur-[1px]"
      style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.94), rgba(188,91,255,0.72) 46%, transparent 72%)',
        boxShadow: '0 0 18px rgba(188, 91, 255, 0.86)',
      }}
    />
  );
}

function CoinParticle() {
  return (
    <span
      className="block h-full w-full rounded-full"
      style={{
        border: '2px solid rgba(158, 75, 8, 0.9)',
        background: 'radial-gradient(circle at 34% 28%, #fff7ad 0%, #ffd34f 34%, #f59e0b 70%, #a64d06 100%)',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.72), 0 0 13px rgba(255, 206, 66, 0.78)',
      }}
    />
  );
}
