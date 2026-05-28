import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { usePlayerStore } from '@/stores/playerStore';

export function createApiClient() {
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  apiClient.interceptors.request.use(config => {
    const { authToken, tokenType } = usePlayerStore.getState();

    if (authToken) {
      const authorizationType = tokenType
        ? `${tokenType.charAt(0).toUpperCase()}${tokenType.slice(1)}`
        : 'Bearer';

      config.headers.Authorization = `${authorizationType} ${authToken}`;
    }

    return config;
  });

  return apiClient;
}
