import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../sections/Navbar";
import Sidebar from "../organisms/Sidebar";
import "./GamePageTemplate.css";

// Import game data for related games sidebar
import pvpGames from "../../data/pvpGames";
import pveGames from "../../data/pveGames";
import freeGames from "../../data/freeGames";
import { GAME_ROUTES, ROUTES } from "../../constants";
import { useIsMobile } from "../../hooks/useIsMobile";

// Game videos mapping
const gameVideos: Record<string, string> = {
  embeddedwars: "/gameVideos/Embedded Wars.mp4",
  asteroids: "/gameVideos/Asteroids.mp4",
  smugglersrun: "/gameVideos/Smugglers Run.mp4",
  cyberarena: "/gameVideos/Outer Colosseum.mp4",
  underwateradventure: "/gameVideos/Underwater Adventure.mp4",
  topdownshooter: "/gameVideos/Multiplayer Top-Down Shooter.mp4",
  slice: "/gameVideos/Ball Slizing.mp4",
  guerreromaya: "/gameVideos/GuerreroMaya.mp4",
  endlessrunner: "/gameVideos/Endless 3D Runner Templaten.mp4",
};

// Related Game Card Component with hover-to-play video
interface RelatedGameCardProps {
  game: { slug: string; image: string; title: string };
  sizeClass: string;
  onClick: () => void;
}

const RelatedGameCard: React.FC<RelatedGameCardProps> = ({
  game,
  sizeClass,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();
  const videoSrc = gameVideos[game.slug];

  // Don't load videos on mobile to save user data
  const shouldShowVideo = !isMobile && videoSrc;

  return (
    <figure
      className={`related-game ${sizeClass}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={game.image}
        alt={game.title}
        loading="lazy"
        style={{
          display: isHovered && shouldShowVideo ? "none" : "block",
        }}
      />
      {shouldShowVideo && (
        <video
          src={isHovered ? videoSrc : undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          style={{
            display: isHovered ? "block" : "none",
          }}
        />
      )}
      <figcaption>{game.title}</figcaption>
    </figure>
  );
};

interface GamePageTemplateProps {
  gameTitle: string;
  gameComponent: React.ReactNode;
  paymentComponent?: React.ReactNode;
  instructions?: string[];
  gameInfo?: React.ReactNode;
  backgroundImage?: string;
  customContent?: React.ReactNode;
  gameDescription?: string;
  currentGameSlug?: string;
  isLive?: boolean;
  isPvE?: boolean;
  feeText?: string;
}

const GamePageTemplate: React.FC<GamePageTemplateProps> = ({
  gameTitle,
  gameComponent,
  paymentComponent,
  instructions = [],
  backgroundImage,
  gameDescription,
  currentGameSlug,
  isLive = true,
  isPvE = false,
  feeText = "Entry from 0.5 USD",
}) => {
  const navigate = useNavigate();

  // Game route mapping
  const gameRoutes: Record<string, string> = {
    snake: GAME_ROUTES.SNAKE,
    asteroids: GAME_ROUTES.ASTEROIDS,
    embeddedwars: GAME_ROUTES.EMBEDDED_WARS,
    smugglersrun: GAME_ROUTES.SMUGGLERS_RUN,
    embeddedsnake: GAME_ROUTES.EMBEDDED_SNAKE,
    cyberarena: GAME_ROUTES.CYBER_ARENA || "/game/cyberarena",
    underwateradventure: "/game/underwateradventure",
    topdownshooter: "/game/topdownshooter",
    slice: "/game/slice",
    guerreromaya: "/game/guerreromaya",
    endlessrunner: "/game/endlessrunner",
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

  // Combine all games and filter out current game
  const allGames = [...pvpGames, ...pveGames, ...freeGames].filter(
    (game) => game.slug !== currentGameSlug && !game.comingSoon
  );

  // Get a subset of games for the sidebar (max 10)
  const relatedGames = allGames.slice(0, 10);

  return (
    <div className="game-page">
      <Navbar />
      <div className="game-page-layout">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="game-page-main">
          {/* Main Game Card */}
          <div className="game-main-card">
            {/* Game Image/Video Area */}
            <div className="game-main-card__media">
              {backgroundImage && (
                <div
                  className="game-main-card__background"
                  style={{ backgroundImage: `url(${backgroundImage})` }}
                />
              )}
              <div className="game-main-card__gradient" />
              <div className="game-main-card__content">{gameComponent}</div>
            </div>

            {/* Game Info Section */}
            <div className="game-main-card__info">
              {/* Features Row */}
              <div className="game-main-card__features">
                <div className="game-feature">
                  <img
                    src="/multiplayer_icon.svg"
                    alt=""
                    className="game-feature__icon"
                  />
                  <span className="game-feature__label">Multiplayer</span>
                </div>
                <div className="game-feature">
                  <img
                    src="/realtime_icon.png"
                    alt=""
                    className="game-feature__icon"
                  />
                  <span className="game-feature__label">Realtime</span>
                </div>
                <div className="game-feature">
                  <img
                    src="/pvp_icon.png"
                    alt=""
                    className="game-feature__icon"
                  />
                  <span className="game-feature__label">
                    {isPvE ? "PvE" : "PvP"}
                  </span>
                </div>
              </div>

              {/* Title Row */}
              <div className="game-main-card__header">
                <h1 className="game-main-card__title">{gameTitle}</h1>
                {isLive && (
                  <div className="game-main-card__live-badge">LIVE</div>
                )}
              </div>

              {/* Description */}
              <p className="game-main-card__description">
                {gameDescription ||
                  "Fast 1v1 sci-fi duel. Win rounds, bank SOL, climb the seasonal ladder."}
              </p>

              {/* Fee Text */}
              <p className="game-main-card__fee">{feeText}</p>

              {/* Payment/Action Buttons */}
              {paymentComponent && (
                <div className="game-main-card__actions">
                  {paymentComponent}
                </div>
              )}
            </div>
          </div>

          {/* Instructions Box */}
          {instructions.length > 0 && (
            <div className="game-instructions-box">
              <h3 className="game-instructions-box__title">Instructions</h3>
              <div className="game-instructions-box__content">
                {instructions.map((instruction, index) => (
                  <p key={index} className="game-instructions-box__item">
                    - {instruction}
                  </p>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar - Related Games */}
        <aside className="game-page-related">
          <div className="related-games-grid">
            {relatedGames.map((game, index) => {
              // Determine the size class based on position for variety
              const sizeClass =
                index === 0 || index === 4
                  ? "related-game--large"
                  : index === 1 || index === 5
                  ? "related-game--tall"
                  : "related-game--small";

              return (
                <RelatedGameCard
                  key={game.slug}
                  game={game}
                  sizeClass={sizeClass}
                  onClick={() => handleGameClick(game.slug)}
                />
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GamePageTemplate;
