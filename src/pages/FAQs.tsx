import React, { useState } from "react";
import Navbar from "../components/sections/Navbar";
import Footer from "../components/sections/Footer";
import Sidebar from "../components/organisms/Sidebar";
import completePvpGames from "../data/completePvpGames";
import completePveGames from "../data/completePveGames";
import completeFreeGames from "../data/completeFreeGames";
import gridGames, { getGridSizeClass } from "../data/gamePageGridGames";
import { useNavigate } from "react-router-dom";
import { GAME_ROUTES, ROUTES } from "../constants";
import { useIsMobile } from "../hooks/useIsMobile";
import "./FAQs.css";

const FAQS = [
  {
    question: "I’m new to this, where should I start?",
    answer: (
      <>
        Start with <b>Free Play</b> to explore games and get comfortable.
        <br />
        When you’re ready to compete and climb the leaderboard, try{" "}
        <b>PvE Mode</b> or <b>PvP Mode</b>.
      </>
    ),
  },
  {
    question: "Do I need an account to play?",
    answer: (
      <>
        No. You can start playing instantly with no signup and no downloads.
        <br />
        If you choose to enter competitive modes or claim rewards later, you’ll
        be asked to connect a crypto wallet that supports SOL.
      </>
    ),
  },
  {
    question: "Are the games really free?",
    answer: (
      <>
        Yes! All games in Free to Play are completely free to enjoy.
        <br />
        If you choose to play in competitive modes, a small entry is used to
        power the match and leaderboard rewards, but free play is always
        available.
      </>
    ),
  },
  {
    question: "How does PvE mode work?",
    answer: (
      <>
        PvE Mode lets you play quick skill games against the platform and
        steadily climb the leaderboard.
        <br />
        Each match has a small entry of $0.10. When the match ends:
        <br />
        You earn 1 leaderboard point, whether you win or lose.
        <br />
        <br />
        The more you play, the more points you accumulate and the higher you
        climb.
        <br />
        <br />
        It’s a great way to practice, build consistency, and move up the
        rankings at your own pace.
        <br />
        You’ll always see the entry amount before starting a match.
      </>
    ),
  },
  {
    question: "How does PvP mode work?",
    answer: (
      <>
        PvP Mode matches two players head-to-head in a skill-based game.
        <br />
        Both players enter the same match amount and play the match. When the
        game ends:
        <br />
        The winner receives the match payout and earns 2 leaderboard points.
        <br />
        <br />
        The other player earns 1 leaderboard point for participating.
        <br />
        <br />
        You can choose between two match types:
        <br />
        <b>Casual Match</b>
        <br />
        Each player enters $0.50
        <br />
        The winner receives $0.80 total
        <br />
        A small platform fee is applied to support the service
        <br />
        <br />
        <b>Degen Match</b>
        <br />
        Each player enters $5.00
        <br />
        The winner receives $9.00 total
        <br />
        A small platform fee is applied to support the service
        <br />
        <br />
        You’ll always see the exact entry amount, payout, and any fees before
        joining a match.
        <br />
        All matches are skill-based, outcomes depend on player performance, not
        chance.
      </>
    ),
  },
  {
    question: "How does Friendly Match work?",
    answer: (
      <>
        Friendly Match is available in Cyber Arena. Create a private match to
        get a unique code and invite up to 6 friends to join the same arena for
        skill-based action.
        <br />
        <br />
        Each player pays a $0.10 entry fee to join.
        <br />
        Every Friendly Match grants 1 leaderboard point, counting toward monthly
        airdrop rewards for players with points.
        <br />
        It’s a great way to practice, compete, and earn rewards together.
      </>
    ),
  },

  {
    question: "What can I win?",
    answer: (
      <>
        At the end of each month, 20% of Embedded Games’ total platform revenue
        is shared with the top 500 players on the leaderboard.
        <br />
        This pool includes revenue from:
        <br />
        Match activity
        <br />
        Advertising
        <br />
        Other platform sources
        <br />
        <br />
        The higher you rank on the leaderboard, the larger your share of the
        monthly rewards.
        <br />
        Rewards are paid automatically to eligible players.
      </>
    ),
  },
  {
    question: "Do I need a wallet?",
    answer: (
      <>
        Only if you choose to play in PvP Mode or PvE Mode.
        <br />
        You can enjoy all Free to Play games with no wallet, no signup, and no
        downloads.
        <br />
        Connecting a wallet is only used to handle match entries and rewards,
        nothing else.
      </>
    ),
  },
  {
    question: "What currency is used for transactions?",
    answer: (
      <>
        All competitive matches and rewards on Embedded Games are handled using{" "}
        <b>SOL (Solana)</b>.<br />
        This includes entry amounts for PvP and PvE matches.
        <br />
        <br />
        Rewards and leaderboard payouts are also paid in SOL.
        <br />
        <br />
        Free Play does not require any currency - you can enjoy all games
        without spending or connecting a wallet.
        <br />
        <br />
        You’ll always see the exact entry amounts and potential rewards before
        joining any match.
      </>
    ),
  },
  {
    question: "Is it safe?",
    answer: (
      <>
        Yes. Your wallet stays fully under your control.
        <br />
        We never store private keys or personal information. All transactions
        happen directly through your wallet provider.
      </>
    ),
  },
  {
    question: "Are there any hidden fees?",
    answer: (
      <>
        No hidden fees.
        <br />
        You’ll always see exactly what a match costs before you join. Network
        fees depend on your wallet provider.
      </>
    ),
  },
  {
    question: "What is the leaderboard?",
    answer: (
      <>
        The leaderboard shows the top players based on points earned in PvP Mode
        and PvE Mode.
        <br />
        Each match you play in these modes earns leaderboard points.
        <br />
        <br />
        The more points you accumulate, the higher you rank.
        <br />
        <br />
        At the end of each month, the top 500 players share a portion of the
        platform’s monthly rewards.
        <br />
        <br />
        Climbing the leaderboard is a fun way to track your progress and compete
        with others, even if you just play casually.
      </>
    ),
  },
  {
    question: "How does the leaderboard work?",
    answer: (
      <>
        The leaderboard tracks points earned in PvP Mode and PvE Mode.
        <br />
        To earn points, you’ll need to connect a wallet, this is how your
        profile and points are securely tracked.
        <br />
        <br />
        Each match you play in these modes adds points to your total.
        <br />
        <br />
        The more points you accumulate, the higher you climb on the leaderboard.
        <br />
        <br />
        At the end of each month, the top 500 players automatically receive
        their share of 20% of the platform’s monthly revenue.
        <br />
        <br />
        Climbing the leaderboard is a fun way to track progress, compete with
        other players, and earn rewards if you choose to participate.
      </>
    ),
  },
  {
    question: "How do I accumulate points to climb up the leaderboard?",
    answer: (
      <>
        You earn points by playing matches in PvP Mode and PvE Mode.
        <br />
        Each match adds points to your total, win or lose.
        <br />
        <br />
        The more you play, the more points you accumulate.
        <br />
        <br />
        Climbing the leaderboard is a fun way to track progress and compete with
        other players.
        <br />
        <br />
        No wallet is needed for Free Play, but to earn points and climb the
        leaderboard, you’ll need to connect a wallet for the competitive modes.
      </>
    ),
  },
  {
    question: "What devices are supported?",
    answer: (
      <>
        Embedded Games works directly in your browser on desktop and mobile. No
        installs required.
      </>
    ),
  },
  {
    question: "Is this gambling?",
    answer: (
      <>
        No. All competitive modes are skill-based games. Outcomes depend on
        player performance, not chance.
      </>
    ),
  },
];

// Game videos mapping for sidebar
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

const FAQsPage: React.FC = () => {
  const navigate = useNavigate();
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
    <div className="faqs-page">
      <Navbar />
      <div className="faqs-page-layout">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="faqs-page-main">
          <section className="faqs-main-card">
            <header className="faqs-main-card__header">
              <h1 className="faqs-main-card__title">FAQs</h1>
              <p className="faqs-main-card__description">
                Frequently Asked Questions about Embedded Games
              </p>
            </header>
            <div className="faqs-main-card__content">
              <ul className="faqs-list">
                {FAQS.map((faq, idx) => (
                  <li key={idx} className="faqs-list-item">
                    <h2 className="faqs-question">{faq.question}</h2>
                    <div className="faqs-answer">{faq.answer}</div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        {/* Right Sidebar - Related Games (Desktop only) */}
        {typeof window !== "undefined" && window.innerWidth >= 1024 && (
          <aside className="faqs-page-related">
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
      <Footer />
    </div>
  );
};

export default FAQsPage;
