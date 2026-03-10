/**
 * @fileoverview Main Application Component
 *
 * The root application component that sets up the core infrastructure
 * including routing, wallet connectivity, and provider context. This
 * component orchestrates the entire application architecture and provides
 * the foundation for all user interactions.
 *
 *
 * @author Embedded Frontend Team
 * @version 1.0.0
 */
import "./appkit"; // ← registra AppKit y sus web components
import "@reown/appkit-wallet-button/react";

import React from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  WalletConnectWalletAdapter,
} from "@solana/wallet-adapter-wallets";
// import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

// Import page components
import Home from "./pages/Home";
import Snake2048Page from "./pages/Snake2048Page";
import EmbeddedGamePage from "./pages/EmbeddedGame";
import History from "./pages/History";
import GamesPvP from "./pages/GamesPvP";
import GamesPvE from "./pages/GamesPvE";
import GamesFree from "./pages/GamesFree";
import Leaderboard from "./pages/Leaderboard";
import Rewards from "./pages/Rewards";
import Tournaments from "./pages/Tournaments";
import PhantomCallback from "./pages/PhantomCallback";
import PhantomSignCallback from "./pages/PhantomSignCallback";
import Whitepaper from "./pages/Whitepaper";
import FAQsPage from "./pages/FAQs";
import ScrollToTop from "./components/atoms/ScrollToTop";

// Import game page components
import {
  Snake,
  Asteroids,
  EmbeddedWars,
  SmugglersRun,
  EmbeddedSnake,
  CyberArena,
} from "./components/games/gamePages";
import TankieRacerAttack from "./components/games/gamePages/14_TankieRacerAttack";

// Import constants for configuration
import { WALLET_CONFIG } from "./constants";

// Import Terms Modal
import TermsModal from "./components/molecules/TermsModal";
import "./styles/geoblock.css";
import EndlessRunner from "./components/games/gamePages/15_EndlessRunner";
import GuerreroMaya from "./components/games/gamePages/16_GuerreroMaya.tsx";
import DonutMatch from "./components/games/gamePages/04_DonutMatch.tsx";
import TopDownShooter from "./components/games/gamePages/17_TopDownShooter.tsx";
import BallSlice from "./components/games/gamePages/05_BallSlice.tsx";
import UnderwaterAdventure from "./components/games/gamePages/06_UnderwaterAdventure.tsx";
import ZigZagEndlessRunner from "./components/games/gamePages/07_ZigZagEndlessRunner.tsx";
import RoundBall from "./components/games/gamePages/08_RoundBall.tsx";
import CrazyBall from "./components/games/gamePages/09_CrazyBall.tsx";
import SwipeGame from "./components/games/gamePages/10_SwipeGame.tsx";
import ColorCatch from "./components/games/gamePages/11_ColorCatch.tsx";
import SkyHover from "./components/games/gamePages/18_SkyHover.tsx";
import StackBreaker from "./components/games/gamePages/19_StackBreaker.tsx";
import JumpSky from "./components/games/gamePages/20_JumpSky.tsx";
import DownhillRush from "./components/games/gamePages/21_DownhillRush.tsx";
import MazeRotator from "./components/games/gamePages/22_MazeRotator.tsx";
import SmashyBall from "./components/games/gamePages/23_SmashyBall.tsx";
import HoppyRampage from "./components/games/gamePages/24_HoppyRampage.tsx";
import KlondikeSolitaire from "./components/games/gamePages/25_KlondikeSolitaire.tsx";

// Import Geoblocker
import { useGeoblock } from "./hooks/useGeoblock";

/**
 * Wallet adapter configuration
 *
 * Configures the supported wallet adapters for the application.
 * Currently supports Phantom and WalletConnect for broad compatibility
 * across different user preferences and device types.
 */

const NET = WalletAdapterNetwork.Mainnet;
const wallets = [
  new PhantomWalletAdapter(),
  new WalletConnectWalletAdapter({
    network: NET,
    options: {
      relayUrl: WALLET_CONFIG.RELAY_URL,
      projectId: WALLET_CONFIG.PROJECT_ID,
    },
  }),
];

const RPC = import.meta.env.VITE_SOLANA_RPC;

