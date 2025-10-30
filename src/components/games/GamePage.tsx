import React from 'react';
import GamePageTemplate from '../templates/GamePageTemplate';
import UnityGame from './UnityGame';
import UnityGameMobile from './UnityGameMobile';
import PlaceholderGame from './PlaceholderGame';
import { useGameConfig } from '../../hooks/useGameConfig';
import { ERROR_MESSAGES, LOCAL_STORAGE_CONF } from '../../constants';
import { useWallet } from '@solana/wallet-adapter-react';
import PayEntryButton from './PayEntryButton';
import PayEntryPvEButton from './PayEntryPvEButton';

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
  // Mode state to forward to Unity - can be 'Betting' for PvP or 'PvE' for PvE
  const [gameMode, setGameMode] = React.useState<string | null>(null);
  const [degenBetAmount, setDegenBetAmount] = React.useState<string | null>(null);

  // controla si mostramos la vista fullscreen móvil (para poder "volver")
  const [showMobileFull, setShowMobileFull] = React.useState(false);
  // evita renderizar Unity embebido durante la salida (y permite recargar limpio)
  const [isExiting, setIsExiting] = React.useState(false);

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

  // Handler cuando el móvil confirma "Exit"
  const handleExitFromMobile = () => {
    setIsExiting(true);
    setShowMobileFull(false);
    setEntryConfirmed(false);
    setTxSig(null);
    // recarga la misma ruta del juego para exigir pago nuevamente
    setTimeout(() => {
      const url = window.location.pathname + window.location.search + window.location.hash;
      window.location.replace(url);
    }, 30);
  };

  // Vista hija de mobile: full-window por layout
  if (isMobile() && gameConfig.assets && entryConfirmed && showMobileFull && !isExiting) {
    //Si existe local storage GAME_MODE y DEGEN_BET_AMOUNT, los pasa a UnityGameMobile
    const localGameMode = (typeof localStorage !== 'undefined')
      ? localStorage.getItem(LOCAL_STORAGE_CONF.GAME_MODE)
      : null;
    localStorage.removeItem(LOCAL_STORAGE_CONF.GAME_MODE);
    const localDegenBetAmount = (typeof localStorage !== 'undefined')
      ? localStorage.getItem(LOCAL_STORAGE_CONF.DEGEN_BET_AMOUNT)
      : null;
    localStorage.removeItem(LOCAL_STORAGE_CONF.DEGEN_BET_AMOUNT);

    return (
      <UnityGameMobile
        gameAssets={gameConfig.assets}
        publicKey={publicKey?.toString() || mobileWalletAddress || null}
        transactionId={txSig ?? null}
        degenMode={localGameMode}
        degenBetAmount={localDegenBetAmount}
        onExit={handleExitFromMobile}
      />
    );
  }

  const renderGameComponent = (): React.ReactNode => {
    if (isExiting) {
      // pantalla vacía breve hasta el replace()
      return <div style={{ height: '50vh' }} />;
    }

    if (gameConfig.placeholder) return <PlaceholderGame />;

    if (gameConfig.assets) {
      if ((!connected || !publicKey) && !isConnectedMobile) {
        return (
          <div style={{ borderRadius: '12px', background: '#1d1d1dc6', padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '1.2rem', fontWeight: "700", textShadow: "0 0 5px black" }}>
            Connect your wallet to play.
          </div>
        );
      }

      // Desktop (o mobile después de salir del fullscreen): embed 16:9 con botón FS
      if (entryConfirmed) {
        return (
          <UnityGame
            gameAssets={gameConfig.assets}
            publicKey={publicKey?.toString() || mobileWalletAddress}
            transactionId={txSig ?? ''}
            degenMode={gameMode}
            degenBetAmount={degenBetAmount}
            enableFullscreen={true}
          />
        );
      }

      // Show empty game container when not confirmed - NO CONTENT.
      return (
        <div style={{
          minHeight: '400px',
          background: 'transparent'
        }}>
        </div>
      );
    }

    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
        {ERROR_MESSAGES.GAME_LOAD_FAILED}
      </div>
    );
  };

  const renderPaymentSection = (): React.ReactNode => {
    if (gameConfig.placeholder) return null;

    if (gameConfig.assets && (connected || isConnectedMobile) && !entryConfirmed) {
      // Check if this is a PvE game
      if (gameConfig.isPvE) {
        return (
          <PayEntryPvEButton
            onSent={(sig) => setTxSig(sig)}
            onContinue={(sig) => {
              setTxSig(sig);
              setGameMode('PvE');
              setEntryConfirmed(true);
              if (isMobile()) setShowMobileFull(true); // entra a fullscreen móvil
            }}
          />
        );
      }

      // Regular PvP game
      return (
        <PayEntryButton
          onSent={(sig) => setTxSig(sig)}
          onContinue={(sig) => {
            setTxSig(sig);
            setEntryConfirmed(true);
            if (isMobile()) setShowMobileFull(true); // entra a fullscreen móvil
          }}
          onDegenPlay={(betSol: number, _betUsd: number) => {
            setGameMode('Betting');

            let betUsd;
            if (_betUsd) {
              betUsd = _betUsd.toString();
            }

            // Log amount and data type (safely handle optional USD param)
            console.log('Degen mode: Betting', {
              betUsd_type: typeof betUsd,
              betUsd_value: betUsd ?? null,
              betSol_type: typeof betSol,
              betSol_value: betSol,
            });

            setDegenBetAmount(betUsd ?? null);
          }}
        />
      );
    }

    return null;
  };

  return (
    <GamePageTemplate
      gameTitle={gameConfig.title}
      gameComponent={renderGameComponent()}
      paymentComponent={renderPaymentSection()}
      instructions={gameConfig.instructions}
      customContent={customContent}
      backgroundImage={gameConfig.backgroundImage}
      gameDescription={gameConfig.longDescription || gameConfig.description}
    />
  );
};

export default GamePage;
