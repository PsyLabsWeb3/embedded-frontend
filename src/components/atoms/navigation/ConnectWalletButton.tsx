import '../../../styles/sections/ConnectWalletButton.css';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import walletIcon from '../../../assets/walletIcon.svg';
import { generateDappKeypair } from '../../../utils/phantomCrypto';
import { LOCAL_STORAGE_CONF } from '../../../constants';
import { useMemo } from 'react';

// --- helpers de plataforma ---
const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

// --- TIPADO del web component para TypeScript ---
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        namespace?: 'solana';
        size?: 'sm' | 'md' | 'lg';
        balance?: 'hide' | 'show';
      };
    }
  }
}

// Componente responsivo para conectar la wallet
const ConnectWalletButton = () => {
  const { publicKey, connected, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  // --- MÓVIL => Phantom Deep Link
  if (isMobile()) {
    // Read stored session + pubkey
    const session = localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_SESSION);
    const walletPubKey = localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_WALLET_PUBKEY);

    const handlePhantomConnect = () => {
      const kp = generateDappKeypair();
      localStorage.setItem(LOCAL_STORAGE_CONF.LOCAL_KEYS, JSON.stringify(kp));

      const appUrl = encodeURIComponent(window.location.origin);
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem(LOCAL_STORAGE_CONF.LOCAL_REDIRECT, currentPath);
      const redirectLink = encodeURIComponent(
        `${window.location.origin}/phantom-callback?state=${encodeURIComponent(currentPath)}`
      );

      window.location.href =
  `https://phantom.app/ul/v1/connect?` +
  `app_url=${appUrl}` +
  `&redirect_link=${redirectLink}` +
  `&dapp_encryption_public_key=${encodeURIComponent(kp.publicKeyBase58)}`;
    };

    const handlePhantomDisconnect = () => {
      localStorage.removeItem(LOCAL_STORAGE_CONF.LOCAL_SESSION);
      localStorage.removeItem(LOCAL_STORAGE_CONF.LOCAL_WALLET_PUBKEY);
      localStorage.removeItem(LOCAL_STORAGE_CONF.LOCAL_KEYS);
      window.location.reload();
    };

    if (session && walletPubKey) {
      const short =
        walletPubKey.slice(0, 4) + "..." + walletPubKey.slice(-4);
      return (
        <button
          onClick={handlePhantomDisconnect}
          className="btn bg-red-500"
        >
          Disconnect ({short})
        </button>
      );
    }

    return (
      <button onClick={handlePhantomConnect} className="btn bg-purple-500">
        Connect Phantom
      </button>
    );
  }

  // Desktop o móvil con inyección -> tu flujo con wallet-adapter
  const short = useMemo(
    () =>
      publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : '----',
    [publicKey]
  );

  const handleClickConnect = () => {
    setVisible(true);
  };

  return connected ? (
    <button onClick={disconnect} className="btn bg-red-500" disabled={connecting}>
      Disconnect ({short})
    </button>
  ) : (
    <button onClick={handleClickConnect} className="btn bg-blue-500" disabled={connecting}>
      <img src={walletIcon} alt="wallet" className="w-6 h-6" />
      <span className="ml-2">{connecting ? 'Connecting…' : 'Connect'}</span>
    </button>
  );
};

export default ConnectWalletButton;
