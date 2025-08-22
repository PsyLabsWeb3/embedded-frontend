// ConnectWalletButton.tsx
import '../../../styles/sections/ConnectWalletButton.css';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import walletIcon from '../../../assets/walletIcon.svg';
import { useMemo } from 'react';

// 👇 Añade estas deps a tu proyecto:
// npm i tweetnacl bs58
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const hasInjectedPhantom = () =>
  typeof window !== 'undefined' && (window as any).solana?.isPhantom;

/**
 * Inicia el flujo de conexión con Phantom usando deep link.
 * - Genera una clave efímera (dapp_encryption_public_key)
 * - Guarda la secret key en sessionStorage para leerla en /phantom/callback
 * - Redirige a la app de Phantom con redirect_link de vuelta a tu dominio
 */
function startPhantomDeepLinkConnect() {
  // 1) Keypair efímero para el handshake cifrado
  const kp = nacl.box.keyPair();
  const dappPubKeyBase58 = bs58.encode(kp.publicKey);
  const dappSecretKeyBase58 = bs58.encode(kp.secretKey);

  // 2) Persistimos la secret key para usarla en el callback
  sessionStorage.setItem('phantom_dapp_secret_key', dappSecretKeyBase58);

  // 3) Configura tus URLs
  const appUrl = encodeURIComponent(window.location.origin); // o tu dominio público
  const redirect = encodeURIComponent(`${window.location.origin}/phantom/callback`); // Implementa esta ruta
  const cluster = 'devnet'; // o 'devnet' si estás probando mainnet-beta

  // 4) Construye el deep link oficial de Phantom
  const url =
    `https://phantom.app/ul/v1/connect` +
    `?app_url=${appUrl}` +
    `&dapp_encryption_public_key=${dappPubKeyBase58}` +
    `&redirect_link=${redirect}` +
    `&cluster=${cluster}`;

  // 5) Lanza la app de Phantom
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

    // En móvil SIN inyección → usar deep link nativo (mantiene la dApp en el navegador original).
    if (mobile && !injected) {
      startPhantomDeepLinkConnect();
      return;
    }

    // En desktop o móvil con inyección → usar el modal (Phantom/WalletConnect/etc.)
    setVisible(true);
  };

  return (
    <>
      {connected ? (
        <button onClick={disconnect} className="btn bg-red-500" disabled={connecting}>
          Disconnect ({short})
        </button>
      ) : (
        <button onClick={handleClickConnect} className="btn bg-blue-500" disabled={connecting}>
          <img src={walletIcon} alt="wallet" className="w-6 h-6" />
          <span className="ml-2">{connecting ? 'Connecting…' : 'Connect'}</span>
        </button>
      )}
    </>
  );
};

export default ConnectWalletButton;
