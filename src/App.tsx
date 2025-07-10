
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
import '@solana/wallet-adapter-react-ui/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Home from './pages/Home';
import Snake2048Page from './pages/Snake2048Page';


const wallets = [
  new PhantomWalletAdapter(),
  new WalletConnectWalletAdapter({
    network: WalletAdapterNetwork.Mainnet,
    options: {
      relayUrl: 'wss://relay.walletconnect.com',
      projectId: '3de88ccc3439125e3b797794ef92929b',
    },
  }),
];

function App() {
  return (
  <ConnectionProvider endpoint={clusterApiUrl('mainnet-beta')}>
  <WalletProvider wallets={wallets} autoConnect>
    <WalletModalProvider>
    <Router>
      <div >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/snake2048" element={<Snake2048Page />} />
        </Routes>
      </div>
    </Router>
    </WalletModalProvider>
  </WalletProvider>
  </ConnectionProvider>
  );
}

export default App;
