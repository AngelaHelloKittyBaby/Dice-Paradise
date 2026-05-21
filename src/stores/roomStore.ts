import { create } from 'zustand';
import type { Room, RoomMember, RoomSettings } from '@/types/room';
import { mockCurrentRoom, mockRoomList } from '@/mocks';

interface RoomState {
  currentRoom: Room | null;
  roomList: typeof mockRoomList;
  isHost: boolean;
}

interface RoomActions {
  setCurrentRoom: (room: Room | null) => void;
  createRoom: (name: string, settings: RoomSettings) => void;
  joinRoom: (roomId: string) => boolean;
  leaveRoom: () => void;
  toggleReady: () => void;
  startGame: () => boolean;
  updateRoomMembers: (members: RoomMember[]) => void;
}

type RoomStore = RoomState & RoomActions;

export const useRoomStore = create<RoomStore>((set, get) => ({
  // State
  currentRoom: mockCurrentRoom,
  roomList: mockRoomList,
  isHost: true, // Mock: 默认是房主

  // Actions
  setCurrentRoom: (room) => set({ currentRoom: room }),

  createRoom: (name, settings) => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name,
      hostId: 'player-001', // Mock current player id
      members: [
        {
          playerId: 'player-001',
          name: '投骰大师',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
          isHost: true,
          isReady: true,
          joinedAt: new Date().toISOString(),
        },
      ],
      settings,
      status: 'waiting',
      createdAt: new Date().toISOString(),
    };

    set({
      currentRoom: newRoom,
      isHost: true,
      roomList: [
        {
          id: newRoom.id,
          name: newRoom.name,
          hostName: '投骰大师',
          playerCount: 1,
          maxPlayers: settings.maxPlayers,
          isPrivate: settings.isPrivate,
          status: 'waiting',
        },
        ...get().roomList,
      ],
    });
  },

  joinRoom: (roomId) => {
    const { roomList } = get();
    const room = roomList.find((r) => r.id === roomId);
    if (!room || room.status !== 'waiting' || room.playerCount >= room.maxPlayers) {
      return false;
    }

    // Mock: 模拟加入房间
    set({
      currentRoom: {
        id: room.id,
        name: room.name,
        hostId: 'player-002',
        members: [
          {
            playerId: 'player-002',
            name: '骰子达人',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
            isHost: true,
            isReady: true,
            joinedAt: new Date().toISOString(),
          },
          {
            playerId: 'player-001',
            name: '投骰大师',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
            isHost: false,
            isReady: false,
            joinedAt: new Date().toISOString(),
          },
        ],
        settings: {
          maxPlayers: room.maxPlayers,
          isPrivate: room.isPrivate,
          roundTime: 30,
          autoStart: false,
        },
        status: 'waiting',
        createdAt: new Date().toISOString(),
      },
      isHost: false,
    });

    return true;
  },

  leaveRoom: () => set({ currentRoom: null, isHost: false }),

  toggleReady: () => {
    const { currentRoom, isHost } = get();
    if (!currentRoom || isHost) return;

    const myMember = currentRoom.members.find((m) => m.playerId === 'player-001');
    if (!myMember) return;

    const updatedMembers = currentRoom.members.map((m) =>
      m.playerId === 'player-001' ? { ...m, isReady: !m.isReady } : m
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
