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

const GamePage: React.FC<GamePageProps> = ({ gameId, customContent }) => {
  const gameConfig = useGameConfig(gameId);
  const { publicKey, connected } = useWallet();

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
    //  // Placeholders temporales para simular la tx y el entryConfirmed
    // if (!entryConfirmed) {
    //   return (
    //     <div style={{ display: 'grid', gap: 12 }}>
    //       <div style={{ color: 'var(--color-text-secondary)' }}>
    //         Simulación: Haz clic para confirmar entrada y generar tx.
    //       </div>
    //       <button
    //         style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
    //         onClick={() => {
    //           setTxSig('FAKE_TX_SIGNATURE_' + Math.floor(Math.random() * 100000));
    //           setEntryConfirmed(true);
    //         }}
    //       >
    //         Simular pago y continuar
    //       </button>
    //     </div>
    //   );
    // }

    // ⬇️ Aquí activas/desactivas por juego:
    const rotateOnMobile = gameConfig.rotateOnMobile ?? true;

    return (
      <UnityGame
        gameAssets={gameConfig.assets}
        publicKey={publicKey.toString()}
        transactionId={txSig ?? ''}
        rotateOnMobile={rotateOnMobile}
        // Si algún juego usa otra resolución base:
        // baseResolution={{ width: 1920, height: 1080 }}
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
