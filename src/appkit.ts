import { createAppKit } from '@reown/appkit';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
// import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
// import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { solana /* o solana (mainnet) */ } from '@reown/appkit/networks';
import { WALLET_CONFIG } from './constants';

// 0. Set up Solana Adapter
const solanaWeb3JsAdapter = new SolanaAdapter();

// Crea la instancia global de AppKit (registra web components como <appkit-button/>)
export const appkit = createAppKit({
  adapters: [solanaWeb3JsAdapter],
  projectId: WALLET_CONFIG.PROJECT_ID, // tu Project ID de Reown
  networks: [solana],            // cámbialo a [solana] si usas mainnet
  metadata: {
    name: 'Embedded Games',
    description: 'Mini juegos on-chain',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://embedded-frontend-git-em-62-appkit-v-street.vercel.app',
    icons: ['https://tu-dominio.com/icon.png'],
  },
});
