// GamePage.tsx
import React from 'react';
import GamePageTemplate from '../templates/GamePageTemplate';
import UnityGame from './UnityGame';
import PlaceholderGame from './PlaceholderGame';
import { useGameConfig } from '../../hooks/useGameConfig';
import { ERROR_MESSAGES } from '../../constants';
import { useWallet } from '@solana/wallet-adapter-react';
import PayEntryButton from './PayEntryButton';

interface GamePageProps {
  gameId: string;
  customContent?: React.ReactNode;
}
// ...imports arriba...

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const GamePage: React.FC<GamePageProps> = ({ gameId, customContent }) => {
  const gameConfig = useGameConfig(gameId);
  const { publicKey, connected } = useWallet();

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

  const renderGameComponent = (): React.ReactNode => {
    if (gameConfig.placeholder) return <PlaceholderGame gameName={gameConfig.title} />;

    if (gameConfig.assets) {
      if (!connected || !publicKey) {
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
              onContinue={(sig) => { setTxSig(sig); setEntryConfirmed(true); }}
            />
          </div>
        );
      }

      // contenedor del juego (más alto en mobile, 16:9 en desktop)
      const mobile = isMobile();
      const gameBoxStyle: React.CSSProperties = mobile
        ? {
            width: '100%',
            height: 'calc(100vh - 64px)', // ajusta -64px según tu header/topbar
            background: '#000',
            borderRadius: 8,
            overflow: 'hidden',
          }
        : {
            width: '100%',
            aspectRatio: '16 / 9',
            maxHeight: '80vh',
            background: '#000',
            borderRadius: 8,
            overflow: 'hidden',
            margin: '0 auto',
          };

      return (
        <div style={gameBoxStyle}>
          <UnityGame
            gameAssets={gameConfig.assets}
            publicKey={publicKey.toString()}
            transactionId={txSig ?? ''}
            enableFullscreen={!mobile}            // sin botón en mobile
            // rotateOnMobile ya no se usa aquí (sin rotación forzada)
            baseResolution={{ width: 1280, height: 720 }} // tu build
          />
        </div>
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
