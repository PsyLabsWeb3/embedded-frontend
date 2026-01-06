/**
 * @fileoverview GameListSection Component
 *
 * A featured games section that displays a curated selection of popular
 * games in an attractive grid layout. This component serves as a key
 * discovery mechanism for users to find and engage with platform content.
 *
 * Features:
 * - Responsive grid layout
 * - Featured game display
 * - Professional section styling
 * - Accessibility support
 * - Theme integration
 *
 * @author Embedded Frontend Team
 * @version 1.0.0
 */

import React from "react";
import games from "../../data/games";
import pveGames from "../../data/pveGames";
import GameCard from "../molecules/GameCard";

// Import theme and component styles
import "../../styles/theme.css";
import "../../styles/utilities.css";
import "../../styles/sections/GameList.css";
import "../../styles/sections/GameCard.css";

/**
 * GameListSection Component
 *
 * Renders a section showcasing featured "Hot Games" in a responsive grid.
 * Each game is displayed using the GameCard component, providing consistent
 * styling and interaction patterns across the platform.
 *
 * The component uses semantic HTML with proper heading hierarchy and
 * follows accessibility best practices for screen reader compatibility.
 *
 * @returns JSX element representing the featured games section
 */
const GameListSection: React.FC = () => (
  <section
    className="game-list-section container mx-container"
    aria-labelledby="hot-games-heading"
  >
    {/* Section Heading */}
    <h2 id="hot-games-heading" className="game-list__title gradient-title">
      PvE
    </h2>
    {/* Games Grid */}
    <div
      className="game-list__grid"
      role="list"
      aria-label="Featured games collection"
    >
      {pveGames.map((game) => (
        <div key={game.slug} role="listitem">
          <GameCard
            title={game.title}
            image={game.image}
            className={game.glowClass}
            slug={game.slug}
            description={game.description}
            isLive={!game.comingSoon}
            ariaLabel={`Play ${game.title}${
              game.description ? ` - ${game.description}` : ""
            }`}
            comingSoon={game.comingSoon}
          />
        </div>
      ))}
    </div>
    {/* Section Heading */}
    <h2 id="hot-games-heading" className="game-list__title gradient-title">
      PvP
    </h2>
    {/* Games Grid */}
    <div
      className="game-list__grid"
      role="list"
      aria-label="Featured games collection"
    >
      {games.map(
        (game) =>
          !game.comingSoon && (
            <div key={game.slug} role="listitem">
              <GameCard
                title={game.title}
                image={game.image}
                className={game.glowClass}
                slug={game.slug}
                description={game.description}
                isLive={!game.comingSoon}
                ariaLabel={`Play ${game.title}${
                  game.description ? ` - ${game.description}` : ""
                }`}
                comingSoon={game.comingSoon}
              />
            </div>
          )
      )}
    </div>
  </section>
);

export default GameListSection;
