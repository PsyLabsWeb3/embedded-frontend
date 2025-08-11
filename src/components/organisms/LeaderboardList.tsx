import { LeaderboardCard } from './LeaderboardCard';
import type { LeaderboardItem } from '../../types/leaderboard';

interface LeaderboardListProps {
  data: LeaderboardItem[];
  isLoading: boolean;
  error: string | null;
}

export const LeaderboardList: React.FC<LeaderboardListProps> = ({
  data,
  isLoading,
  error,
}) => {

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-destructive">Error: {error}</div>
      </div>
    );
  }

  // Sort data by position in ascending order
  const sortedData = [...data].sort((a, b) => a.position - b.position);

  return (
    <div className="space-y-4">
      {sortedData.map((item) => (
        <LeaderboardCard key={item.walletAddress} item={item} />
      ))}
    </div>
  );
};
