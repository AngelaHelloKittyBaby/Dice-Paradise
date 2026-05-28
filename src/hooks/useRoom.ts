import { useCallback, useMemo } from 'react';
import { useRoomStore } from '@/stores/roomStore';
import type { RoomSettings } from '@/types/room';

export function useRoom() {
  const store = useRoomStore();
  const {
    createRoom: createRoomAction,
    joinRoom: joinRoomAction,
    fetchRoomList: fetchRoomListAction,
    leaveRoom: leaveRoomAction,
    toggleReady: toggleReadyAction,
    startGame: startGameAction,
    currentRoom,
    roomList,
    isHost,
    currentPlayerId,
  } = store;

  const createRoom = useCallback((name: string, settings: RoomSettings, playerName?: string) => {
    return createRoomAction(name, settings, playerName);
  }, [createRoomAction]);

  const joinRoom = useCallback((roomId: string, playerName?: string) => {
    return joinRoomAction(roomId, playerName);
  }, [joinRoomAction]);

  const fetchRoomList = useCallback(() => {
    return fetchRoomListAction();
  }, [fetchRoomListAction]);

  const leaveRoom = useCallback(() => {
    return leaveRoomAction();
  }, [leaveRoomAction]);

  const toggleReady = useCallback(() => {
    toggleReadyAction();
  }, [toggleReadyAction]);

  const startGame = useCallback(() => {
    return startGameAction();
  }, [startGameAction]);

  const canStartGame = useMemo(() => {
    if (!currentRoom || !isHost) return false;

    const allReady = currentRoom.members.every((m) => m.isHost || m.isReady);
    const enoughPlayers = currentRoom.members.length >= 2;

    return allReady && enoughPlayers;
  }, [currentRoom, isHost]);

  const amIReady = useMemo(() => {
    if (!currentRoom || isHost) return true;

    const myMember = currentRoom.members.find((m) => m.playerId === 'player-001');
    return myMember?.isReady ?? false;
  }, [currentRoom, isHost]);

  return {
    // State
    currentRoom,
    roomList,
    isHost,
    currentPlayerId,

    // Computed
    canStartGame,
    amIReady,

    // Actions
    createRoom,
    joinRoom,
    fetchRoomList,
    leaveRoom,
    toggleReady,
    startGame,
  };
}
