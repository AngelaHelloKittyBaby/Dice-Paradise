import type { ApiGameMode } from './gameApi';
import type { Room } from './room';

export type ApiRoomPlayerId = string | number;

export interface CreateOnlineRoomRequest {
  client_id: string;
  player_name: string;
  room_name?: string | null;
  max_players?: number;
  game_mode?: ApiGameMode;
}

export interface ApiRoomPlayer {
  playerId: ApiRoomPlayerId;
  name: string;
  isHost: boolean;
  points?: number;
}

export interface ApiRoomData {
  roomCode: string;
  roomName: string;
  maxPlayers: number;
  players: ApiRoomPlayer[];
  status: Room['status'];
  hostId?: ApiRoomPlayerId | null;
}

export interface ApiRoomListItem {
  roomCode: string;
  roomName: string;
  playerCount: number;
  maxPlayers: number;
  status: Extract<Room['status'], 'waiting'>;
}

export interface RoomListResponseData {
  rooms: ApiRoomListItem[];
}

export interface JoinOnlineRoomRequest {
  client_id: string;
  room_code: string;
  player_name: string;
}

export interface JoinOnlineRoomData {
  room: ApiRoomData;
  playerId: ApiRoomPlayerId;
}

export interface LeaveOnlineRoomRequest {
  room_code: string;
  player_id: ApiRoomPlayerId;
}

export interface DismissOnlineRoomRequest {
  player_id: ApiRoomPlayerId;
}

export interface StartOnlineRoomRequest {
  player_id: ApiRoomPlayerId;
}

export interface StartOnlineRoomData {
  gameId: string;
  roomCode: string;
}
