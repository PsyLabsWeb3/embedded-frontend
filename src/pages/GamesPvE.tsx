import MainLayout from "../components/templates/MainLayout";
import GamesPageLayout from "../components/templates/GamesPageLayout";
import GameCard from "../components/molecules/GameCard";
import pveGames from "../data/pveGames";
import "./Games.css";
import "./GamesPvE.css";

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

const GamesPvE = () => (
  <MainLayout>
    <GamesPageLayout>
      <div className="games-pve-page">
        <div className="games-pve-header">
          <h1 className="games-pve-title">Player vs Environment</h1>
          <p className="games-pve-subtitle">Player vs Environment - Web3 Feature</p>
          <p className="games-pve-description">
            Single player games to earn points and climb the leaderboard.
            <br />
            <br />
            Play solo against the game itself, no opponents required.
            <br />
            <br />
            Win matches to earn leaderboard points and compete for monthly prizes.
          </p>
        </div>

        <div className="games-pve-grid">
          {pveGames.map((game) => (
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

export default GamesPvE;
