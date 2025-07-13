import './LeaderboardTable.css';

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  games: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  className?: string;
}

const LeaderboardTable = ({ entries, className = '' }: LeaderboardTableProps) => (
  <div className={`leaderboard-table ${className}`}>
    <div className="table-header">
      <div className="rank-col">Rank</div>
      <div className="username-col">Player</div>
      <div className="score-col">Score</div>
      <div className="games-col">Games</div>
    </div>
    <div className="table-body">
      {entries.map((entry) => (
        <div key={entry.rank} className={`table-row ${entry.rank <= 3 ? 'top-three' : ''}`}>
          <div className="rank-col">
            {entry.rank <= 3 && <span className="medal">🏆</span>}
            #{entry.rank}
          </div>
          <div className="username-col">{entry.username}</div>
          <div className="score-col">{entry.score.toLocaleString()}</div>
          <div className="games-col">{entry.games}</div>
        </div>
      ))}
    </div>
  </div>
);

export default LeaderboardTable;
