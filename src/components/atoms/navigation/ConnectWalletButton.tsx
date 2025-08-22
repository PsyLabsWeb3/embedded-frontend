// ConnectWalletButton.tsx
import '../../../styles/sections/ConnectWalletButton.css';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import walletIcon from '../../../assets/walletIcon.svg';
import { useMemo } from 'react';
import { usePhantomWC } from '../../../hooks/usePhantomWC'; 
import { WALLET_CONFIG } from '../../../constants';

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const hasInjectedPhantom = () =>
  typeof window !== 'undefined' && (window as any).solana?.isPhantom;

const ConnectWalletButton = () => {
  // Desktop / inyectado (Phantom ext, otras wallets, etc.)
  const { publicKey, connected, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  // Móvil: Phantom vía WalletConnect (sin redirects)
  const {
    address: wcAddress,
    connected: wcConnected,
    connecting: wcConnecting,
    connect: wcConnect,
    disconnect: wcDisconnect,
  } = usePhantomWC({
    projectId: WALLET_CONFIG.PROJECT_ID,
    chainId: 'solana:devnet', // o 'solana:mainnet' si corresponde a tu RPC
  });

  // Estado efectivo (unifica adapter y WC)
  const effectiveConnected = connected || wcConnected;
  const effectiveConnecting = connecting || wcConnecting;
  const effectiveAddress = useMemo(() => {
    if (publicKey) return publicKey.toBase58();
    if (wcAddress) return wcAddress;
    return null;
  }, [publicKey, wcAddress]);

  const short = useMemo(
    () => (effectiveAddress ? `${effectiveAddress.slice(0, 4)}...${effectiveAddress.slice(-4)}` : '----'),
    [effectiveAddress]
  );

  const handleClickConnect = async () => {
    const mobile = isMobile();
    const injected = hasInjectedPhantom();

    // En móvil sin inyección → usar Phantom WC hook
    if (mobile && !injected) {
      await wcConnect();
      return;
    }

    // Desktop o móvil con inyección → abrir modal (adapter)
    setVisible(true);
  };

  const handleDisconnect = async () => {
    // Intenta desconectar ambos mundos por si acaso
    if (connected) {
      try { await disconnect(); } catch {}
    }
    if (wcConnected) {
      try { await wcDisconnect(); } catch {}
    }
  };

  return effectiveConnected ? (
    <button onClick={handleDisconnect} className="btn bg-red-500" disabled={effectiveConnecting}>
      Disconnect ({short})
    </button>
  ) : (
    <button onClick={handleClickConnect} className="btn bg-blue-500" disabled={effectiveConnecting}>
      <img src={walletIcon} alt="wallet" className="w-6 h-6" />
      <span className="ml-2">{effectiveConnecting ? 'Connecting…' : 'Connect'}</span>
    </button>
  );
};

export default ConnectWalletButton;

