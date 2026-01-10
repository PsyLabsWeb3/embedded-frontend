import MainLayout from "../components/templates/MainLayout";
import GamesPageLayout from "../components/templates/GamesPageLayout";
import GameCard from "../components/molecules/GameCard";
import freeGames from "../data/freeGames";
import "./Games.css";

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

const GamesFree = () => (
  <MainLayout>
    <GamesPageLayout>
      <div className="games-page">
        <div className="games-header">
          <h1 className="games-title">Free to Play</h1>
          <p className="games-subtitle">Free PvE Games to Play</p>
          <p className="games-description">
            All games are free to enjoy, jump in and have fun!
            <br />
            <br />
            These matches are just for fun and don't affect the monthly
            leaderboard.
            <br />
            <br />
            To earn points and climb the rankings, try PVE or PVP Mode.
          </p>
        </div>

        <div className="games-grid">
          {freeGames.map((game) => (
            <GameCard
              key={game.slug}
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
              feeText="Entry from 0.5 USD"
            />
          ))}
        </div>
      </div>
    </GamesPageLayout>
  </MainLayout>
);

export default GamesFree;
