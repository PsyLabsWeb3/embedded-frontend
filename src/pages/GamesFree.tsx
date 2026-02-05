import MainLayout from "../components/templates/MainLayout";
import GamesPageLayout from "../components/templates/GamesPageLayout";
import GameCard from "../components/molecules/GameCard";
import completeFreeGames from "../data/completeFreeGames";
import "./Games.css";

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
  tankieracerattack: "/gameVideos/Tankie Racer Attack.mp4",
  donutmatch: "/gameVideos/Donut Match.mp4",
  zigzagendlessrunner: "/gameVideos/Zigzag Endless Runner.mp4",
  roundball: "/gameVideos/Roundball.mp4",
  crazyball: "/gameVideos/Crazy Ball.mp4",
  swipegame: "/gameVideos/Swipe Game.mp4",
  colorcatch: "/gameVideos/Color Catch.mp4",
  skyhover: "/gameVideos/Sky Hover.mp4",
  stackbreaker: "/gameVideos/Stack Breaker.mp4",
  jumpsky: "/gameVideos/Jumpy Sky.mp4",
  downhillrush: "/gameVideos/DownHill Rush.mp4",
  mazerotator: "/gameVideos/Maze Rotator.mp4",
  smashyball: "/gameVideos/Smashy Ball.mp4",
  hoppyrampage: "/gameVideos/Hoppy Rampage.mp4",
  klondikesolitaire: "/gameVideos/Solitaire.mp4",
};

const GamesFree = () => (
  <MainLayout gradientBackground={true}>
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
          {completeFreeGames.map((game) => (
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
              feeText="Free to Play"
            />
          ))}
        </div>
      </div>
    </GamesPageLayout>
  </MainLayout>
);

export default GamesFree;
