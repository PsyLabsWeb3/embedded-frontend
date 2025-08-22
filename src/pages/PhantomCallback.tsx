// pages/PhantomCallback.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  parseQuery,
  deriveSharedKey,
  decryptPayload,
  getDappSecretKeyFromSession,
  clearDappSecretKeyFromSession,
  type PhantomConnectPayload,
} from '../utils/phantomDeepLink';

const PHANTOM_STATE_KEY = 'phantom_session_state'; // puedes cambiar el nombre
type PhantomState = {
  publicKey: string; // base58
  session: string;
  ts: number;
};

const PhantomCallback: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  React.useEffect(() => {
    (async () => {
      try {
        const q = parseQuery(search);

        // 1) parametros requeridos
        const phantomEncPubKey = q['phantom_encryption_public_key'];
        const data = q['data'];
        const nonce = q['nonce'];

        if (!phantomEncPubKey || !data || !nonce) {
          throw new Error('Missing query params from Phantom (encryption key / data / nonce).');
        }

        // 2) recuperar secret key efímera
        const dappSecretKeyBase58 = getDappSecretKeyFromSession();
        if (!dappSecretKeyBase58) {
          throw new Error('Missing dapp secret key in sessionStorage.');
        }

        // 3) derive shared key y desencripta payload
        const sharedKey = deriveSharedKey(phantomEncPubKey, dappSecretKeyBase58);
        const payload = decryptPayload<PhantomConnectPayload>(data, nonce, sharedKey);

        // payload esperado: { public_key, session, scope? }
        if (!payload?.public_key || !payload?.session) {
          throw new Error('Invalid Phantom payload (public_key/session missing).');
        }

        // 4) guarda estado (puedes cambiar a tu store global/context)
        const state: PhantomState = {
          publicKey: payload.public_key,
          session: payload.session,
          ts: Date.now(),
        };
        localStorage.setItem(PHANTOM_STATE_KEY, JSON.stringify(state));

        // 5) limpia secret key efímera (seguridad)
        clearDappSecretKeyFromSession();

        // 6) redirige (ajusta el destino a tu UX; ej. home o página del juego)
        navigate('/', { replace: true });
      } catch (err) {
        console.error('[PhantomCallback] Error:', err);
        // fallback UX: manda a home con un flag de error si quieres
        navigate('/?phantom_error=1', { replace: true });
      }
    })();
  }, [navigate, search]);

  return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      Procesando autorización de Phantom…
    </div>
  );
};

export default PhantomCallback;
