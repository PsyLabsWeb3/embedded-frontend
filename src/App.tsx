
/**
 * @fileoverview Main Application Component
 * 
 * The root application component that sets up the core infrastructure
 * including routing, wallet connectivity, and provider context. This
 * component orchestrates the entire application architecture and provides
 * the foundation for all user interactions.
 * 
 * Features:
 * - Solana wallet adapter integration
 * - React Router for client-side routing
 * - Wallet modal and connection management
 * - Game routing and navigation
 * - Provider pattern for state management
 * 
 * @author Embedded Frontend Team
 * @version 1.0.0
 */
import './appkit'; // ← registra AppKit y sus web components
import "@reown/appkit-wallet-button/react";

import React from 'react';
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import {
  WalletModalProvider
} from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  WalletConnectWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

// Import page components
import Home from './pages/Home';
import Snake2048Page from './pages/Snake2048Page';
import EmbeddedGamePage from './pages/EmbeddedGame';
import History from './pages/History';
import Games from './pages/Games';
import Leaderboard from './pages/Leaderboard';
import Rewards from './pages/Rewards';
import Tournaments from './pages/Tournaments';

// Import game page components
import {
  Snake,
  PingPong,
  EmbeddedWars,
  CandySweet,
  SortPuzzle,
  PipesFlood,
  HoverRacer,
  InfiniteRunner,
  CakeMania,
  Game10,
  Game11
} from './components/games/gamePages';

// Import constants for configuration
import { WALLET_CONFIG } from './constants';

/**
 * Wallet adapter configuration
 * 
 * Configures the supported wallet adapters for the application.
 * Currently supports Phantom and WalletConnect for broad compatibility
 * across different user preferences and device types.
 */
const wallets = [
  new PhantomWalletAdapter(),
  new WalletConnectWalletAdapter({
    network: WalletAdapterNetwork.Mainnet,
    options: {
      relayUrl: WALLET_CONFIG.RELAY_URL,
      projectId: WALLET_CONFIG.PROJECT_ID,
    },
  }),
];

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
  return (
    <ConnectionProvider endpoint={clusterApiUrl('devnet')}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Router>
            <div className="app">
              <Routes>
                {/* Main Application Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/snake2048" element={<Snake2048Page />} />
                <Route path="/embedded-game" element={<EmbeddedGamePage />} />
                <Route path="/history" element={<History />} />
                <Route path="/games" element={<Games />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/tournaments" element={<Tournaments />} />
                
                {/* Game-Specific Routes */}
                <Route path="/game/01-snake" element={<Snake />} />
                <Route path="/game/02-ping-pong" element={<PingPong />} />
                <Route path="/game/03-embedded-wars" element={<EmbeddedWars />} />
                <Route path="/game/04-candy-sweet" element={<CandySweet />} />
                <Route path="/game/05-sort-puzzle" element={<SortPuzzle />} />
                <Route path="/game/06-pipes-flood" element={<PipesFlood />} />
                <Route path="/game/07-hover-racer" element={<HoverRacer />} />
                <Route path="/game/08-infinite-runner" element={<InfiniteRunner />} />
                <Route path="/game/09-cake-mania" element={<CakeMania />} />
                <Route path="/game/10-game-10" element={<Game10 />} />
                <Route path="/game/11-game-11" element={<Game11 />} />
              </Routes>
            </div>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
