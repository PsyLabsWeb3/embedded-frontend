/**
 * @fileoverview UnityGame Component
 * (…cabecera original…)
 */
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";
import { GameTypes } from '../../types';
import styles from './Snake2048.module.css';

interface UnityGameProps {
  gameAssets: GameTypes.UnityAssets;
  className?: string;
  onLoaded?: () => void;
  onError?: (error: string) => void;
  publicKey?: string | null;
  transactionId?: string | null;

  /** Mostrar botón y permitir pantalla completa (default: true) */
  enableFullscreen?: boolean;

  /** Controlado por gameConfig: rotar a landscape en móvil */
  rotateOnMobile?: boolean;

  /** Resolución de referencia del build (para contain al rotar por CSS) */
  baseResolution?: { width: number; height: number }; // default 1280x720
}

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const isLandscapeNow = () =>
  (window.matchMedia && window.matchMedia('(orientation: landscape)').matches) ||
  ((window as any).visualViewport?.width ?? window.innerWidth) >
  ((window as any).visualViewport?.height ?? window.innerHeight);

/* ---------- Fullscreen nativo con fallback overlay (GENÉRICO) ---------- */
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

/* ---------- Escalado contain para wrapper rotado (90°) ---------- */
function useRotatedContainStyle(baseW: number, baseH: number) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    const layout = () => {
      const vv: any = (window as any).visualViewport;
      const vw = vv?.width || window.innerWidth;
      const vh = vv?.height || window.innerHeight;
      const fudge = 0.985; // evita recortes por DPR
      // rotado 90°: ancho lógico = baseH, alto lógico = baseW
      const scale = Math.min(vw / baseH, vh / baseW) * fudge;
      setStyle({
        width: `${baseH * scale}px`,
        height: `${baseW * scale}px`,
        transform: 'rotate(90deg)',
        transformOrigin: 'center center',
        willChange: 'transform',
        maxWidth: '100vw',
        maxHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
      });
    };
    layout();
    const R = () => layout();
    window.addEventListener('resize', R);
    window.addEventListener('orientationchange', R);
    window.addEventListener('scroll', R);
    return () => {
      window.removeEventListener('resize', R);
      window.removeEventListener('orientationchange', R);
      window.removeEventListener('scroll', R);
    };
  }, [baseW, baseH]);
  return style;
}

const UnityGame: React.FC<UnityGameProps> = ({
  gameAssets,
  className,
  onLoaded,
  onError: _onError,
  publicKey,
  transactionId,
  enableFullscreen = true,
  rotateOnMobile = false,                 // ← lo controla gameConfig
  baseResolution = { width: 1280, height: 720 },
}) => {
  const unityConfig = useMemo(() => ({
    loaderUrl: gameAssets.loaderUrl,
    dataUrl: gameAssets.dataUrl,
    frameworkUrl: gameAssets.frameworkUrl,
    codeUrl: gameAssets.codeUrl,
  }), [gameAssets]);

  const { unityProvider, isLoaded, loadingProgression, sendMessage } = useUnityContext(unityConfig);

  useEffect(() => { if (isLoaded && onLoaded) onLoaded(); }, [isLoaded, onLoaded]);
  useEffect(() => { if (isLoaded && publicKey) sendMessage("WalletManager", "SetWalletAddress", publicKey.toString()); }, [isLoaded, publicKey, sendMessage]);
  useEffect(() => { if (isLoaded && transactionId && transactionId.length > 0) sendMessage("WalletManager", "SetTransactionId", transactionId); }, [isLoaded, transactionId, sendMessage]);

  const outerRef = useRef<HTMLDivElement>(null);
  const { isActive, isPseudoFs, enter, exit } = useFullscreenWithFallback(outerRef as React.RefObject<HTMLElement>);

  // fallback de rotación por CSS si el lock falla
  const [rotateCss, setRotateCss] = useState(false);

  const handleEnterFs = async () => {
    await enter();

    if (rotateOnMobile && isMobile()) {
      let locked = false;
      const so: any = (screen as any).orientation;
      if (so && typeof so.lock === 'function') {
        try {
          await so.lock('landscape');
          locked = true;
        } catch {}
      }
      // si a los 400ms seguimos en retrato, rotamos por CSS
      setTimeout(() => setRotateCss(!isLandscapeNow()), 400);
      if (!locked) setRotateCss(true);
    }
  };

  const handleExitFs = async () => {
    try {
      const so: any = (screen as any).orientation;
      if (so?.unlock) so.unlock();
      else if (so?.lock) await so.lock('natural');
    } catch {}
    setRotateCss(false);
    await exit();
  };

  // revalidar si cambia orientación en fullscreen
  useEffect(() => {
    if (!(rotateOnMobile && isMobile())) return;
    const onChange = () => { if (isActive) setRotateCss(!isLandscapeNow()); };
    window.addEventListener('orientationchange', onChange);
    window.addEventListener('resize', onChange);
    return () => {
      window.removeEventListener('orientationchange', onChange);
      window.removeEventListener('resize', onChange);
    };
  }, [isActive, rotateOnMobile]);

  /* -------- estilos (UNA sola instancia de <Unity />) -------- */
  const outerStyle: React.CSSProperties =
    isActive && isPseudoFs
      ? { position: 'fixed', inset: 0, background: '#000', display: 'grid', placeItems: 'center',
          overflow: 'hidden', zIndex: 9999,
          paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }
      : { position: 'relative', width: '100%' };

  // marco: en página => tarjeta 16:9; en fullscreen => viewport
  const frameStyle: React.CSSProperties = isActive
    ? { width: '100vw', height: '100vh', background: '#000', display: 'grid', placeItems: 'center', overflow: 'hidden', position: 'relative' }
    : { width: '100%', aspectRatio: '16 / 9', maxHeight: '80vh', background: '#000', display: 'grid',
        placeItems: 'center', overflow: 'hidden', borderRadius: 8, margin: '0 auto', position: 'relative' };

  const rotatedWrapperStyle = useRotatedContainStyle(baseResolution.width, baseResolution.height);
  const rotateActive = isActive && rotateOnMobile && isMobile() && rotateCss;

  // wrapper único: cambia SOLO estilos (no re-monta Unity)
  const wrapperStyle: React.CSSProperties = rotateActive
    ? rotatedWrapperStyle
    : { width: '100%', height: '100%', display: 'grid', placeItems: 'center' };

  const unityStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'block',
    opacity: isLoaded ? 1 : 0.5,
    transition: 'opacity .3s ease-in-out',
  };

  const containerClass = className || styles.container;

  return (
    <div ref={outerRef} style={outerStyle}>
      {!isLoaded && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', color: 'var(--color-text-secondary)', zIndex: 5
        }}>
          <div>Loading Game…</div>
          <div style={{ textAlign: 'center', fontSize: 12 }}>{Math.round(loadingProgression * 100)}%</div>
        </div>
      )}

      <div style={frameStyle} id="unity-frame">
        {enableFullscreen && (
          <button
            onClick={isActive ? handleExitFs : handleEnterFs}
            style={{
              position: 'absolute', top: 8, right: 8, zIndex: 10,
              background: 'rgba(0,0,0,.6)', color: '#fff',
              border: '1px solid rgba(255,255,255,.25)', borderRadius: 8,
              padding: '6px 10px', fontSize: 12
            }}
          >
            {isActive ? 'Exit' : 'Fullscreen'}
          </button>
        )}

        {/* Un SOLO wrapper + UNA sola instancia de <Unity /> */}
        <div style={wrapperStyle}>
          <Unity className={containerClass} unityProvider={unityProvider} style={unityStyle} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(UnityGame);
