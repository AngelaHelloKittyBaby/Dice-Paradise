import { create } from 'zustand';
import { createOnlineRoom, dismissOnlineRoom, getWaitingRoomList, joinOnlineRoom, leaveOnlineRoom } from '@/modules/room/roomApi';
import type { Room, RoomListItem, RoomMember, RoomSettings } from '@/types/room';
import { usePlayerStore } from './playerStore';

interface RoomState {
  currentRoom: Room | null;
  roomList: RoomListItem[];
  isHost: boolean;
  currentPlayerId: string;
}

interface RoomActions {
  setCurrentRoom: (room: Room | null, currentPlayerId?: string) => void;
  createRoom: (name: string, settings: RoomSettings, playerName?: string) => Promise<Room>;
  joinRoom: (roomCode: string, playerName?: string) => Promise<Room>;
  fetchRoomList: () => Promise<RoomListItem[]>;
  leaveRoom: () => Promise<void>;
  toggleReady: () => void;
  startGame: () => boolean;
  updateRoomMembers: (members: RoomMember[]) => void;
}

type RoomStore = RoomState & RoomActions;

function getRoomListItem(room: Room): RoomListItem {
  return {
    id: room.id,
    name: room.name,
    hostName: room.members.find(member => member.isHost)?.name ?? '房主',
    playerCount: room.members.length,
    maxPlayers: room.settings.maxPlayers,
    isPrivate: room.settings.isPrivate,
    status: room.status,
  };
}

function getCurrentClientId() {
  const player = usePlayerStore.getState().player;

  if (!player?.id) {
    throw new Error('请先登录后再操作房间');
  }

  return player.id;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  // State
  currentRoom: null,
  roomList: [],
  isHost: false,
  currentPlayerId: '',

  // Actions
  setCurrentRoom: (room, currentPlayerId) =>
    set({
      currentRoom: room,
      currentPlayerId: currentPlayerId ?? get().currentPlayerId,
      isHost: Boolean(room?.members.find(member => member.playerId === (currentPlayerId ?? get().currentPlayerId))?.isHost),
    }),

  createRoom: async (name, settings, playerName = '投骰大师') => {
    const newRoom = await createOnlineRoom({
      client_id: getCurrentClientId(),
      player_name: playerName,
      room_name: name,
      max_players: settings.maxPlayers,
      game_mode: 'online',
    });
    const currentPlayerId = newRoom.hostId;

    set({
      currentRoom: newRoom,
      isHost: true,
      currentPlayerId,
      roomList: [getRoomListItem(newRoom), ...get().roomList.filter(room => room.id !== newRoom.id)],
    });

    return newRoom;
  },

  joinRoom: async (roomCode, playerName = '乐乐玩家') => {
    const joinResult = await joinOnlineRoom({
      client_id: getCurrentClientId(),
      room_code: roomCode,
      player_name: playerName,
    });
    const joinedRoom = joinResult.room;
    const currentPlayerId = joinResult.playerId;

    set({
      currentRoom: joinedRoom,
      currentPlayerId,
      isHost: Boolean(joinedRoom.members.find(member => member.playerId === currentPlayerId)?.isHost),
      roomList: [getRoomListItem(joinedRoom), ...get().roomList.filter(room => room.id !== joinedRoom.id)],
    });

    return joinedRoom;
  },

  fetchRoomList: async () => {
    const roomList = await getWaitingRoomList();

    set({ roomList });

    return roomList;
  },

  leaveRoom: async () => {
    const { currentRoom, currentPlayerId } = get();

    if (!currentRoom || !currentPlayerId) return;

    const shouldDismissRoom = Boolean(currentRoom.members.find(member => member.playerId === currentPlayerId)?.isHost);

    if (shouldDismissRoom) {
      await dismissOnlineRoom(currentRoom.id, {
        player_id: currentPlayerId,
      });
    } else {
      await leaveOnlineRoom({
        room_code: currentRoom.id,
        player_id: currentPlayerId,
      });
    }

    set({
      currentRoom: null,
      isHost: false,
      currentPlayerId: '',
      roomList: shouldDismissRoom ? get().roomList.filter(room => room.id !== currentRoom.id) : get().roomList,
    });
  },

  toggleReady: () => {
    const { currentRoom, currentPlayerId, isHost } = get();
    if (!currentRoom || isHost) return;

    const myMember = currentRoom.members.find((m) => m.playerId === currentPlayerId);
    if (!myMember) return;

    const updatedMembers = currentRoom.members.map((m) =>
      m.playerId === currentPlayerId ? { ...m, isReady: !m.isReady } : m
    );

    set({
      currentRoom: { ...currentRoom, members: updatedMembers },
    });
  },

  startGame: () => {
    const { currentRoom, isHost } = get();
    if (!currentRoom || !isHost) return false;

    const allReady = currentRoom.members.every((m) => m.isHost || m.isReady);
    if (!allReady || currentRoom.members.length < 2) return false;

    set({
      currentRoom: { ...currentRoom, status: 'playing' },
    });

    return true;
  },

  updateRoomMembers: (members) => {
    const { currentRoom } = get();
    if (!currentRoom) return;

    set({
      currentRoom: { ...currentRoom, members },
    });
  },
}));
