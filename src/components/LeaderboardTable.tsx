import { LeaderboardTemplate } from './templates/LeaderboardTemplate';
import { useLeaderboard } from '../hooks/useLeaderboard';

interface LeaderboardTableProps {
  title?: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ 
  title = "Embedded Games Leaderboard" 
}) => {
  const { data, isLoading, error } = useLeaderboard();

  return (
    <LeaderboardTemplate
      data={data}
      isLoading={isLoading}
      error={error}
      title={title}
    />
  );
};

export default LeaderboardTable;
