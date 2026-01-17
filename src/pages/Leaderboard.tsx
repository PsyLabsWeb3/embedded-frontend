import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/sections/Navbar";
import Footer from "../components/sections/Footer";
import Sidebar from "../components/organisms/Sidebar";
import LeaderboardTable from "../components/LeaderboardTable";
import { GAME_ROUTES, ROUTES } from "../constants";
import { useIsMobile } from "../hooks/useIsMobile";
import "./Leaderboard.css";

// Import game data for related games sidebar
import completePvpGames from "../data/completePvpGames";
import completePveGames from "../data/completePveGames";
import completeFreeGames from "../data/completeFreeGames";
import gridGames, { getGridSizeClass } from "../data/gamePageGridGames";

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
  embeddedsnake: "/gameVideos/Embedded Snake.mp4",
  tankieracerattack: "/gameVideos/Tankie Racer Attack.mp4",
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
        style={{ display: isHovered && shouldShowVideo ? "none" : "block" }}
      />
      {shouldShowVideo && (
        <video
          src={isHovered ? videoSrc : undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          style={{ display: isHovered ? "block" : "none" }}
        />
      )}
      <figcaption>{game.title}</figcaption>
    </figure>
  );
};

const LeaderboardPage: React.FC = () => {
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
      navigate(ROUTES.GAMES_PVE);
    }
  };

  // Combine all games for lookup
  const allGames = [
    ...completePvpGames,
    ...completePveGames,
    ...completeFreeGames,
  ].filter((game) => !game.comingSoon);

  const gamesBySlug = new Map(allGames.map((game) => [game.slug, game]));

  // Get games for the grid based on configuration
  const relatedGames = gridGames
    .map((gridGame) => {
      const game = gamesBySlug.get(gridGame.slug);
      return game ? { ...game, position: gridGame.position } : null;
    })
    .filter((game): game is NonNullable<typeof game> => game !== null)
    .slice(0, 12);

  return (
    <div className="leaderboard-page">
      <Navbar />
      <div className="leaderboard-page-layout">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="leaderboard-page-main">
          {/* Main Leaderboard Card */}
          <div className="leaderboard-main-card">
            {/* Header Section */}
            <div className="leaderboard-main-card__header">
              <h1 className="leaderboard-main-card__title">
                Monthly Leaderboard
              </h1>
              <p className="leaderboard-main-card__description">
                This is where the champions stand. The top 500 players battling
                it out this month. By month's end, each of these competitors
                will claim a share of 20% of the platform's revenue. Think you
                belong here? Prove it by grinding through PvP or PvE modes and
                securing your spot.
              </p>
            </div>

            {/* Leaderboard Content Section */}
            <div className="leaderboard-main-card__content">
              <LeaderboardTable title="" />
            </div>
          </div>
        </main>

        {/* Right Sidebar - Related Games */}
        <aside className="leaderboard-page-related">
          <div className="related-games-grid">
            {relatedGames.map((game) => (
              <RelatedGameCard
                key={`${game.slug}-${game.position}`}
                game={game}
                sizeClass={getGridSizeClass(game.position)}
                onClick={() => handleGameClick(game.slug)}
              />
            ))}
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
};

export default LeaderboardPage;
