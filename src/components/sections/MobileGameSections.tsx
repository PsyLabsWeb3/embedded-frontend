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
import freeGames from "../../data/freeGames";
import pveGames from "../../data/pveGames";
import GameCard from "../molecules/GameCard";
import pvpGames from "../../data/pvpGames";

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
    className="game-list-section section mx-container"
    aria-labelledby="hot-games-heading"
  >
    {/* Section Heading */}
    <h2 id="free-to-play-heading" className="games-section__title">
      Free to Play
    </h2>
    <div className="games-section__row">
      <p className="games-section__subtitle">Free PvE Games to Play</p>
      <a className="games-section__viewall" href="/games-pve">
        View all
      </a>
    </div>

    {/* Mobile-only gallery layout for Free to Play */}
    <div
      className="free-games-gallery"
      aria-label="Featured free games (mobile)"
    >
      {freeGames[0] && (
        <figure className="free-games-gallery__item free-games-gallery__item--main">
          <img src={freeGames[0].image} alt={freeGames[0].title} />
          <figcaption>{freeGames[0].title}</figcaption>
        </figure>
      )}
      {freeGames[1] && (
        <figure className="free-games-gallery__item free-games-gallery__item--top-right">
          <img src={freeGames[1].image} alt={freeGames[1].title} />
          <figcaption>{freeGames[1].title}</figcaption>
        </figure>
      )}
      {freeGames[2] && (
        <figure className="free-games-gallery__item free-games-gallery__item--bottom">
          <img src={freeGames[2].image} alt={freeGames[2].title} />
          <figcaption>{freeGames[2].title}</figcaption>
        </figure>
      )}
    </div>
    <div
      className="game-list__grid game-list__grid--free"
      role="list"
      aria-label="Featured games collection"
    >
      {freeGames.map((game) => (
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
    <h2 id="pvp-heading" className="games-section__title">
      PVP
    </h2>
    <div className="games-section__row">
      <p className="games-section__subtitle">Player vs Player</p>
      <a className="games-section__viewall" href="/games-pvp">
        View all
      </a>
    </div>
    {/* Games Grid */}
    <div
      className="game-list__grid"
      role="list"
      aria-label="Featured games collection"
    >
      {pvpGames.map(
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
    {/* Section Heading */}
    <h2 id="pve-heading" className="games-section__title">
      PVE
    </h2>
    <div className="games-section__row">
      <p className="games-section__subtitle">Player vs Enviroment</p>
      <a className="games-section__viewall" href="/games-pve">
        View all
      </a>
    </div>
    {/* Games Grid */}
    <div
      className="game-list__grid"
      role="list"
      aria-label="Featured games collection"
    >
      {pveGames.map(
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
