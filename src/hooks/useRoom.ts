import { useCallback, useMemo } from 'react';
import { useRoomStore } from '@/stores/roomStore';
import type { RoomSettings } from '@/types/room';

export function useRoom() {
  const store = useRoomStore();

  const createRoom = useCallback((name: string, settings: RoomSettings) => {
    store.createRoom(name, settings);
  }, [store]);

  const joinRoom = useCallback((roomId: string) => {
    return store.joinRoom(roomId);
  }, [store]);

  const leaveRoom = useCallback(() => {
    store.leaveRoom();
  }, [store]);

  const toggleReady = useCallback(() => {
    store.toggleReady();
  }, [store]);

  const startGame = useCallback(() => {
    return store.startGame();
  }, [store]);

  const canStartGame = useMemo(() => {
    const { currentRoom, isHost } = store;
    if (!currentRoom || !isHost) return false;

    const allReady = currentRoom.members.every((m) => m.isHost || m.isReady);
    const enoughPlayers = currentRoom.members.length >= 2;

    return allReady && enoughPlayers;
  }, [store.currentRoom, store.isHost]);

  const amIReady = useMemo(() => {
    const { currentRoom, isHost } = store;
    if (!currentRoom || isHost) return true;

    const myMember = currentRoom.members.find((m) => m.playerId === 'player-001');
    return myMember?.isReady ?? false;
  }, [store.currentRoom, store.isHost]);

  return {
    // State
    currentRoom: store.currentRoom,
    roomList: store.roomList,
    isHost: store.isHost,

    // Computed
    canStartGame,
    amIReady,

    // Actions
    createRoom,
    joinRoom,
    leaveRoom,
    toggleReady,
    startGame,
  };
}
