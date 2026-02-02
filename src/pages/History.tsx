import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/sections/Navbar";
import Footer from "../components/sections/Footer";
import Sidebar from "../components/organisms/Sidebar";
import UserHistorySection from "../components/organisms/history/UserHistorySection";
import { LOCAL_STORAGE_CONF, GAME_ROUTES, ROUTES } from "../constants";
import { useMatchHistory } from "../hooks/useMatchHistory";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useIsMobile } from "../hooks/useIsMobile";
import { generateDappKeypair } from "../utils/phantomCrypto";
import "./History.css";

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

const History = () => {
  const navigate = useNavigate();
  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const walletAddress = publicKey?.toString();
  const isConnected = connected && Boolean(walletAddress);

  // Check if mobile device
  const isMobileDevice = () =>
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const mobileSession = localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_SESSION);
  const mobileWalletAddress =
    localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_WALLET_PUBKEY) || undefined;
  const isConnectedMobile = mobileSession && mobileWalletAddress;

  const { loading, error, groups, hasMore, showMore } = useMatchHistory(
    walletAddress || mobileWalletAddress,
    { pageSize: 20 },
  );

  // Game route mapping
  const gameRoutes: Record<string, string> = {
    snake: GAME_ROUTES.SNAKE,
    asteroids: GAME_ROUTES.ASTEROIDS,
    embeddedwars: GAME_ROUTES.EMBEDDED_WARS,
    smugglersrun: GAME_ROUTES.SMUGGLERS_RUN,
    embeddedsnake: GAME_ROUTES.EMBEDDED_SNAKE,
    cyberarena: GAME_ROUTES.CYBER_ARENA || "/game/cyberarena",
    tankieracerattack: GAME_ROUTES.TANKIE_RACER_ATTACK,
    endlessrunner: GAME_ROUTES.ENDLESS_RUNNER,
    guerreromaya: GAME_ROUTES.GUERRERO_MAYA,
    underwateradventure: GAME_ROUTES.UNDERWATER_ADVENTURE,
    topdownshooter: GAME_ROUTES.TOP_DOWN_SHOOTER,
    ballslice: GAME_ROUTES.BALL_SLICE,
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
    <div className="history-page">
      <Navbar />
      <div className="history-page-layout">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="history-page-main">
          {/* Main History Card */}
          <div className="history-main-card">
            {/* Header Section */}
            <div className="history-main-card__header">
              <h1 className="history-main-card__title">Your Match History</h1>
              <p className="history-main-card__description">
                Review your past matches, including match types, results, total
                games played, and the money won or lost in each match.
              </p>
            </div>

            {/* History Content Section */}
            <div className="history-main-card__content">
              {!connected && !isConnectedMobile ? (
                <div className="history-not-connected">
                  <div className="history-not-connected__icon">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <h3 className="history-not-connected__title">
                    Wallet Not Connected
                  </h3>
                  <p className="history-not-connected__description">
                    Connect your wallet to view your match history and track
                    your gaming performance
                  </p>
                  <button
                    className="history-not-connected__button"
                    onClick={() => {
                      if (isMobileDevice()) {
                        // Phantom deep link for mobile
                        const kp = generateDappKeypair();
                        localStorage.setItem(
                          LOCAL_STORAGE_CONF.LOCAL_KEYS,
                          JSON.stringify(kp),
                        );
                        const appUrl = encodeURIComponent(
                          window.location.origin,
                        );
                        const currentPath =
                          window.location.pathname + window.location.search;
                        localStorage.setItem(
                          LOCAL_STORAGE_CONF.LOCAL_REDIRECT,
                          currentPath,
                        );
                        const redirectLink = encodeURIComponent(
                          `${window.location.origin}/phantom-callback?state=${encodeURIComponent(currentPath)}`,
                        );
                        window.location.href =
                          `https://phantom.app/ul/v1/connect?` +
                          `app_url=${appUrl}` +
                          `&redirect_link=${redirectLink}` +
                          `&dapp_encryption_public_key=${encodeURIComponent(kp.publicKeyBase58)}`;
                      } else {
                        // Desktop wallet modal
                        setVisible(true);
                      }
                    }}
                  >
                    Connect Wallet
                  </button>
                </div>
              ) : (
                <UserHistorySection
                  groups={groups}
                  loading={loading}
                  error={error}
                  hasMore={hasMore}
                  onViewMore={showMore}
                  isConnected={isConnected}
                />
              )}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Related Games */}
        <aside className="history-page-related">
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

export default History;
