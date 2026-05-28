import defaultAvatar from '@/assets/images/avatars/default-player.png';
import { createApiClient } from '@/modules/api/createApiClient';
import type {
  ApiRoomData,
  ApiRoomListItem,
  CreateOnlineRoomRequest,
  DismissOnlineRoomRequest,
  JoinOnlineRoomData,
  JoinOnlineRoomRequest,
  LeaveOnlineRoomRequest,
  RoomListResponseData,
  StartOnlineRoomData,
  StartOnlineRoomRequest,
} from '@/types/roomApi';
import type { Room, RoomListItem, RoomMember } from '@/types/room';

interface RoomApiEnvelope<T> {
  code: number;
  msg: string;
  data: T;
}

const apiClient = createApiClient();

function unwrapRoomApiResponse<T>(response: RoomApiEnvelope<T>, fallbackMessage: string): T {
  if (response.code !== 200) {
    throw new Error(response.msg || fallbackMessage);
  }

  if (!response.data) {
    throw new Error(fallbackMessage);
  }

  return response.data;
}

function getRoomMemberAvatar(playerId: string) {
  return playerId ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(playerId)}` : defaultAvatar.src;
}

function normalizeRoomPlayerId(playerId: string | number | null | undefined) {
  return playerId === null || playerId === undefined ? '' : String(playerId);
}

function toBackendRoomPlayerId(playerId: string | number) {
  const numericPlayerId = typeof playerId === 'number' ? playerId : Number(playerId);

  return Number.isInteger(numericPlayerId) ? numericPlayerId : playerId;
}

export function normalizeRoomData(data: ApiRoomData): Room {
  const joinedAt = new Date().toISOString();
  const explicitHostId = normalizeRoomPlayerId(data.players.find(player => player.isHost)?.playerId);
  const normalizedHostId =
    explicitHostId ||
    normalizeRoomPlayerId(
      data.players.find(player => normalizeRoomPlayerId(player.playerId) === normalizeRoomPlayerId(data.hostId))?.playerId
    ) ||
    normalizeRoomPlayerId(data.players[0]?.playerId) ||
    normalizeRoomPlayerId(data.hostId);
  const members: RoomMember[] = data.players.map(player => ({
    playerId: normalizeRoomPlayerId(player.playerId),
    name: player.name,
    avatar: getRoomMemberAvatar(normalizeRoomPlayerId(player.playerId)),
    isHost: normalizeRoomPlayerId(player.playerId) === normalizedHostId,
    isReady: normalizeRoomPlayerId(player.playerId) === normalizedHostId,
    joinedAt,
    points: player.points ?? 0,
  }));

  return {
    id: data.roomCode,
    name: data.roomName,
    hostId: normalizedHostId,
    members,
    settings: {
      maxPlayers: data.maxPlayers,
      isPrivate: false,
      roundTime: 30,
      autoStart: false,
    },
    status: data.status,
    createdAt: joinedAt,
  };
}

function normalizeRoomListItem(data: ApiRoomListItem): RoomListItem {
  return {
    id: data.roomCode,
    name: data.roomName,
    hostName: '房主',
    playerCount: data.playerCount,
    maxPlayers: data.maxPlayers,
    isPrivate: false,
    status: data.status,
  };
}

export async function createOnlineRoom(request: CreateOnlineRoomRequest): Promise<Room> {
  console.log('🏠 [createOnlineRoom] 发送请求:', JSON.stringify(request));
  try {
    const response = await apiClient.post<RoomApiEnvelope<ApiRoomData>>('/room/create', request);
    console.log('✅ [createOnlineRoom] 成功响应:', JSON.stringify(response.data));
    return normalizeRoomData(unwrapRoomApiResponse(response.data, '房间创建失败'));
  } catch (error: any) {
    console.error('❌ [createOnlineRoom] 错误详情:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
}

export async function joinOnlineRoom(request: JoinOnlineRoomRequest): Promise<{ room: Room; playerId: string }> {
  console.log('🔗 [joinOnlineRoom] 发送请求:', JSON.stringify(request));
  try {
    const response = await apiClient.post<RoomApiEnvelope<JoinOnlineRoomData>>('/room/join', request);
    console.log('✅ [joinOnlineRoom] 成功响应:', JSON.stringify(response.data));
    const data = unwrapRoomApiResponse(response.data, '加入房间失败');

    return {
      room: normalizeRoomData(data.room),
      playerId: normalizeRoomPlayerId(data.playerId),
    };
  } catch (error: any) {
    console.error('❌ [joinOnlineRoom] 错误详情:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
}

export async function getOnlineRoom(roomCode: string): Promise<Room> {
  console.log('🏠 [getOnlineRoom] 获取房间信息:', roomCode);
  try {
    const response = await apiClient.get<RoomApiEnvelope<ApiRoomData>>(`/room/${roomCode}`);
    console.log('✅ [getOnlineRoom] 成功响应:', JSON.stringify(response.data));
    return normalizeRoomData(unwrapRoomApiResponse(response.data, '获取房间信息失败'));
  } catch (error: any) {
    console.error('❌ [getOnlineRoom] 错误详情:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
}

export async function getWaitingRoomList(): Promise<RoomListItem[]> {
  console.log('📋 [getWaitingRoomList] 获取等待中的房间列表');
  try {
    const response = await apiClient.get<RoomApiEnvelope<RoomListResponseData | null>>('/room/list');
    console.log('✅ [getWaitingRoomList] 成功响应:', JSON.stringify(response.data));

    if (response.data.code !== 200) {
      throw new Error(response.data.msg || '获取房间列表失败');
    }

    return (response.data.data?.rooms ?? []).map(normalizeRoomListItem);
  } catch (error: any) {
    console.error('❌ [getWaitingRoomList] 错误详情:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    throw error;
  }
}

export async function leaveOnlineRoom(request: LeaveOnlineRoomRequest): Promise<void> {
  const response = await apiClient.post<RoomApiEnvelope<null>>('/room/leave', {
    ...request,
    player_id: toBackendRoomPlayerId(request.player_id),
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.msg || '退出房间失败');
  }
}

export async function dismissOnlineRoom(roomCode: string, request: DismissOnlineRoomRequest): Promise<void> {
  const response = await apiClient.delete<RoomApiEnvelope<null>>(`/room/${roomCode}`, {
    data: {
      ...request,
      player_id: toBackendRoomPlayerId(request.player_id),
    },
  });

  if (response.data.code !== 200) {
    throw new Error(response.data.msg || '解散房间失败');
  }
}

export async function startOnlineRoom(roomCode: string, request: StartOnlineRoomRequest): Promise<StartOnlineRoomData> {
  const response = await apiClient.post<RoomApiEnvelope<StartOnlineRoomData>>(`/room/${roomCode}/start`, {
    ...request,
    player_id: toBackendRoomPlayerId(request.player_id),
  });

  return unwrapRoomApiResponse(response.data, '开始游戏失败');
}
