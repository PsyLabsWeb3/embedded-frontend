import '../../../styles/sections/ConnectWalletButton.css';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import walletIcon from '../../../assets/walletIcon.svg';
import { useMemo } from 'react';

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const hasInjectedPhantom = () =>
  typeof window !== 'undefined' && (window as any).solana?.isPhantom;

// Fallback opcional: abrir la app de Phantom (sin flujo de connect cifrado)
function openPhantomDeepLink() {
  const appUrl = encodeURIComponent('https://tu-dominio.com');
  const redirect = encodeURIComponent('https://tu-dominio.com'); // pon tu ruta deseada
  const url = `https://phantom.app/ul/v1/open?app_url=${appUrl}&redirect_link=${redirect}`;
  window.location.href = url;
}

// Componente responsivo para conectar la wallet
const ConnectWalletButton = () => {
  const { publicKey, connected, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  const short = useMemo(
    () => (publicKey ? `${publicKey.toBase58().slice(0, 4)}...` : '----'),
    [publicKey]
  );

  const handleClickConnect = () => {
    const mobile = isMobile();
    const injected = hasInjectedPhantom();

    // Siempre abrimos el modal: en desktop/in-app usa Phantom inyectado;
    // en móvil sin inyección mostrará WalletConnect (ya configurado en tu App).
    if (!mobile || injected) {
      setVisible(true);
      return;
    }

    // Mobile + sin inyección → igualmente abrimos el modal para WalletConnect
    setVisible(true);
  };

  return (
    <>
      {connected ? (
        <button onClick={disconnect} className="btn bg-red-500" disabled={connecting}>
          Disconnect ({short})
        </button>
      ) : (
        <div className="flex gap-2 items-center">
          <button onClick={handleClickConnect} className="btn bg-blue-500" disabled={connecting}>
            <img src={walletIcon} alt="wallet" className="w-6 h-6" />
            <span className="ml-2">{connecting ? 'Connecting…' : 'Connect'}</span>
          </button>

          {/* Fallback opcional para abrir la app de Phantom en móvil (sin WalletConnect) */}
          {isMobile() && !hasInjectedPhantom() && (
            <button onClick={openPhantomDeepLink} className="btn bg-purple-500">
              Open in Phantom
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default ConnectWalletButton;
