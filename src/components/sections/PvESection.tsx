import React from "react";
import pveGames from "../../data/pveGames";
import GameCard from "../molecules/GameCard";

import "../../styles/theme.css";
import "../../styles/utilities.css";
import "../../styles/sections/GameSections.css";

const PvESection: React.FC = () => (
  <section
    className="games-section container mx-container"
    aria-labelledby="pve-heading"
  >
    <h2 id="pve-heading" className="games-section__title">
      PvE
    </h2>
    <div className="games-section__row">
      <p className="games-section__subtitle">Player vs Environment</p>
      <a className="games-section__viewall" href="/games-pve">
        View all
      </a>
    </div>
    <div className="games-section__grid" role="list" aria-label="PvE games">
      {pveGames.map((game) => (
        <div key={game.slug} role="listitem">
          <GameCard
            title={game.title}
            image={game.image}
            className={game.glowClass}
            slug={game.slug}
            description={game.description}
            ariaLabel={`Play ${game.title}${
              game.description ? ` - ${game.description}` : ""
            }`}
            comingSoon={game.comingSoon}
          />
        </div>
      ))}
    </div>
  </section>
);

export default PvESection;
