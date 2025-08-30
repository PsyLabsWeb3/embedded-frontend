// GamePage.tsx
import React from 'react';
import GamePageTemplate from '../templates/GamePageTemplate';
import UnityGame from './UnityGame';
import UnityGameMobile from './UnityGameMobile'; // <-- NUEVO
import PlaceholderGame from './PlaceholderGame';
import { useGameConfig } from '../../hooks/useGameConfig';
import { ERROR_MESSAGES, LOCAL_STORAGE_CONF } from '../../constants';
import { useWallet } from '@solana/wallet-adapter-react';
import PayEntryButton from './PayEntryButton';

interface GamePageProps {
  gameId: string;
  customContent?: React.ReactNode;
}

const isMobile = () =>
  typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const GamePage: React.FC<GamePageProps> = ({ gameId, customContent }) => {
  const gameConfig = useGameConfig(gameId);
  const { publicKey, connected } = useWallet();

  const mobileSession = (typeof localStorage !== 'undefined')
    ? localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_SESSION)
    : null;
  const mobileWalletAddress = (typeof localStorage !== 'undefined')
    ? (localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_WALLET_PUBKEY) || undefined)
    : undefined;
  const isConnectedMobile = !!(mobileSession && mobileWalletAddress);

  const [txSig, setTxSig] = React.useState<string | null>(null);
  const [entryConfirmed, setEntryConfirmed] = React.useState(false);

  if (!gameConfig) {
    return (
      <GamePageTemplate
        gameTitle={ERROR_MESSAGES.GAME_NOT_FOUND}
        gameComponent={
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            {ERROR_MESSAGES.GAME_NOT_FOUND}: "{gameId}"
          </div>
        }
      />
    );
  }

  // --- RUTA HIJA MÓVIL: si ya confirmó, mostramos fullscreen directo ---
  if (isMobile() && gameConfig.assets && entryConfirmed) {
    return (
      <UnityGameMobile
        gameAssets={gameConfig.assets}
        publicKey={publicKey?.toString() || mobileWalletAddress || null}
        transactionId={txSig ?? null}
      />
    );
  }

  const renderGameComponent = (): React.ReactNode => {
    if (gameConfig.placeholder) return <PlaceholderGame gameName={gameConfig.title} />;

    if (gameConfig.assets) {
      if ((!connected || !publicKey) && !isConnectedMobile) {
        return (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>
            Connect your wallet to play.
          </div>
        );
      }

      if (!entryConfirmed) {
        return (
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              To play, please make the entry payment.
            </div>
            <PayEntryButton
              onSent={(sig) => setTxSig(sig)}
              onContinue={(sig) => {
                setTxSig(sig);
                setEntryConfirmed(true); // ← al confirmar, si es móvil salta a UnityGameMobile
              }}
            />
          </div>
        );
      }

      // Desktop / no móvil: render embebido normal
      return (
        <UnityGame
          gameAssets={gameConfig.assets}
          publicKey={publicKey?.toString() || mobileWalletAddress}
          transactionId={txSig ?? ''}
        />
      );
    }

    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        {ERROR_MESSAGES.GAME_LOAD_FAILED}
      </div>
    );
  };

  return (
    <GamePageTemplate
      gameTitle={gameConfig.title}
      gameComponent={renderGameComponent()}
      instructions={gameConfig.instructions}
      customContent={customContent}
    />
  );
};

export default GamePage;
