import React from 'react';
import games from '../../data/games';
import GameCard from '../molecules/GameCard';

import '../../styles/theme.css';
import '../../styles/utilities.css';
import '../../styles/sections/GameSections.css';

const PvPSection: React.FC = () => (
  <section className="games-section container mx-container" aria-labelledby="pvp-heading">
    <h2 id="pvp-heading" className="games-section__title gradient-title">PVP</h2>
    <p className="games-section__subtitle">Player vs Player - Web3 Feature</p>
    <a className="games-section__viewall" href="/games-pvp">View all</a>
    <div className="games-section__grid" role="list" aria-label="PvP games">
      {games.map((game) => (
        <div key={game.slug} role="listitem">
          <GameCard
            title={game.title}
            image={game.image}
            className={game.glowClass}
            slug={game.slug}
            ariaLabel={`Play ${game.title}${game.description ? ` - ${game.description}` : ''}`}
            comingSoon={game.comingSoon}
          />
        </div>
      ))}
    </div>
  </section>
);

export default PvPSection;
