import React from "react";
import Navbar from "../components/sections/Navbar";
import Footer from "../components/sections/Footer";
import Sidebar from "../components/organisms/Sidebar";
import completePvpGames from "../data/completePvpGames";
import completePveGames from "../data/completePveGames";
import completeFreeGames from "../data/completeFreeGames";
import TOURNAMENTS from "../data/tournaments";
import type { Tournament as TournamentType } from "../data/tournaments";
import gridGames, { getGridSizeClass } from "../data/gamePageGridGames";
import { useIsMobile } from "../hooks/useIsMobile";
import { useNavigate } from "react-router-dom";
import { GAME_ROUTES, ROUTES } from "../constants";
import "./Tournaments.css";

// Tournament data now imported from ../data/tournaments

// Modal component for tournament info
interface TournamentModalProps {
  open: boolean;
  onClose: () => void;
  tournament: TournamentType | null;
}
const TournamentModal: React.FC<TournamentModalProps> = ({
  open,
  onClose,
  tournament,
}) => {
  if (!open || !tournament) return null;
  return (
    <div className="tournament-modal-overlay" onClick={onClose}>
      <div
        className="tournament-modal tournament-modal--premium tournament-modal--large"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="tournament-modal__close" onClick={onClose}>
          &times;
        </button>
        <div className="tournament-modal__icon">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="#5dd62c" />
            <path
              d="M12 7v5l4 2"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="tournament-modal__image-wrapper">
          <img
            src={tournament.image}
            alt={tournament.title}
            className="tournament-modal__image"
          />
        </div>
        <div className="tournament-modal__info">
          <h2 className="tournament-modal__title" style={{ color: "#5dd62c" }}>
            {tournament.title}
          </h2>
          <div className="tournament-modal__meta">
            <div>
              <b>Status:</b>{" "}
              <span style={{ color: tournament.statusColor }}>
                {tournament.status}
              </span>
            </div>
            <div>
              <b>Game:</b> {tournament.game}
            </div>
            <div>
              <b>Date:</b> {tournament.date}
            </div>
            <div>
              <b>Time:</b> {tournament.time}
            </div>
            <div>
              <b>Reward:</b> {tournament.reward}
            </div>
          </div>
          <p className="tournament-modal__description">
            {tournament.details ? (
              <span dangerouslySetInnerHTML={{ __html: tournament.details }} />
            ) : (
              tournament.description
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const TournamentCard = ({
  tournament,
  onView,
}: {
  tournament: TournamentType;
  onView: () => void;
}) => (
  <div className="tournament-card">
    <div className="tournament-card__image-wrapper">
      <img
        src={tournament.image}
        alt={tournament.title}
        className="tournament-card__image"
      />
      <div className="tournament-card__image-gradient" />
    </div>
    <div className="tournament-card__content">
      <div className="tournament-card__header">
        <h2 className="tournament-card__title">{tournament.title}</h2>
        <span
          className="tournament-card__status"
          style={{
            borderColor: tournament.statusColor,
            background: `${tournament.statusColor}29`,
            color: "#fff",
          }}
        >
          {tournament.status}
        </span>
      </div>
      <p className="tournament-card__description">{tournament.description}</p>
      <div className="tournament-card__footer">
        {
          <button
            className="tournament-card__view-btn"
            onClick={onView}
            disabled={tournament.status === "COMING SOON"}
            style={
              tournament.status === "COMING SOON"
                ? { opacity: 0.6, cursor: "not-allowed" }
                : {}
            }
          >
            View
          </button>
        }
        <span className="tournament-card__reward">{tournament.reward}</span>
      </div>
    </div>
  </div>
);

const TournamentsPage: React.FC = () => {
  const navigate = useNavigate();
  // Game route mapping
  const gameRoutes: Record<string, string> = {
    snake: GAME_ROUTES.SNAKE,
    asteroids: GAME_ROUTES.ASTEROIDS,
    embeddedwars: GAME_ROUTES.EMBEDDED_WARS,
    smugglersrun: GAME_ROUTES.SMUGGLERS_RUN,
    embeddedsnake: GAME_ROUTES.EMBEDDED_SNAKE,
    cyberarena: GAME_ROUTES.CYBER_ARENA,
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

  // Game videos mapping (copied from Leaderboard)
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
    embeddedsnake: "/gameVideos/Embedded Snake.mp4",
    tankieracerattack: "/gameVideos/Tankie Racer Attack.mp4",
  };

  // RelatedGameCard copied from Leaderboard
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
    const [isHovered, setIsHovered] = React.useState(false);
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

  // Get games for the grid based on configuration (same as Leaderboard)
  const relatedGames = gridGames
    .map((gridGame) => {
      const game = gamesBySlug.get(gridGame.slug);
      return game ? { ...game, position: gridGame.position } : null;
    })
    .filter((game): game is NonNullable<typeof game> => game !== null)
    .slice(0, 12);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalTournament, setModalTournament] =
    React.useState<TournamentType | null>(null);

  return (
    <div className="tournaments-page">
      <Navbar />
      <div className="tournaments-page-layout">
        {/* Left Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <main className="tournaments-page-main">
          <section className="tournaments-main-card">
            <header className="tournaments-main-card__header">
              <h1 className="tournaments-main-card__title">Tournaments</h1>
              <p className="tournaments-main-card__description">
                Get ready to compete at the next level! We host two live
                tournaments every month, where top players face off in PvP
                matches.
              </p>
              <ul className="tournaments-main-card__list">
                <li>
                  Open to all competitive players - join any tournament by
                  participating in PvP Mode matches.
                </li>
                <li>
                  Live streamed - watch the action in real time and cheer on
                  your favorite players.
                </li>
                <li>
                  Win points, climb the leaderboard, and earn rewards - the
                  higher you place, the more recognition you get.
                </li>
              </ul>
              <p className="tournaments-main-card__note">
                Tournaments are fast-paced, exciting, and a great way to test
                your skills against other players. Whether you’re a casual
                competitor or aiming for the top, every match counts!
              </p>
            </header>
            <div className="tournaments-main-card__content">
              {TOURNAMENTS.map((tournament, idx) => (
                <TournamentCard
                  key={idx}
                  tournament={tournament}
                  onView={() => {
                    setModalTournament(tournament);
                    setModalOpen(true);
                  }}
                />
              ))}
            </div>
          </section>
        </main>
        {/* Right Sidebar - Related Games (Desktop only) */}
        {typeof window !== "undefined" && window.innerWidth >= 1024 && (
          <aside className="tournaments-page-related">
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
        )}
      </div>
      <TournamentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tournament={modalTournament}
      />
      <Footer />
    </div>
  );
};

export default TournamentsPage;
