// GamePage.tsx
import React from 'react';
import GamePageTemplate from '../templates/GamePageTemplate';
import UnityGame from './UnityGame';
import PlaceholderGame from './PlaceholderGame';
import { useGameConfig } from '../../hooks/useGameConfig';
import { ERROR_MESSAGES } from '../../constants';
import { LOCAL_STORAGE_CONF } from '../../constants';
import { useWallet } from '@solana/wallet-adapter-react';
import PayEntryButton from './PayEntryButton';

interface GamePageProps {
  gameId: string;
  customContent?: React.ReactNode;
}

const GamePage: React.FC<GamePageProps> = ({ gameId, customContent }) => {
  const gameConfig = useGameConfig(gameId);
  const { publicKey, connected } = useWallet();

  const mobileSession = localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_SESSION);
  const mobileWalletAddress = localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_WALLET_PUBKEY) || undefined;
  const isConnectedMobile = mobileSession && mobileWalletAddress;

  // Antes: solo transactionId
  // Ahora: confirmation-first
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
    if (gameConfig.placeholder) {
      return <PlaceholderGame gameName={gameConfig.title} />;
    }

    if (gameConfig.assets) {
      if ((!connected || !publicKey) && !isConnectedMobile) {
        return (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>
            Connect your wallet to play.
          </div>
        );
      }

      // Hasta no confirmar (o vencer el timeout interno del botón), mostramos el botón
      if (!entryConfirmed) {
        return (
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              To play, please make the entry payment.
            </div>
            <PayEntryButton
              // opcional: si quieres guardar el sig apenas se envía
              onSent={(sig) => setTxSig(sig)}
              // clave: este onContinue se llama después de confirmación moderna o timeout de 10s
              onContinue={(sig) => {
                setTxSig(sig);
                setEntryConfirmed(true);
              }}
            />
          </div>
        );
      }

      // Confirmado: ya puedes cargar Unity
      return (
        <UnityGame
          gameAssets={gameConfig.assets}
          publicKey={publicKey?.toString() || mobileWalletAddress}
          // Si tu Unity aún requiere el id, se lo pasamos (ya confirmado/timeout).
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
