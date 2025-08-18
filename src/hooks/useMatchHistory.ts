import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { groupByDay, type DayGroup as _DayGroup } from '../utils/groupByDay';
import { computeStats } from '../utils/computeStats';

export interface ApiItem {
  matchId: string;
  opponent: string;
  result: 'WIN' | 'LOSS' | string;
  matchDate: string; // ISO
  mode?: string | null;
  amount?: string | number | null;
  game?: string | null;
}

export interface ApiResponse {
  wallet: string;
  points: number;
  history: ApiItem[];
}

export type DayGroupItem = {
  opponent: string;
  result: 'WIN' | 'LOSS' | string;
  matchDate: string;
  mode?: string | null;
  amount?: string | number | null;
  game?: string | null;
};
export type DayGroup = { dayText: string; items: DayGroupItem[] };

export interface UseMatchHistoryResult {
  loading: boolean;
  error: string | null;
  data: ApiResponse | null;
  stats: { points: number; wins: number; losses: number };
  groups: DayGroup[];
  visibleCount: number;
  totalCount: number;
  hasMore: boolean;
  showMore: () => void;
  refetch: () => Promise<void>;
}

interface Options { pageSize?: number }

export const useMatchHistory = (walletAddress?: string, options?: Options): UseMatchHistoryResult => {
  const pageSize = options?.pageSize ?? 20;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(pageSize);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (!walletAddress) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }
    
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);

    try {
      const url = `https://backend.embedded.games/api/matchHistory?walletAddress=${encodeURIComponent(walletAddress)}`;
      const res = await fetch(url, { signal: ctrl.signal });
      
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('No match history found for this wallet');
        }
        throw new Error(`HTTP ${res.status}`);
      }
      
      const json = (await res.json()) as ApiResponse;

      const history = Array.isArray(json?.history) ? json.history : [];
      // Sort DESC by matchDate
      const sorted = history
        .filter((it): it is ApiItem => !!it && typeof it.matchDate === 'string')
        .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime());

      const normalized: ApiResponse = {
        wallet: String(json?.wallet ?? walletAddress),
        points: typeof json?.points === 'number' ? json.points : 0,
        history: sorted,
      };

      setData(normalized);
      setVisibleCount(pageSize);
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
      setError(e?.message ?? 'Failed to load history');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [walletAddress, pageSize]);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  const totalCount = data?.history?.length ?? 0;
  const hasMore = visibleCount < totalCount;

  const visibleHistory = useMemo(() => {
    if (!data?.history) return [] as ApiItem[];
    return data.history.slice(0, visibleCount);
  }, [data?.history, visibleCount]);

  const groups = useMemo<DayGroup[]>(() => {
    if (!visibleHistory.length) return [];
    const dayGroups = groupByDay(visibleHistory as any) as _DayGroup<ApiItem>[];
    return dayGroups.map((g) => ({
      dayText: g.dayText,
      items: g.items.map((it) => ({
        opponent: it.opponent,
        result: it.result,
        matchDate: it.matchDate,
        mode: it.mode ?? null,
        amount: it.amount ?? null,
        game: it.game ?? null,
      })),
    }));
  }, [visibleHistory]);

  const stats = useMemo(() => computeStats(data), [data]);

  const showMore = useCallback(() => {
    if (hasMore) setVisibleCount((v) => Math.min(v + pageSize, totalCount));
  }, [hasMore, pageSize, totalCount]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return { loading, error, data, stats, groups, visibleCount, totalCount, hasMore, showMore, refetch };
};
