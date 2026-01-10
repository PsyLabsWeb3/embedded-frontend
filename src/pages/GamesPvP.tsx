import MainLayout from "../components/templates/MainLayout";
import GamesPageLayout from "../components/templates/GamesPageLayout";
import GameCard from "../components/molecules/GameCard";
import pvpGames from "../data/pvpGames";
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

const GamesPvP = () => (
  <MainLayout>
    <GamesPageLayout>
      <div className="games-page">
        <div className="games-header">
          <h1 className="games-title">Player vs Player</h1>
          <p className="games-subtitle">Player vs Player - Web3 Feature</p>
          <p className="games-description">
            Head to head skill matches against other players.
            <br />
            <br />
            Choose a low entry match or a high stakes match when you're ready.
            <br />
            <br />
            Winners take the match's pool and earn 2 leaderboard point or take 1
            point of you lose the match.
          </p>
        </div>

        <div className="games-grid">
          {pvpGames.map((game) => (
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

export default GamesPvP;
