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
import { useNavigate } from "react-router-dom";
import freeGames from "../../data/freeGames";
import pveGames from "../../data/pveGames";
import GameCard from "../molecules/GameCard";
import pvpGames from "../../data/pvpGames";
import { GAME_ROUTES, ROUTES } from "../../constants";

// Import theme and component styles
import "../../styles/theme.css";
import "../../styles/utilities.css";
import "../../styles/sections/GameList.css";
import "../../styles/sections/GameCard.css";
import "../../styles/sections/GameSections.css";

// Game videos mapping
const gameVideos: Record<string, string> = {
  embeddedwars: "/gameVideos/Embedded Wars.mp4",
  asteroids: "/gameVideos/Asteroids.mp4",
  smugglersrun: "/gameVideos/Smugglers Run.mp4",
  cyberarena: "/gameVideos/Outer Colosseum.mp4",
  underwateradventure: "/gameVideos/Underwater Adventure.mp4",
  topdownshooter: "/gameVideos/Multiplayer Top-Down Shooter.mp4",
  ballslice: "/gameVideos/Ball Slizing.mp4",
  guerreromaya: "/gameVideos/GuerreroMaya.mp4",
  endlessrunner: "/gameVideos/Endless 3D Runner Templaten.mp4",
};

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
const GameListSection: React.FC = () => {
  // const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const navigate = useNavigate();

  // Game route mapping
  const gameRoutes: Record<string, string> = {
    snake: GAME_ROUTES.SNAKE,
    asteroids: GAME_ROUTES.ASTEROIDS,
    embeddedwars: GAME_ROUTES.EMBEDDED_WARS,
    smugglersrun: GAME_ROUTES.SMUGGLERS_RUN,
    embeddedsnake: GAME_ROUTES.EMBEDDED_SNAKE,
    cyberarena: GAME_ROUTES.CYBER_ARENA,
    underwateradventure: GAME_ROUTES.UNDERWATER_ADVENTURE,
    topdownshooter: GAME_ROUTES.TOP_DOWN_SHOOTER,
    ballslice: GAME_ROUTES.BALL_SLICE,
    guerreromaya: GAME_ROUTES.GUERRERO_MAYA,
    endlessrunner: GAME_ROUTES.ENDLESS_RUNNER,
  };

  const handleGameClick = (slug: string) => {
    const route = gameRoutes[slug];
    if (route) {
      navigate(route);
    } else {
      console.warn(`No route found for game slug: ${slug}`);
      navigate(ROUTES.GAMES_PVE);
    }
  };

  return (
    <section
      className="game-list-section section mx-container"
      aria-labelledby="hot-games-heading"
    >
      {/* Section Heading */}
      <h2 id="free-to-play-heading" className="games-section__title">
        Free to Play
      </h2>
      <div className="games-section__row">
        <p className="games-section__subtitle">Free Games to Play</p>
        <a className="games-section__viewall" href="/games-free">
          View all
        </a>
      </div>

      {/* Mobile-only gallery layout for Free to Play */}
      <div
        className="free-games-gallery"
        aria-label="Featured free games (mobile)"
      >
        {freeGames[0] && (
          <figure
            className="free-games-gallery__item free-games-gallery__item--main"
            onClick={() => handleGameClick(freeGames[0].slug)}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <img
              src={freeGames[0].image}
              alt={freeGames[0].title}
              loading="lazy"
              style={{
                display: gameVideos[freeGames[0].slug] ? "none" : "block",
              }}
            />
            {gameVideos[freeGames[0].slug] && (
              <video
                src={gameVideos[freeGames[0].slug]}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
            <figcaption>{freeGames[0].title}</figcaption>
          </figure>
        )}
        {freeGames[1] && (
          <figure
            className="free-games-gallery__item free-games-gallery__item--top-right"
            onClick={() => handleGameClick(freeGames[1].slug)}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <img
              src={freeGames[1].image}
              alt={freeGames[1].title}
              loading="lazy"
              style={{ display: "block" }}
            />
            <figcaption>{freeGames[1].title}</figcaption>
          </figure>
        )}
        {freeGames[2] && (
          <figure
            className="free-games-gallery__item free-games-gallery__item--bottom"
            onClick={() => handleGameClick(freeGames[2].slug)}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <img
              src={freeGames[2].image}
              alt={freeGames[2].title}
              loading="lazy"
              style={{ display: "block" }}
            />
            <figcaption>{freeGames[2].title}</figcaption>
          </figure>
        )}
      </div>
      {/* Games Grid for larger screens */}
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
              video={gameVideos[game.slug]}
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
      {/* Mobile-only gallery layout for Free to Play */}
      <div
        className="free-games-gallery"
        aria-label="Featured PVP games (mobile)"
      >
        {pvpGames[0] && (
          <figure
            className="free-games-gallery__item free-games-gallery__item--main"
            onClick={() => handleGameClick(pvpGames[0].slug)}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <img
              src={pvpGames[0].image}
              alt={pvpGames[0].title}
              loading="lazy"
              style={{
                display: gameVideos[pvpGames[0].slug] ? "none" : "block",
              }}
            />
            {gameVideos[pvpGames[0].slug] && (
              <video
                src={gameVideos[pvpGames[0].slug]}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
            <figcaption>{pvpGames[0].title}</figcaption>
          </figure>
        )}
        {pvpGames[1] && (
          <figure
            className="free-games-gallery__item free-games-gallery__item--top-right"
            onClick={() => handleGameClick(pvpGames[1].slug)}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <img
              src={pvpGames[1].image}
              alt={pvpGames[1].title}
              loading="lazy"
              style={{ display: "block" }}
            />
            <figcaption>{pvpGames[1].title}</figcaption>
          </figure>
        )}
        {pvpGames[2] && (
          <figure
            className="free-games-gallery__item free-games-gallery__item--bottom"
            onClick={() => handleGameClick(pvpGames[2].slug)}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <img
              src={pvpGames[2].image}
              alt={pvpGames[2].title}
              loading="lazy"
              style={{ display: "block" }}
            />
            <figcaption>{pvpGames[2].title}</figcaption>
          </figure>
        )}
      </div>
      {/* Games Grid (desktop-only via CSS) */}
      <div
        className="game-list__grid game-list__grid--pvp"
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
                  video={gameVideos[game.slug]}
                />
              </div>
            ),
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
      {/* Mobile-only gallery layout for PVE */}
      <div
        className="free-games-gallery"
        aria-label="Featured PVE games (mobile)"
      >
        {pveGames[0] && (
          <figure
            className="free-games-gallery__item free-games-gallery__item--main"
            onClick={() => handleGameClick(pveGames[0].slug)}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <img
              src={pveGames[0].image}
              alt={pveGames[0].title}
              loading="lazy"
              style={{
                display: gameVideos[pveGames[0].slug] ? "none" : "block",
              }}
            />
            {gameVideos[pveGames[0].slug] && (
              <video
                src={gameVideos[pveGames[0].slug]}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                style={{
                  display: "block",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
            <figcaption>{pveGames[0].title}</figcaption>
          </figure>
        )}
        {pveGames[1] && (
          <figure
            className="free-games-gallery__item free-games-gallery__item--top-right"
            onClick={() => handleGameClick(pveGames[1].slug)}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <img
              src={pveGames[1].image}
              alt={pveGames[1].title}
              loading="lazy"
              style={{ display: "block" }}
            />
            <figcaption>{pveGames[1].title}</figcaption>
          </figure>
        )}
        {pveGames[2] && (
          <figure
            className="free-games-gallery__item free-games-gallery__item--bottom"
            onClick={() => handleGameClick(pveGames[2].slug)}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <img
              src={pveGames[2].image}
              alt={pveGames[2].title}
              loading="lazy"
              style={{ display: "block" }}
            />
            <figcaption>{pveGames[2].title}</figcaption>
          </figure>
        )}
      </div>
      {/* Games Grid (desktop-only via CSS) */}
      <div
        className="game-list__grid game-list__grid--pve"
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
                  video={gameVideos[game.slug]}
                />
              </div>
            ),
        )}
      </div>
    </section>
  );
};

export default GameListSection;