/**
 * App Component
 *
 * The main application component that provides the foundational structure
 * and context for the entire platform. This component:
 *
 * 1. Sets up wallet connectivity with Solana blockchain
 * 2. Configures routing for all application pages
 * 3. Provides modal context for wallet interactions
 * 4. Establishes the component tree architecture
 *
 * The component uses the provider pattern to ensure wallet state and
 * routing context are available throughout the application hierarchy.
 *
 * @returns JSX element representing the entire application
 */
const App: React.FC = () => {
  const geo = useGeoblock();

  if (geo.loading) {
    return (
      <div className="geoblock-message-bg">
        <div className="geoblock-message">
          <p>Checking region eligibility…</p>
        </div>
      </div>
    );
  }

  if (!geo.allowed) {
    return (
      <div className="geoblock-message-bg">
        <div className="geoblock-message">
          <h1>Embedded is not available in your region</h1>
          <p>
            Due to regulatory restrictions, our platform cannot be accessed from
            your current location.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ConnectionProvider endpoint={RPC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <div className="app">
              {/* Terms and Conditions Modal - shown on first visit */}
              <TermsModal />

              <ScrollToTop />

              <Routes>
                {/* Main Application Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/snake2048" element={<Snake2048Page />} />
                <Route path="/embedded-game" element={<EmbeddedGamePage />} />
                <Route path="/history" element={<History />} />
                <Route path="/games-pvp" element={<GamesPvP />} />
                <Route path="/games-pve" element={<GamesPvE />} />
                <Route path="/games-free" element={<GamesFree />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/phantom-callback" element={<PhantomCallback />} />
                <Route
                  path="/phantom-sign-callback"
                  element={<PhantomSignCallback />}
                />

                <Route path="/whitepaper" element={<Whitepaper />} />

                {/* FAQs Page */}
                <Route path="/faqs" element={<FAQsPage />} />

                {/* Game-Specific Routes */}
                <Route path="/game/01-snake" element={<Snake />} />
                <Route path="/game/02-asteroids" element={<Asteroids />} />
                <Route
                  path="/game/03-embedded-wars"
                  element={<EmbeddedWars />}
                />
                <Route
                  path="/game/12-smugglers-run"
                  element={<SmugglersRun />}
                />
                <Route
                  path="/game/01-embedded-snake"
                  element={<EmbeddedSnake />}
                />
                <Route path="/game/04-donut-match" element={<DonutMatch />} />
                <Route path="/game/13-cyber-arena" element={<CyberArena />} />
                <Route
                  path="/game/14-tankie-racer-attack"
                  element={<TankieRacerAttack />}
                />
                <Route
                  path="/game/15-endless-runner"
                  element={<EndlessRunner />}
                />
                <Route
                  path="/game/16-guerrero-maya"
                  element={<GuerreroMaya />}
                />
                <Route
                  path="/game/17-top-down-shooter"
                  element={<TopDownShooter />}
                />
                <Route path="/game/05-ball-slice" element={<BallSlice />} />
                <Route
                  path="/game/06-underwater-adventure"
                  element={<UnderwaterAdventure />}
                />
                <Route
                  path="/game/07-zigzag-endless-runner"
                  element={<ZigZagEndlessRunner />}
                />
                <Route path="/game/08-round-ball" element={<RoundBall />} />
                <Route path="/game/09-crazy-ball" element={<CrazyBall />} />
                <Route path="/game/10-swipe-game" element={<SwipeGame />} />
                <Route path="/game/11-color-catch" element={<ColorCatch />} />
                <Route path="/game/18-sky-hover" element={<SkyHover />} />
                <Route
                  path="/game/19-stack-breaker"
                  element={<StackBreaker />}
                />
                <Route path="/game/20-jump-sky" element={<JumpSky />} />
                <Route
                  path="/game/21-downhill-rush"
                  element={<DownhillRush />}
                />
                <Route path="/game/22-maze-rotator" element={<MazeRotator />} />
                <Route path="/game/23-smashy-ball" element={<SmashyBall />} />
                <Route
                  path="/game/24-hoppy-rampage"
                  element={<HoppyRampage />}
                />
                <Route
                  path="/game/25-klondike-solitaire"
                  element={<KlondikeSolitaire />}
                />
              </Routes>
            </div>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
