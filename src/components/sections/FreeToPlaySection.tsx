import React from 'react';
import pveGames from '../../data/pveGames';
import GameCard from '../molecules/GameCard';

import '../../styles/theme.css';
import '../../styles/utilities.css';
import '../../styles/sections/GameSections.css';

const FreeToPlaySection: React.FC = () => (
  <section className="games-section container mx-container" aria-labelledby="free-to-play-heading">
    <h2 id="free-to-play-heading" className="games-section__title gradient-title">Free to Play</h2>
    <p className="games-section__subtitle">Free PvE Games to Play</p>
    <a className="games-section__viewall" href="/games-pve">View all</a>
    <div className="games-section__grid" role="list" aria-label="Free to play games">
      {pveGames.map((game) => (
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

export default FreeToPlaySection;
