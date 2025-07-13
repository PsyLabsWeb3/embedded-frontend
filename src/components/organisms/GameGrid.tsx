import './GameGrid.css';
import GameCard from '../molecules/GameCard';

interface Game {
  id: string;
  title: string;
  image: string;
  slug: string;
}

interface GameGridProps {
  games: Game[];
  className?: string;
}

const GameGrid = ({ games, className = '' }: GameGridProps) => (
  <div className={`game-grid ${className}`}>
    {games.map((game) => (
      <GameCard
        key={game.id}
        title={game.title}
        image={game.image}
        slug={game.slug}
      />
    ))}
  </div>
);

export default GameGrid;
