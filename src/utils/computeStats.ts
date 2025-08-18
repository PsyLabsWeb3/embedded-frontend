import type { ApiResponse } from '../hooks/useMatchHistory';

export const computeStats = (resp?: ApiResponse | null) => {
  const points = resp?.points ?? 0;
  const hist = resp?.history ?? [];
  let wins = 0;
  let losses = 0;
  for (const h of hist) {
    const r = String(h.result).toUpperCase();
    if (r === 'WIN') wins++;
    else if (r === 'LOSS') losses++;
  }
  return { points, wins, losses };
};
