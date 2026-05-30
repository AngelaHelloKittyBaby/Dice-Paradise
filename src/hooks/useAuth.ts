import { useCallback } from 'react';
import { loginWithNickname, registerWithNickname } from '@/modules/auth/authApi';
import { usePlayerStore } from '@/stores/playerStore';

export function useAuth() {
  const player = usePlayerStore(state => state.player);
  const stats = usePlayerStore(state => state.stats);
  const isLoggedIn = usePlayerStore(state => state.isLoggedIn);
  const settings = usePlayerStore(state => state.settings);
  const storeLogin = usePlayerStore(state => state.login);
  const storeLogout = usePlayerStore(state => state.logout);
  const updateSettings = usePlayerStore(state => state.updateSettings);
  const addCoins = usePlayerStore(state => state.addCoins);
  const addGems = usePlayerStore(state => state.addGems);
  const addExp = usePlayerStore(state => state.addExp);

  const login = useCallback(async (nickname: string, password: string) => {
    const session = await loginWithNickname({ nickname, password });

    storeLogin(session.player, {
      authToken: session.accessToken,
      tokenType: session.tokenType,
      stats: session.stats,
    });

    return session;
  }, [storeLogin]);

  const logout = useCallback(() => {
    storeLogout();
  }, [storeLogout]);

  const register = useCallback(async (nickname: string, phone: string, password: string) => {
    const session = await registerWithNickname({ nickname, phone, password });

    storeLogin(session.player, {
      authToken: session.accessToken,
      tokenType: session.tokenType,
      stats: session.stats,
    });

    return session;
  }, [storeLogin]);

  return {
    // State
    player,
    stats,
    isLoggedIn,
    settings,

    // Actions
    login,
    logout,
    register,
    updateSettings,
    addCoins,
    addGems,
    addExp,
  };
}
