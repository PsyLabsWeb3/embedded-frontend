// UnityGameMobile.tsx
import React, { useEffect, useMemo } from 'react';
import UnityGame from './UnityGame';
import { GameTypes } from '../../types';

interface Props {
  gameAssets: GameTypes.UnityAssets;
  publicKey?: string | null;
  transactionId?: string | null;
}

const isPortrait = () =>
  !!(typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(orientation: portrait)').matches);

const UnityGameMobile: React.FC<Props> = ({ gameAssets, publicKey, transactionId }) => {
  // Bloquea scroll del documento mientras esta vista esté montada
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    const prevTAh = (html.style as any).touchAction;
    const prevTAb = (body.style as any).touchAction;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    (html.style as any).touchAction = 'none';
    (body.style as any).touchAction = 'none';
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      (html.style as any).touchAction = prevTAh;
      (body.style as any).touchAction = prevTAb;
    };
  }, []);

  const containerStyle: React.CSSProperties = useMemo(() => ({
    width: '100vw',
    height: (typeof CSS !== 'undefined' && (CSS as any).supports?.('height: 100dvh')) ? '100dvh' : '100vh',
    background: '#000',
    position: 'fixed',
    inset: 0,
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 10,
  }), []);

  const [portrait, setPortrait] = React.useState(isPortrait());
  useEffect(() => {
    const onChange = () => setPortrait(isPortrait());
    window.addEventListener('orientationchange', onChange);
    window.addEventListener('resize', onChange);
    return () => {
      window.removeEventListener('orientationchange', onChange);
      window.removeEventListener('resize', onChange);
    };
  }, []);

  return (
    <div style={containerStyle}>
      {/* UnityGame con layout fullscreen forzado y sin botón */}
      <UnityGame
        gameAssets={gameAssets}
        publicKey={publicKey || undefined}
        transactionId={transactionId || undefined}
        enableFullscreen={false}
        forceFullscreenLayout
      />

       
        {/* Aviso de rotación (no bloquea interacción) */}
        {portrait && (
        <div
            style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top) + 8px)', // o usa bottom si lo prefieres
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            pointerEvents: 'none', // <- clave para no bloquear el juego
            }}
        >
            <div
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(0,0,0,.6)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,.2)',
                borderRadius: 999,
                padding: '6px 10px',
                fontSize: 12,
                lineHeight: 1,
                backdropFilter: 'blur(2px)',
                maxWidth: '90vw',
            }}
            >
            {/* Ícono inline (SVG) */}
            <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                aria-hidden="true"
                style={{ flex: '0 0 16px' }}
            >
                <rect
                x="7" y="3" width="10" height="18" rx="2" ry="2"
                fill="none" stroke="currentColor" strokeWidth="2"
                />
                <path
                d="M3 10a9 9 0 0 1 9-7"
                fill="none" stroke="currentColor" strokeWidth="2"
                />
                <polyline
                points="10 1 12 3 10 5"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                />
            </svg>
            <span>Gira tu dispositivo para jugar en horizontal</span>
            </div>
        </div>
        )}
    </div>
  );
};

export default React.memo(UnityGameMobile);
