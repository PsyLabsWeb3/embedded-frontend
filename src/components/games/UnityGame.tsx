/**
 * @fileoverview UnityGame Component
 * - Desktop: embebido 16:9 con botón Fullscreen (nativo).
 * - Mobile (cuando se usa desde UnityGameMobile): full-window por layout, contain 16:9.
 */
import React, { useMemo, useRef, useState, useEffect } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { GameTypes } from "../../types";
import styles from "./Snake2048.module.css";

const GAME_OVER_TYPE = "GAME_OVER"; // contrato con Unity

interface UnityGameProps {
  gameAssets: GameTypes.UnityAssets;
  className?: string;
  onLoaded?: () => void;
  onError?: (error: string) => void;
  publicKey?: string | null;
  transactionId?: string | null;
  /** Optional mode (e.g. 'Betting') coming from payment flow */
  degenMode?: string | null;
  /** Optional bet amount in SOL coming from payment flow */
  degenBetAmount?: string | null;

  /** Mostrar botón Fullscreen (desktop). Default: true */
  enableFullscreen?: boolean;

  /** Resolución base para embed (default 1280x720) */
  baseResolution?: { width: number; height: number };

  /** Fuerza layout full-window (mobile shell) */
  forceFullscreenLayout?: boolean;

  /** Si true, no aplica padding de safe-area dentro del frame */
  disableSafeAreaPadding?: boolean;

  /** Ajuste por CSS "contain" al aspect objetivo (p.ej. 1280x720) cuando está en layout fullscreen */
  fitAspect?: { width: number; height: number };
}

const isMobile = () =>
  typeof navigator !== "undefined" &&
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

const isPortraitNow = () =>
  typeof window !== "undefined" &&
  !!(window.matchMedia && window.matchMedia("(orientation: portrait)").matches);

/* ---------- Fullscreen API con fallback a pseudo (overlay fijo) ---------- */
function useFullscreenWithFallback<T extends HTMLElement>(
  targetRef: React.RefObject<T>
) {
  const [isNativeFs, setIsNativeFs] = useState(false);
  const [isPseudoFs, setIsPseudoFs] = useState(false);

  useEffect(() => {
    const onChange = () => {
      const active = !!(
        document.fullscreenElement || (document as any).webkitFullscreenElement
      );
      setIsNativeFs(active);
      if (!active) setIsPseudoFs(false);
    };
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange as any);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange as any);
    };
  }, []);

  const enter = async () => {
    const el = targetRef.current as (T & HTMLElement) | null;
    if (!el) return;
    try {
      const req: any =
        (el as any).requestFullscreen || (el as any).webkitRequestFullscreen;
      if (req) {
        await req.call(el);
        setIsNativeFs(true);
        return;
      }
    } catch {}
    // Fallback (Safari iOS)
    setIsPseudoFs(true);
  };

  const exit = async () => {
    try {
      const exitFn: any =
        document.exitFullscreen || (document as any).webkitExitFullscreen;
      if (
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement
      ) {
        await exitFn.call(document);
      }
    } catch {}
    setIsNativeFs(false);
    setIsPseudoFs(false);
  };

  return {
    isActive: isNativeFs || isPseudoFs,
    isNativeFs,
    isPseudoFs,
    enter,
    exit,
  };
}

