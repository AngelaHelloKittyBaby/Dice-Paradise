import { useCallback, useMemo } from 'react';
import { usePlayerStore } from '@/stores/playerStore';

export function useAuth() {
  const store = usePlayerStore();

  const login = useCallback((username: string, password: string) => {
    // Mock login - 实际项目中调用API
    console.log('Login:', username, password);
    // store.login(mockPlayer);
  }, []);

  const logout = useCallback(() => {
    store.logout();
  }, [store]);

  const register = useCallback((username: string, password: string, nickname?: string) => {
    // Mock register - 实际项目中调用API
    console.log('Register:', username, password, nickname);
  }, []);

  return {
    // State
    player: store.player,
    stats: store.stats,
    isLoggedIn: store.isLoggedIn,
    settings: store.settings,

    // Actions
    login,
    logout,
    register,
    updateSettings: store.updateSettings,
    addCoins: store.addCoins,
    addGems: store.addGems,
    addExp: store.addExp,
  };
}
