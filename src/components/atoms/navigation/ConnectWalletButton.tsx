// ConnectWalletButton.tsx
import '../../../styles/sections/ConnectWalletButton.css';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import walletIcon from '../../../assets/walletIcon.svg';
import { useEffect, useMemo, useState } from 'react';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

const PHANTOM_STATE_KEY = 'phantom_session_state';
const PHANTOM_DAPP_SECRET_KEY = 'phantom_dapp_secret_key';

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const hasInjectedPhantom = () =>
  typeof window !== 'undefined' && (window as any).solana?.isPhantom;

// ——— flujo deep link (ya lo usabas) ———
function startPhantomDeepLinkConnect() {
  const kp = nacl.box.keyPair();
  sessionStorage.setItem(PHANTOM_DAPP_SECRET_KEY, bs58.encode(kp.secretKey));

  const appUrl = encodeURIComponent(window.location.origin);
  const redirect = encodeURIComponent(`${window.location.origin}/phantom/callback`);
  const cluster = 'mainnet-beta'; // o 'devnet'
  const dappPubKeyBase58 = bs58.encode(kp.publicKey);

  const url =
    `https://phantom.app/ul/v1/connect` +
    `?app_url=${appUrl}` +
    `&dapp_encryption_public_key=${dappPubKeyBase58}` +
    `&redirect_link=${redirect}` +
    `&cluster=${cluster}`;

  window.location.href = url;
}

// Lee el estado Phantom guardado por /phantom/callback
function getPhantomState(): { publicKey: string; session: string } | null {
  const raw = localStorage.getItem(PHANTOM_STATE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { publicKey: string; session: string };
    if (parsed?.publicKey && parsed?.session) return parsed;
  } catch {}
  return null;
}

function clearPhantomState() {
  localStorage.removeItem(PHANTOM_STATE_KEY);
}

const ConnectWalletButton = () => {
  const { publicKey, connected, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  // estado para reflejar conexión por deep link
  const [phantomDL, setPhantomDL] = useState<{ publicKey: string; session: string } | null>(() => getPhantomState());

  // sincroniza si otro tab/página modifica el storage (p.ej. al volver del callback)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === PHANTOM_STATE_KEY) {
        setPhantomDL(getPhantomState());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // fuente de verdad del pubkey a mostrar:
  const effectivePubKey = useMemo(() => {
    if (publicKey) return publicKey.toBase58();
    if (phantomDL?.publicKey) return phantomDL.publicKey;
    return null;
  }, [publicKey, phantomDL]);

  const isEffectivelyConnected = Boolean(connected || phantomDL);

  const short = useMemo(() => {
    if (!effectivePubKey) return '----';
    return `${effectivePubKey.slice(0, 4)}...${effectivePubKey.slice(-4)}`;
  }, [effectivePubKey]);

  const handleClickConnect = () => {
    const mobile = isMobile();
    const injected = hasInjectedPhantom();

    // Móvil sin inyección → deep link nativo (mantiene Chrome/Safari y landscape)
    if (mobile && !injected) {
      startPhantomDeepLinkConnect();
      return;
    }

    // Desktop o móvil con inyección → modal (Phantom/WalletConnect/etc.)
    setVisible(true);
  };

  const handleDisconnect = async () => {
    try {
      if (connected) {
        await disconnect();
      }
    } finally {
      // limpiar deep link state si existía
      if (phantomDL) {
        clearPhantomState();
        setPhantomDL(null);
      }
    }
  };

  return (
    <>
      {isEffectivelyConnected ? (
        <button onClick={handleDisconnect} className="btn bg-red-500" disabled={connecting}>
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