const UnityGame: React.FC<UnityGameProps> = ({
  gameAssets,
  className,
  onLoaded,
  onError: _onError,
  publicKey,
  transactionId,
  degenMode,
  degenBetAmount,
  enableFullscreen = true,
  baseResolution = { width: 1280, height: 720 },
  forceFullscreenLayout = false,
  disableSafeAreaPadding = false,
  fitAspect,
}) => {
  const unityConfig = useMemo(
    () => ({
      loaderUrl: gameAssets.loaderUrl,
      dataUrl: gameAssets.dataUrl,
      frameworkUrl: gameAssets.frameworkUrl,
      codeUrl: gameAssets.codeUrl,
    }),
    [gameAssets]
  );

  // Nota: 'unload' existe en react-unity-webgl >= 9
  const { unityProvider, isLoaded, loadingProgression, sendMessage, unload } =
    useUnityContext(unityConfig);

  useEffect(() => {
    if (isLoaded && onLoaded) onLoaded();
  }, [isLoaded, onLoaded]);

  useEffect(() => {
    if (isLoaded && publicKey) {
      sendMessage("WalletManager", "SetWalletAddress", publicKey.toString());
      if (degenMode === "Betting" && typeof degenMode === "string") {
        sendMessage("WalletManager", "SetGameMode", degenMode);
        const payloadBet = degenBetAmount;
        if (typeof payloadBet === "string") {
          console.log(
            "[Unity] sendMessage -> target=WalletManager method=SetBetAmount payload=",
            payloadBet
          );
          sendMessage("WalletManager", "SetBetAmount", payloadBet);
        }
      }
    }
  }, [isLoaded, publicKey, sendMessage, degenMode, degenBetAmount]);

  useEffect(() => {
    if (degenMode || typeof degenBetAmount === "string") {
      console.log("[UnityGame] incoming props changed:", {
        degenMode,
        degenBetAmount,
      });
    }
  }, [degenMode, degenBetAmount]);

  useEffect(() => {
    if (isLoaded && transactionId && transactionId.length > 0) {
      sendMessage("WalletManager", "SetTransactionId", transactionId);
    }
  }, [isLoaded, transactionId, sendMessage]);

  // --- descarga Unity solo cuando el componente se desmonta (cambio de ruta) ---
  useEffect(() => {
    return () => {
      try {
        if (typeof unload === "function") {
          unload(); // react-unity-webgl >= v9
        } else {
          (unityProvider as any)?.quitUnityInstance?.(); // fallback
        }
      } catch {}
    };
  }, [unload, unityProvider]);

  const outerRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const { isActive, isPseudoFs, enter, exit } =
    useFullscreenWithFallback<HTMLDivElement>(outerRef);

  // Full-window de layout si está activo o forzado desde fuera (mobile shell)
  const useFsLayout = isActive || forceFullscreenLayout;

  // Bloquea scroll del documento durante pseudo-fullscreen (fallback)
  useEffect(() => {
    if (!isPseudoFs) return;
    const html = document.documentElement;
    const body = document.body;
    const prevH = html.style.overflow,
      prevB = body.style.overflow;
    const prevTAh = (html.style as any).touchAction,
      prevTAb = (body.style as any).touchAction;
    const prevOBH = (html.style as any).overscrollBehavior,
      prevOBB = (body.style as any).overscrollBehavior;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    (html.style as any).touchAction = "none";
    (body.style as any).touchAction = "none";
    (html.style as any).overscrollBehavior = "none";
    (body.style as any).overscrollBehavior = "none";
    return () => {
      html.style.overflow = prevH;
      body.style.overflow = prevB;
      (html.style as any).touchAction = prevTAh;
      (body.style as any).touchAction = prevTAb;
      (html.style as any).overscrollBehavior = prevOBH;
      (body.style as any).overscrollBehavior = prevOBB;
    };
  }, [isPseudoFs]);

  // -------- estilos --------
  const supportsDvh =
    typeof CSS !== "undefined" && (CSS as any).supports?.("height: 100dvh");
  const vhUnit = supportsDvh ? "dvh" : "vh";

  const outerStyle: React.CSSProperties =
    isActive && isPseudoFs
      ? {
          position: "fixed",
          inset: 0,
          background: "#000",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          zIndex: 2147483647,
          touchAction: "none",
          overscrollBehavior: "none",
        }
      : { position: "relative", width: "100%" };

  const safeArea = disableSafeAreaPadding
    ? {}
    : {
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      };

  const frameStyle: React.CSSProperties = useFsLayout
    ? {
        width: "100vw",
        height: `100${vhUnit}`,
        background: "#000",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        position: "relative",
        ...safeArea,
      }
    : {
        width: "100%",
        aspectRatio: `${baseResolution.width} / ${baseResolution.height}`,
        maxWidth: "min(100vw, 1280px)",
        maxHeight: "80vh",
        background: "#000",
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        borderRadius: 8,
        margin: "0 auto",
        position: "relative",
      };

  // Caja 16:9 (contain) solo en full-window layout
  const fitBoxStyle: React.CSSProperties =
    useFsLayout && (fitAspect || baseResolution)
      ? {
          width: `min(100vw, calc(100${vhUnit} * ${
            fitAspect?.width ?? baseResolution.width
          } / ${fitAspect?.height ?? baseResolution.height}))`,
          height: `min(100${vhUnit}, calc(100vw * ${
            fitAspect?.height ?? baseResolution.height
          } / ${fitAspect?.width ?? baseResolution.width}))`,
          position: "relative",
        }
      : { width: "100%", height: "100%", position: "relative" };

  // Mostrar botón FS en desktop (no en layout forzado)
  const showFsButton = enableFullscreen && !forceFullscreenLayout;

  const unityStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    display: "block",
    opacity: isLoaded ? 1 : 0.5,
    transition: "opacity .3s ease-in-out",
  };

  const containerClass = className || styles.container;

  // Hint solo en layout fullscreen (mobile shell o FS nativo) y portrait
  const showRotateHint = useFsLayout && isMobile() && isPortraitNow();

  // Game Over listener
  const [gameOver, setGameOver] = useState(false);
  const [lastMatchId, setLastMatchId] = useState<string | undefined>(undefined);
  const reloadingRef = useRef(false);

  // Listener del mensaje desde Unity (o iframe)
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      let data: any = e.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch {
          /* no-JSON, ignorar */
        }
      }
      if (data?.source === "unity" && data?.type === GAME_OVER_TYPE) {
        setLastMatchId(data?.matchId);
        setGameOver(true);
      }
    };

    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Acción del botón: hard reload total
  const hardReload = () => {
    if (reloadingRef.current) return;
    reloadingRef.current = true;

    // (Opcional) log/analytics aquí…

    // Recarga preservando ruta y query
    window.location.href = window.location.href;
    // Alternativa:
    // window.location.reload();
  };

  return (
    <div ref={outerRef} style={outerStyle}>
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "var(--color-text-secondary)",
            zIndex: 5,
          }}
        >
          <div>Loading Game…</div>
          <div style={{ textAlign: "center", fontSize: 12 }}>
            {Math.round(loadingProgression * 100)}%
          </div>
        </div>
      )}

      <div style={frameStyle} id="unity-frame">
        {showFsButton && (
          <button
            onClick={isActive ? exit : enter}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1000,
              background: "rgba(0,0,0,.6)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,.25)",
              borderRadius: 8,
              padding: "6px 10px",
              fontSize: 12,
              lineHeight: 1,
              cursor: "pointer",
              userSelect: "none",
              backdropFilter: "blur(2px)",
            }}
            title={isActive ? "Exit fullscreen" : "Enter fullscreen"}
            aria-label={isActive ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isActive ? "Exit" : "Fullscreen"}
          </button>
        )}

        {/* Contenedor centrado + caja 16:9 (contain) */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div style={fitBoxStyle}>
            <Unity
              className={containerClass}
              unityProvider={unityProvider}
              style={unityStyle}
            />
          </div>
        </div>

        {gameOver && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.6)",
              display: "grid",
              placeItems: "center",
              zIndex: 2147483647, // por encima de todo
             
            }}
            role="dialog"
            aria-modal="true"
          >
            <div
              style={{
                background: "#5cd62c72",
                color: "#ffffffff",
                padding: "16px 18px",
                borderRadius: 12,
                width: "min(92vw, 420px)",
                boxShadow: "0 10px 30px rgba(0,0,0,.25)",
                textAlign: "center",
              }}
            >
              <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 26, fontWeight: 900, marginBottom: 6 }}>
                ¡Game Over!
              </h3>
              {lastMatchId && (
                <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
                  Match ID: {lastMatchId}
                </div>
              )}

              <button
                onClick={hardReload}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "14px 18px",
                  borderRadius: 10,
                  // border: "1px solid rgba(0,0,0,.1)",
                  background: "#AE43FF",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontFamily: "'Alumni Sans', sans-serif",
                  fontSize: 22,
                }}
              >
                Play Again
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M21 12a9 9 0 1 1-2.64-6.36"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M21 3v6h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Chip de rotación (no bloquea) */}
        {showRotateHint && (
          <div
            style={{
              position: "absolute",
              top: "calc(env(safe-area-inset-top) + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 11,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(0,0,0,.6)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,.2)",
                borderRadius: 999,
                padding: "6px 10px",
                fontSize: 12,
                lineHeight: 1,
                backdropFilter: "blur(2px)",
                maxWidth: "90vw",
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
              >
                <rect
                  x="7"
                  y="3"
                  width="10"
                  height="18"
                  rx="2"
                  ry="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M3 10a9 9 0 0 1 9-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <polyline
                  points="10 1 12 3 10 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Gira tu dispositivo para jugar en horizontal</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(UnityGame);
