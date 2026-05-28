import { useEffect, useState } from 'react';
import { getHomePoints } from '@/modules/lobby/homeApi';

interface UseHomePointsResult {
  points: number;
  isLoading: boolean;
  error: string | null;
}

export function useHomePoints(clientId: string | null | undefined, fallbackPoints: number): UseHomePointsResult {
  const [points, setPoints] = useState(fallbackPoints);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    if (!clientId) {
      setPoints(fallbackPoints);
      setIsLoading(false);
      setError(null);
      return () => {
        isActive = false;
      };
    }

    setIsLoading(true);
    setError(null);

    getHomePoints(clientId)
      .then(nextPoints => {
        if (!isActive) return;
        setPoints(nextPoints);
      })
      .catch(() => {
        if (!isActive) return;
        setPoints(fallbackPoints);
        // 静默失败，不设置 error
      })
      .finally(() => {
        if (!isActive) return;
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [clientId, fallbackPoints]);

  return {
    points,
    isLoading,
    error,
  };
}

