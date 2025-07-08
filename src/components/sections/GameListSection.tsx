import '../../styles/theme.css';
import '../../styles/utilities.css';
import '../../styles/sections/GameList.css';
import '../../styles/sections/GameCard.css';
import games from '../../data/games';
import GameCard from '../molecules/GameCard';

const GameListSection = () => (
  <section className="section container mx-container">
    <h2 className="game-list__title gradient-title text-left">
      Hot Games
    </h2>
    <div className="game-list__grid">
      {games.map((game) => (
        <GameCard
          key={game.slug}
          title={game.title}
          image={game.image}
          className={game.glowClass}
        />
      ))}
    </div>
  </section>
);

export default GameListSection;
