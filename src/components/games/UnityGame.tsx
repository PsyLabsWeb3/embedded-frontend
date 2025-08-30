/**
 * @fileoverview UnityGame Component (Fullscreen-only, no forced rotation)
 */
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { GameTypes } from '../../types';
import styles from './Snake2048.module.css';

interface UnityGameProps {
  gameAssets: GameTypes.UnityAssets;
  className?: string;
  onLoaded?: () => void;
  onError?: (error: string) => void;
  publicKey?: string | null;
  transactionId?: string | null;

  /** Mostrar botón Fullscreen (default: true) */
  enableFullscreen?: boolean;

  /** (Ignorado ahora) antes se usaba para forzar landscape en mobile */
  rotateOnMobile?: boolean;

  /** Resolución base (solo para estilos en embebido). Default 1280x720 */
  baseResolution?: { width: number; height: number };
  forceFullscreenLayout?: boolean; // <-- NUEVO PARA MOBILE
}

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const isPortraitNow = () =>
  !!(window.matchMedia && window.matchMedia('(orientation: portrait)').matches);

/* ---------- Fullscreen con fallback (overlay fijo) ---------- */
function useFullscreenWithFallback<T extends HTMLElement>(targetRef: React.RefObject<T>) {
  const [isNativeFs, setIsNativeFs] = useState(false);
  const [isPseudoFs, setIsPseudoFs] = useState(false);

  useEffect(() => {
    const onChange = () => {
      const active = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsNativeFs(active);
      if (!active) setIsPseudoFs(false);
    };
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange as any);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange as any);
    };
  }, []);

  const enter = async () => {
    const el = targetRef.current as (T & HTMLElement) | null;
    if (!el) return;
    try {
      const req: any = (el as any).requestFullscreen || (el as any).webkitRequestFullscreen;
      if (req) {
        await req.call(el);
        setIsNativeFs(true);
        return;
      }
    } catch {}
    // Fallback para navegadores sin Fullscreen API (iOS Safari)
    setIsPseudoFs(true);
  };

  const exit = async () => {
    try {
      const exitFn: any = document.exitFullscreen || (document as any).webkitExitFullscreen;
      if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
        await exitFn.call(document);
      }
    } catch {}
    setIsNativeFs(false);
    setIsPseudoFs(false);
  };

  return { isActive: isNativeFs || isPseudoFs, isNativeFs, isPseudoFs, enter, exit };
}
//test
const UnityGame: React.FC<UnityGameProps> = ({
  gameAssets,
  className,
  onLoaded,
  onError: _onError,
  publicKey,
  transactionId,
  enableFullscreen = true,
  // rotateOnMobile ignorado a propósito
  baseResolution = { width: 1280, height: 720 },
  forceFullscreenLayout = false,
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

  const { unityProvider, isLoaded, loadingProgression, sendMessage } = useUnityContext(unityConfig);
  

  useEffect(() => {
    if (isLoaded && onLoaded) onLoaded();
  }, [isLoaded, onLoaded]);

  useEffect(() => {
    if (isLoaded && publicKey) {
      sendMessage('WalletManager', 'SetWalletAddress', publicKey.toString());
    }
  }, [isLoaded, publicKey, sendMessage]);

  useEffect(() => {
    if (isLoaded && transactionId && transactionId.length > 0) {
      sendMessage('WalletManager', 'SetTransactionId', transactionId);
    }
  }, [isLoaded, transactionId, sendMessage]);

  const outerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const { isActive, isPseudoFs, enter, exit } = useFullscreenWithFallback<HTMLDivElement>(outerRef);
  
  // Usa el layout fullscreen si está activo o si lo forzamos desde fuera
  const useFsLayout = isActive || forceFullscreenLayout;

  const heightUnit =
    typeof CSS !== 'undefined' && (CSS as any).supports?.('height: 100dvh')
      ? '100dvh'
      : '100vh';

  // Bloquear scroll del documento durante pseudo-fullscreen
  useEffect(() => {
    if (!isPseudoFs) return;
    const html = document.documentElement;
    const body = document.body;
    const prevH = html.style.overflow,
      prevB = body.style.overflow;
    const prevTOH = (html.style as any).touchAction,
      prevTOB = (body.style as any).touchAction;
    const prevOSBH = (html.style as any).overscrollBehavior,
      prevOSBB = (body.style as any).overscrollBehavior;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    (html.style as any).touchAction = 'none';
    (body.style as any).touchAction = 'none';
    (html.style as any).overscrollBehavior = 'none';
    (body.style as any).overscrollBehavior = 'none';
    return () => {
      html.style.overflow = prevH;
      body.style.overflow = prevB;
      (html.style as any).touchAction = prevTOH;
      (body.style as any).touchAction = prevTOB;
      (html.style as any).overscrollBehavior = prevOSBH;
      (body.style as any).overscrollBehavior = prevOSBB;
    };
  }, [isPseudoFs]);

  /* -------- estilos (SIEMPRE una sola instancia de <Unity />) -------- */
  const outerStyle: React.CSSProperties =
    isActive && isPseudoFs
      ? {
          position: 'fixed',
          inset: 0,
          background: '#000',
          display: 'grid',
          placeItems: 'center',
          overflow: 'hidden',
          zIndex: 2147483647,
          touchAction: 'none',
          overscrollBehavior: 'none',
        }
      : { position: 'relative', width: '100%' };

  const frameStyle: React.CSSProperties = useFsLayout
    ? {
        width: '100vw',
        height: heightUnit,
        background: '#000',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        position: 'relative',
        // Safe areas iOS
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
      }
    : {
        width: '100%',
        aspectRatio: `${baseResolution.width} / ${baseResolution.height}`,
        maxHeight: '80vh',
        background: '#000',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        borderRadius: 8,
        margin: '0 auto',
        position: 'relative',
      };

  // Si forzamos layout, ocultar el botón FS para evitar confusiones
  const showFsButton = enableFullscreen && !forceFullscreenLayout; // <-- NUEVO


  const unityStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'block',
    opacity: isLoaded ? 1 : 0.5,
    transition: 'opacity .3s ease-in-out',
  };

  const containerClass = className || styles.container;

  const showRotateHint = isActive && isMobile() && isPortraitNow();

  return (
    <div ref={outerRef} style={outerStyle}>
      {!isLoaded && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'var(--color-text-secondary)',
            zIndex: 5,
          }}
        >
          <div>Loading Game…</div>
          <div style={{ textAlign: 'center', fontSize: 12 }}>{Math.round(loadingProgression * 100)}%</div>
        </div>
      )}

      <div style={frameStyle} id="unity-frame">
     {showFsButton && (
        <button
          onClick={isActive ? exit : enter}
          style={{
            position: 'absolute',
            top: 8,
            left: 8,                 // <-- pegado arriba a la izquierda
            zIndex: 10,
            background: 'rgba(0,0,0,.6)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,.25)',
            borderRadius: 8,
            padding: '6px 10px',
            fontSize: 12,
            lineHeight: 1,
            cursor: 'pointer',
            userSelect: 'none',
            backdropFilter: 'blur(2px)',
          }}
          title={isActive ? 'Exit fullscreen' : 'Enter fullscreen'}
          aria-label={isActive ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isActive ? 'Exit' : 'Fullscreen'}
        </button>
      )}

        {/* ÚNICA instancia de Unity */}
        <Unity className={containerClass} unityProvider={unityProvider} style={unityStyle} />

        {/* Hint opcional en móvil si está en portrait durante fullscreen */}
        {showRotateHint && (
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#cbd5e1',
              fontSize: 12,
              textAlign: 'center',
              padding: '6px 10px',
              background: 'rgba(0,0,0,.45)',
              borderRadius: 8,
              zIndex: 11,
            }}
          >
            Rotate your device for a better experience
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(UnityGame);
