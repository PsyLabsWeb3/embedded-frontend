import React from "react";
import GamePageTemplate from "../templates/GamePageTemplate";
import UnityGame from "./UnityGame";
import UnityGameMobile from "./UnityGameMobile";
import PlaceholderGame from "./PlaceholderGame";
import { useGameConfig } from "../../hooks/useGameConfig";
import { ERROR_MESSAGES, LOCAL_STORAGE_CONF } from "../../constants";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import PayEntryButton from "./PayEntryButton";
import PayEntryPvEButton from "./PayEntryPvEButton";
import { generateDappKeypair } from "../../utils/phantomCrypto";

interface GamePageProps {
  gameId: string;
  customContent?: React.ReactNode;
}

const isMobile = () =>
  typeof navigator !== "undefined" &&
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const GamePage: React.FC<GamePageProps> = ({ gameId, customContent }) => {
  const gameConfig = useGameConfig(gameId);
  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();

  const mobileSession =
    typeof localStorage !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_SESSION)
      : null;
  const mobileWalletAddress =
    typeof localStorage !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_WALLET_PUBKEY) ||
        undefined
      : undefined;
  const isConnectedMobile = !!(mobileSession && mobileWalletAddress);

  const [txSig, setTxSig] = React.useState<string | null>(null);
  const [entryConfirmed, setEntryConfirmed] = React.useState(false);
  // Mode state to forward to Unity - can be 'Betting' for PvP or 'PvE' for PvE
  const [gameMode, setGameMode] = React.useState<string | null>(null);
  const [degenBetAmount, setDegenBetAmount] = React.useState<string | null>(
    null,
  );
  const [gameLoading, setGameLoading] = React.useState(false);
  const [gameLoaded, setGameLoaded] = React.useState(false);

  // controla si mostramos la vista fullscreen móvil (para poder "volver")
  const [showMobileFull, setShowMobileFull] = React.useState(false);
  // evita renderizar Unity embebido durante la salida (y permite recargar limpio)
  const [isExiting, setIsExiting] = React.useState(false);

  if (!gameConfig) {
    return (
      <GamePageTemplate
        gameTitle={ERROR_MESSAGES.GAME_NOT_FOUND}
        gameComponent={
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "var(--color-text-secondary)",
            }}
          >
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
      const url =
        window.location.pathname +
        window.location.search +
        window.location.hash;
      window.location.replace(url);
    }, 30);
  };

  // Vista hija de mobile: full-window por layout
  if (
    isMobile() &&
    gameConfig.assets &&
    entryConfirmed &&
    showMobileFull &&
    !isExiting
  ) {
    //Si existe local storage GAME_MODE y DEGEN_BET_AMOUNT, los pasa a UnityGameMobile
    const localGameMode =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(LOCAL_STORAGE_CONF.GAME_MODE)
        : null;
    localStorage.removeItem(LOCAL_STORAGE_CONF.GAME_MODE);
    const localDegenBetAmount =
      typeof localStorage !== "undefined"
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
      return <div style={{ height: "50vh" }} />;
    }

    if (gameConfig.placeholder) return <PlaceholderGame />;

    if (gameConfig.assets) {
      if ((!connected || !publicKey) && !isConnectedMobile) {
        const isMobileView = isMobile();
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: isMobileView ? "180px" : "300px",
              padding: isMobileView ? "1.25rem 1rem" : "2rem",
              gap: isMobileView ? "0.75rem" : "1.25rem",
              textAlign: "center",
              borderRadius: "12px",
              background: "#1d1d1dc6",
            }}
          >
            <div
              style={{
                width: isMobileView ? "48px" : "64px",
                height: isMobileView ? "48px" : "64px",
                borderRadius: "50%",
                background: "rgba(93, 214, 44, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#5dd62c",
              }}
            >
              <svg
                width={isMobileView ? "24" : "32"}
                height={isMobileView ? "24" : "32"}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h3
              style={{
                fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                fontWeight: 600,
                fontSize: isMobileView ? "16px" : "20px",
                color: "#ffffff",
                margin: 0,
              }}
            >
              Wallet Not Connected
            </h3>
            {!isMobileView && (
              <p
                style={{
                  fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "#959698",
                  margin: 0,
                  maxWidth: "300px",
                  lineHeight: 1.5,
                }}
              >
                Connect your wallet to start playing
              </p>
            )}
            <button
              onClick={() => {
                if (isMobile()) {
                  // Phantom deep link for mobile
                  const kp = generateDappKeypair();
                  localStorage.setItem(
                    LOCAL_STORAGE_CONF.LOCAL_KEYS,
                    JSON.stringify(kp),
                  );
                  const appUrl = encodeURIComponent(window.location.origin);
                  const currentPath =
                    window.location.pathname + window.location.search;
                  localStorage.setItem(
                    LOCAL_STORAGE_CONF.LOCAL_REDIRECT,
                    currentPath,
                  );
                  const redirectLink = encodeURIComponent(
                    `${window.location.origin}/phantom-callback?state=${encodeURIComponent(currentPath)}`,
                  );
                  window.location.href =
                    `https://phantom.app/ul/v1/connect?` +
                    `app_url=${appUrl}` +
                    `&redirect_link=${redirectLink}` +
                    `&dapp_encryption_public_key=${encodeURIComponent(kp.publicKeyBase58)}`;
                } else {
                  // Desktop wallet modal
                  setVisible(true);
                }
              }}
              style={{
                background: "#5dd62c",
                border: "none",
                borderRadius: "8px",
                color: "#1a1d1f",
                cursor: "pointer",
                fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                fontSize: isMobileView ? "13px" : "14px",
                fontWeight: 600,
                padding: isMobileView ? "10px 20px" : "12px 24px",
                marginTop: isMobileView ? "0" : "0.25rem",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#4bc123")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#5dd62c")
              }
            >
              Connect Wallet
            </button>
          </div>
        );
      }

      // Desktop (o mobile después de salir del fullscreen): embed 16:9 con botón FS
      if (entryConfirmed) {
        return (
          <UnityGame
            gameAssets={gameConfig.assets}
            publicKey={publicKey?.toString() || mobileWalletAddress}
            transactionId={txSig ?? ""}
            degenMode={gameMode}
            degenBetAmount={degenBetAmount}
            enableFullscreen={true}
          />
        );
      }

      // Show empty game container when not confirmed - NO CONTENT.
      return (
        <div
          style={{
            minHeight: "400px",
            background: "transparent",
          }}
        ></div>
      );
    }

    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "var(--color-text-secondary)",
        }}
      >
        {ERROR_MESSAGES.GAME_LOAD_FAILED}
      </div>
    );
  };

  const renderPaymentSection = (): React.ReactNode => {
    if (gameConfig.placeholder) return null;

    if (
      gameConfig.assets &&
      (connected || isConnectedMobile) &&
      !entryConfirmed
    ) {
      // Check if this is a free-to-play game
      if (gameConfig.isFreeToPlay) {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <button
              onClick={() => {
                setTxSig("free-play");
                setGameMode("Free");
                setGameLoading(true);
                setGameLoaded(false);

                setTimeout(() => {
                  setEntryConfirmed(true);
                  if (isMobile()) setShowMobileFull(true);

                  setTimeout(() => {
                    setGameLoaded(true);
                    setGameLoading(false);
                  }, 1000);
                }, 500);
              }}
              disabled={gameLoading}
              style={{
                padding: "1rem 3rem",
                fontSize: "1.2rem",
                fontWeight: "700",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: gameLoading ? "not-allowed" : "pointer",
                opacity: gameLoading ? 0.6 : 1,
                transition: "all 0.3s ease",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              }}
              onMouseEnter={(e) => {
                if (!gameLoading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(102, 126, 234, 0.6)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 15px rgba(102, 126, 234, 0.4)";
              }}
            >
              {gameLoading ? "Loading Game..." : "Play Now - Free"}
            </button>
          </div>
        );
      }

      // Check if this is a PvE game
      if (gameConfig.isPvE) {
        return (
          <PayEntryPvEButton
            onSent={(sig) => setTxSig(sig)}
            onContinue={(sig) => {
              setTxSig(sig);
              setGameMode("PvE");
              setGameLoading(true);
              setGameLoaded(false);

              // Simulate game loading time and then set entry confirmed
              setTimeout(() => {
                setEntryConfirmed(true);
                if (isMobile()) setShowMobileFull(true);

                // Simulate additional time for game to fully load
                setTimeout(() => {
                  setGameLoaded(true);
                  setGameLoading(false);
                }, 1000); // Give game components time to mount
              }, 500); // Small delay to show loading state
            }}
            gameLoading={gameLoading}
            gameLoaded={gameLoaded}
          />
        );
      }

      // Regular PvP game
      return (
        <PayEntryButton
          onSent={(sig) => setTxSig(sig)}
          onContinue={(sig) => {
            setTxSig(sig);
            setGameLoading(true);
            setGameLoaded(false);

            // Simulate game loading time and then set entry confirmed
            setTimeout(() => {
              setEntryConfirmed(true);
              if (isMobile()) setShowMobileFull(true);

              // Simulate additional time for game to fully load
              setTimeout(() => {
                setGameLoaded(true);
                setGameLoading(false);
              }, 1000); // Give game components time to mount
            }, 500); // Small delay to show loading state
          }}
          onDegenPlay={(betSol: number, _betUsd: number) => {
            setGameMode("Betting");

            let betUsd;
            if (_betUsd) {
              betUsd = _betUsd.toString();
            }

            // Log amount and data type (safely handle optional USD param)
            console.log("Degen mode: Betting", {
              betUsd_type: typeof betUsd,
              betUsd_value: betUsd ?? null,
              betSol_type: typeof betSol,
              betSol_value: betSol,
            });

            setDegenBetAmount(betUsd ?? null);
          }}
          gameLoading={gameLoading}
          gameLoaded={gameLoaded}
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
      currentGameSlug={gameId}
      isLive={!gameConfig.placeholder}
      isPvE={gameConfig.isPvE}
      feeText="Entry from 0.5 USD"
      isGamePlaying={entryConfirmed}
    />
  );
};

export default GamePage;
