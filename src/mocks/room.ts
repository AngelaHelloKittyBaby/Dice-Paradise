import type { Room, RoomListItem, RoomMember } from '@/types/room';

/** Mock 房间成员 */
export const mockRoomMembers: RoomMember[] = [
  {
    playerId: 'player-001',
    name: '投骰大师',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix',
    isHost: true,
    isReady: true,
    joinedAt: '2024-05-13T10:00:00Z',
  },
  {
    playerId: 'player-002',
    name: '骰子达人',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka',
    isHost: false,
    isReady: true,
    joinedAt: '2024-05-13T10:02:00Z',
  },
  {
    playerId: 'player-003',
    name: '幸运之星',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Lucky',
    isHost: false,
    isReady: false,
    joinedAt: '2024-05-13T10:05:00Z',
  },
];

/** Mock 当前房间 */
export const mockCurrentRoom: Room = {
  id: 'room-001',
  name: '快乐投骰间',
  hostId: 'player-001',
  members: mockRoomMembers,
  settings: {
    maxPlayers: 4,
    isPrivate: false,
    roundTime: 30,
    autoStart: false,
  },
  status: 'waiting',
  createdAt: '2024-05-13T10:00:00Z',
};

/** Mock 房间列表 */
export const mockRoomList: RoomListItem[] = [
  {
    id: 'room-001',
    name: '快乐投骰间',
    hostName: '投骰大师',
    playerCount: 3,
    maxPlayers: 4,
    isPrivate: false,
    status: 'waiting',
  },
  {
    id: 'room-002',
    name: '高手切磋',
    hostName: '骰子达人',
    playerCount: 2,
    maxPlayers: 2,
    isPrivate: true,
    status: 'waiting',
  },
  {
    id: 'room-003',
    name: '新手友好房',
    hostName: '幸运之星',
    playerCount: 1,
    maxPlayers: 4,
    isPrivate: false,
    status: 'waiting',
  },
  {
    id: 'room-004',
    name: '激战正酣',
    hostName: '赌神降临',
    playerCount: 4,
    maxPlayers: 4,
    isPrivate: false,
    status: 'playing',
  },
];
