import MainLayout from "../components/templates/MainLayout";
import GamesPageLayout from "../components/templates/GamesPageLayout";
import GameCard from "../components/molecules/GameCard";
import completePvpGames from "../data/completePvpGames";
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
  <MainLayout gradientBackground={true}>
    <GamesPageLayout>
      <div className="games-page">
        <div className="games-header">
          <h1 className="games-title">Player vs Player</h1>
          <p className="games-subtitle">Player vs Player - Web3 Feature</p>
          <p className="games-description">
            Head to head skill matches against other players. Choose amongst our
            three modalities:
            <br />
            <br />
            <span className="mode-title">Casual mode</span> - Small entry fee of
            $.5 per player. Winner takes both entry fees (Minus the match fees)
            plus 2 leaderboard points while the loser only takes 1 point.
            <br />
            <br />
            <span style={{ color: "#ae43ff" }} className="mode-title">
              Degen mode
            </span>{" "}
            - Bigger entry fee of $5 per player. Winner takes both entry fees
            (Minus the match fees) plus 2 leaderboard points while the loser
            only takes 1 point.
            <br />
            <br />
            <span className="mode-title">Friendly mode</span> - Small entry fee
            of $.1 per player. The result doesn't matter. Each player gets 1
            leaderboard point.
          </p>
        </div>

        <div className="games-grid">
          {completePvpGames.map((game) => (
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
