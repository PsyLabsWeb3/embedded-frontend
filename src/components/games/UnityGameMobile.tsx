// UnityGameMobile.tsx
import React, { useEffect, useMemo } from 'react';
import UnityGame from './UnityGame';
import { GameTypes } from '../../types';

interface Props {
  gameAssets: GameTypes.UnityAssets;
  publicKey?: string | null;
  transactionId?: string | null;
  onExit?: () => void; // callback al GamePage
  degenMode?: string | null;
  degenBetAmount?: number | null;
}

const isPortrait = () =>
  !!(typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(orientation: portrait)').matches);

const UnityGameMobile: React.FC<Props> = ({ gameAssets, publicKey, transactionId, onExit, degenMode, degenBetAmount }) => {
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

  useEffect(() => {
    if (degenMode || typeof degenBetAmount === 'number') {
      console.log('[UnityGameMobile] incoming degen props:', { degenMode, degenBetAmount });
    }
  }, [degenMode, degenBetAmount]);

  // Control local para desmontar Unity antes de volver al GamePage
  const [visible, setVisible] = React.useState(true);

  // Modal confirm
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setConfirmOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmOpen]);

  return (
    <div style={containerStyle}>
      {/* UnityGame: full-window por layout, 16:9 contain, sin botón FS */}
      {visible && (
        <UnityGame
          gameAssets={gameAssets}
          publicKey={publicKey || undefined}
          transactionId={transactionId || undefined}
          degenMode={degenMode}
          degenBetAmount={degenBetAmount}
          enableFullscreen={false}
          forceFullscreenLayout
          disableSafeAreaPadding
          fitAspect={{ width: 1280, height: 720 }}
        />
      )}

      {/* Chip de rotación (no bloquea) */}
      {portrait && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(env(safe-area-inset-top) + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            pointerEvents: 'none',
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
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style={{ flex: '0 0 16px' }}>
              <rect x="7" y="3" width="10" height="18" rx="2" ry="2"
                    fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M3 10a9 9 0 0 1 9-7"
                    fill="none" stroke="currentColor" strokeWidth="2" />
              <polyline points="10 1 12 3 10 5"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Turn your device for landscape mode</span>
          </div>
        </div>
      )}

      {/* Botón Exit */}
      <button
        onClick={() => setConfirmOpen(true)}
        style={{
          position: 'absolute',
          top: 'calc(env(safe-area-inset-top) + 8px)',
          left: 'calc(env(safe-area-inset-left) + 8px)',
          zIndex: 25,
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
        aria-haspopup="dialog"
        aria-controls="exit-confirm-modal"
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 17l5-5-5-5" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12H9" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Exit
        </span>
      </button>

      {/* Modal confirmación Exit (mensaje en inglés y aviso de pérdida de partida) */}
      {confirmOpen && (
        <div
          id="exit-confirm-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-title"
          onClick={() => setConfirmOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 30,
            background: 'rgba(0,0,0,.4)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(92vw, 420px)',
              background: '#111',
              color: '#fff',
              border: '1px solid rgba(255,255,255,.15)',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 6px 24px rgba(0,0,0,.45)',
            }}
          >
            <div id="exit-title" style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              Exit game?
            </div>
            <div style={{ fontSize: 13, opacity: .9 }}>
              If you exit now, the game will close and your current run will be lost.
              You'll be returned to the game page and will need to pay again to play.
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
              <button
                onClick={() => setConfirmOpen(false)}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,.25)',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // 1) desmonta Unity para disparar unload() (ver UnityGame cleanup)
                  setConfirmOpen(false);
                  // desmonta el Unity "child" antes de notificar al padre
                  // (no necesitamos esperar mucho, 30ms basta para que React procese el unmount)
                  // si tuvieras una bandera visible: setVisible(false);
                  // en este caso desmontamos al volver al padre igualmente
                  setVisible(false);
                  setTimeout(() => onExit && onExit(), 30);
                }}
                style={{
                  background: '#e11d48',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,.15)',
                  borderRadius: 8,
                  padding: '6px 12px',
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(UnityGameMobile);
