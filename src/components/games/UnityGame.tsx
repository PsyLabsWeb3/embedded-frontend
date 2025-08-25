/**
 * @fileoverview UnityGame Component (mobile: contained + rotate estable; desktop: fullscreen opcional)
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
  enableFullscreen?: boolean;                 // solo desktop
  rotateOnMobile?: boolean;                   // rota en mobile (Android por defecto)
  baseResolution?: { width: number; height: number }; // p.ej. 1280x720
  forceIOSRotate?: boolean;                   // si quieres forzar iOS (riesgo de black screen)
}

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);

/* -------- mide el contenedor sin desmontar -------- */
function useContainerBox<T extends HTMLElement>(ref: React.RefObject<T>) {
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = ref.current;
    if (!el) return;

    const update = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: Math.max(0, Math.floor(r.width)), h: Math.max(0, Math.floor(r.height)) });
    };
    update();

    let cleanup = () => {};

    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      cleanup = () => ro.disconnect();
    } else {
      (window as Window).addEventListener('resize', update);
      cleanup = () => (window as Window).removeEventListener('resize', update);
    }
    return cleanup;
  }, [ref]);

  return box;
}

/* -------- calcula estilo del stage (centrado + scale + rotación opcional) -------- */
function buildStageStyle(
  boxW: number, boxH: number,
  baseW: number, baseH: number,
  rotated: boolean
): React.CSSProperties {
  if (!boxW || !boxH) return { position: 'absolute', inset: 0 };

  // Si rotamos 90°, el bounding box efectivo es baseH x baseW
  const scale = rotated
    ? Math.min(boxW / baseH, boxH / baseW)
    : Math.min(boxW / baseW, boxH / baseH);

  const rotateStr = rotated ? ' rotate(90deg)' : '';

  return {
    position: 'absolute',
    top: '50%',
    left: '50%',
    // OJO: el wrapper conserva SIEMPRE el tamaño del build 1280x720
    width: `${baseW}px`,
    height: `${baseH}px`,
    transformOrigin: 'center center',
    transform: `translate(-50%, -50%)${rotateStr} scale(${scale})`,
    willChange: 'transform',
    backfaceVisibility: 'hidden',
    pointerEvents: 'auto',
  };
}

const UnityGame: React.FC<UnityGameProps> = ({
  gameAssets,
  className,
  onLoaded,
  onError: _onError,
  publicKey,
  transactionId,
  // enableFullscreen = true,                 // sólo desktop
  rotateOnMobile = true,
  baseResolution = { width: 1280, height: 720 },
  forceIOSRotate = false,
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

  useEffect(() => { if (isLoaded && onLoaded) onLoaded(); }, [isLoaded, onLoaded]);
  useEffect(() => { if (isLoaded && publicKey) sendMessage('WalletManager', 'SetWalletAddress', publicKey.toString()); }, [isLoaded, publicKey, sendMessage]);
  useEffect(() => { if (isLoaded && transactionId && transactionId.length > 0) sendMessage('WalletManager', 'SetTransactionId', transactionId); }, [isLoaded, transactionId, sendMessage]);

  const outerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const { w: boxW, h: boxH } = useContainerBox(frameRef as React.RefObject<HTMLElement>);

  const mobile = isMobile();
  const ios = isIOS();

  // Para evitar pantalla negra en iOS, por defecto NO rotamos ahí
  const shouldRotate = mobile && rotateOnMobile && (forceIOSRotate || !ios);

  const outerStyle: React.CSSProperties = { position: 'relative', width: '100%', height: '100%' };

  const frameStyle: React.CSSProperties = mobile
    ? { position: 'relative', width: '100%', height: '100%', background: '#000', overflow: 'hidden', borderRadius: 8 }
    : { position: 'relative', width: '100%', aspectRatio: `${baseResolution.width} / ${baseResolution.height}`,
        maxHeight: '80vh', background: '#000', display: 'grid', placeItems: 'center',
        overflow: 'hidden', borderRadius: 8, margin: '0 auto' };

  const stageStyle = buildStageStyle(
    boxW, boxH,
    baseResolution.width, baseResolution.height,
    shouldRotate
  );

  const unityCanvasStyle: React.CSSProperties = {
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
          transform: 'translate(-50%, -50%)',
          color: 'var(--color-text-secondary)', zIndex: 5
        }}>
          <div>Loading Game…</div>
          <div style={{ textAlign: 'center', fontSize: 12 }}>{Math.round(loadingProgression * 100)}%</div>
        </div>
      )}

      <div ref={frameRef} style={frameStyle} id="unity-frame">
        {/* wrapper único (no desmonta) */}
        <div style={stageStyle}>
          <Unity className={containerClass} unityProvider={unityProvider} style={unityCanvasStyle} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(UnityGame);
