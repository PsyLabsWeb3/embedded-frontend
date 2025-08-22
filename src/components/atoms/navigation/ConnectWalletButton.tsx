import '../../../styles/sections/ConnectWalletButton.css';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import walletIcon from '../../../assets/walletIcon.svg';
import { useMemo } from 'react';
// import { AppKitButton } from '../AppKitButton';
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';

// --- helpers de plataforma ---
const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const hasInjectedPhantom = () =>
  typeof window !== 'undefined' && (window as any).solana?.isPhantom;

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

    // ---- rama móvil AppKit (custom look) ----
  if (isMobile() && !hasInjectedPhantom()) {
    const { open } = useAppKit();
    const { isConnected, address, status } = useAppKitAccount({ namespace: 'solana' });
    const { disconnect: akDisconnect } = useDisconnect();
    const short = address ? `${address.slice(0,4)}...${address.slice(-4)}` : '----';

    return isConnected ? (
      <button
        onClick={() => akDisconnect()}
        className="btn bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 inline-flex items-center gap-2"
      >
        <img src={walletIcon} alt="wallet" className="w-5 h-5" />
        <span>Disconnect ({short})</span>
      </button>
    ) : (
      <button
        onClick={() => open({ view: 'Connect', namespace: 'solana' })}
        className="btn bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 inline-flex items-center gap-2"
      >
        <img src={walletIcon} alt="wallet" className="w-5 h-5" />
        <span>{status === 'connecting' ? 'Connecting…' : 'Connect'}</span>
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
