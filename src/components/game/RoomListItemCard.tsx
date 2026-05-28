import { motion } from 'framer-motion';
import { Crown, Users } from 'lucide-react';
import Image from 'next/image';

export interface RoomData {
  id: string;
  avatar: string;
  roomName: string;
  mode: string;
  tag: string;
  players: number;
  maxPlayers: number;
  isFull: boolean;
  hasCrown?: boolean;
}

interface RoomListItemCardProps {
  room: RoomData;
  onJoin: (id: string) => void;
}

export function RoomListItemCard({ room, onJoin }: RoomListItemCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -2, boxShadow: '0 9px 18px rgba(104, 58, 17, 0.3)' }}
      className="relative mb-[12px] flex h-[86px] items-center justify-between rounded-[14px] border-2 border-[#9f672c] bg-gradient-to-b from-[#fff0b6] via-[#ffd67a] to-[#efb650] px-[16px] shadow-[inset_0_2px_6px_rgba(255,255,255,0.78),0_4px_0_rgba(127,75,25,0.3),0_8px_15px_rgba(112,67,25,0.18)] transition-all duration-300"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-[58px] w-[58px] shrink-0">
          <div className="h-full w-full overflow-hidden rounded-full border-2 border-[#d39a3b] bg-[#d9a8ff] shadow-[inset_0_2px_4px_rgba(255,255,255,0.55)]">
            <Image src={room.avatar} alt="" width={58} height={58} className="object-cover" />
          </div>
          {room.hasCrown && (
            <motion.div
              initial={{ rotate: -15 }}
              animate={{ rotate: [-15, 15, -15] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -left-2 -top-2 text-yellow-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            >
              <Crown size={20} fill="currentColor" />
            </motion.div>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="max-w-[150px] truncate text-[19px] font-black leading-tight text-[#6c3f16] drop-shadow-[0_1px_0_rgba(255,255,255,0.72)]">
            {room.roomName}
          </h3>
          <p className="mt-[6px] max-w-[160px] truncate text-[14px] font-bold leading-none text-[#8a5a2b]">
            房主：{room.tag}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-[18px]">
        <div className="flex min-w-[58px] items-center justify-end gap-[6px] text-[#6d4520]">
          <Users size={18} fill="currentColor" strokeWidth={3} />
          <span className="text-[17px] font-black leading-none">
            {room.players}/{room.maxPlayers}
          </span>
        </div>

        <button
          type="button"
          onClick={() => !room.isFull && onJoin(room.id)}
          disabled={room.isFull}
          className={`h-[42px] min-w-[82px] rounded-full px-5 text-[16px] font-black transition-all duration-300 shadow-[inset_0_2px_0_rgba(255,255,255,0.38),0_3px_0_rgba(76,82,25,0.28)] ${
            room.isFull
              ? 'cursor-not-allowed bg-gradient-to-b from-[#e2d8c2] to-[#b7a98f] text-[#8a806f] grayscale'
              : 'bg-gradient-to-b from-[#9be65b] to-[#33ad3d] text-white hover:brightness-110 active:scale-95'
          }`}
        >
          {room.isFull ? '已满' : '加入'}
        </button>
      </div>
    </motion.div>
  );
}
