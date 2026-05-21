import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, PlayerSettings } from '@/types/player';
import { mockCurrentPlayer, mockPlayerStats } from '@/mocks';

interface PlayerState {
  player: Player | null;
  stats: typeof mockPlayerStats | null;
  settings: PlayerSettings;
  isLoggedIn: boolean;
}

interface PlayerActions {
  login: (player: Player) => void;
  logout: () => void;
  updatePlayer: (data: Partial<Player>) => void;
  updateSettings: (settings: Partial<PlayerSettings>) => void;
  addCoins: (amount: number) => void;
  addGems: (amount: number) => void;
  addExp: (amount: number) => void;
}

type PlayerStore = PlayerState & PlayerActions;

const defaultSettings: PlayerSettings = {
  soundEnabled: true,
  musicEnabled: true,
  soundVolume: 80,
  musicVolume: 50,
  language: 'zh',
  theme: 'light',
};

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      // State
      player: mockCurrentPlayer,
      stats: mockPlayerStats,
      settings: defaultSettings,
      isLoggedIn: true, // Mock: 默认已登录

      // Actions
      login: (player) => set({ player, isLoggedIn: true }),

      logout: () => set({ player: null, stats: null, isLoggedIn: false }),

      updatePlayer: (data) => set((state) => ({
        player: state.player ? { ...state.player, ...data } : null,
      })),

      updateSettings: (settings) => set((state) => ({
        settings: { ...state.settings, ...settings },
      })),

      addCoins: (amount) => set((state) => ({
        player: state.player
          ? { ...state.player, coins: state.player.coins + amount }
          : null,
      })),

      addGems: (amount) => set((state) => ({
        player: state.player
          ? { ...state.player, gems: state.player.gems + amount }
          : null,
      })),

      addExp: (amount) => {
        const state = get();
        if (!state.player) return;

        const newExp = state.player.exp + amount;
        const expPerLevel = 200;
        let newLevel = state.player.level;
        let remainingExp = newExp;

        while (remainingExp >= (newLevel + 1) * expPerLevel) {
          newLevel++;
        }

        set({
          player: {
            ...state.player,
            exp: remainingExp,
            level: newLevel,
          },
        });
      },
    }),
    {
      name: 'dice-paradise-player',
      partialize: (state) => ({
        player: state.player,
        isLoggedIn: state.isLoggedIn,
        settings: state.settings,
      }),
    }
  )
);
