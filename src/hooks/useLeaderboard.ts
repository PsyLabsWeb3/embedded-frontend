import { useState, useEffect } from 'react';
import type { LeaderboardItem } from '../types/leaderboard';

interface UseLeaderboardResult {
  data: LeaderboardItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useLeaderboard = (): UseLeaderboardResult => {
  const [data, setData] = useState<LeaderboardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('https://backend.embedded.games/api/leaderboard');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Assuming the API returns an array directly or has a data property
      const leaderboardData = Array.isArray(result) ? result : result.data || [];
      
      setData(leaderboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchLeaderboard
  };
};
