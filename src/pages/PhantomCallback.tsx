import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  parseQuery,
  deriveSharedKey,
  decryptPayload,
} from '../utils/phantomDeepLink';
import type { PhantomConnectPayload } from '../utils/phantomDeepLink';

const PHANTOM_STATE_KEY        = 'phantom_session_state';
const PHANTOM_DAPP_SECRET_KEY  = 'phantom_dapp_secret_key';
const PHANTOM_DAPP_STATE_KEY   = 'phantom_dapp_state';

type PhantomState = {
  publicKey: string;
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

        const phantomEncPubKey = q['phantom_encryption_public_key'];
        const data   = q['data'];
        const nonce  = q['nonce'];
        const state  = q['state']; // 👈 validamos que sea el mismo

        if (!phantomEncPubKey || !data || !nonce || !state) {
          throw new Error('Missing query params from Phantom (enc key / data / nonce / state).');
        }

        const expectedState = localStorage.getItem(PHANTOM_DAPP_STATE_KEY);
        if (!expectedState || expectedState !== state) {
          throw new Error('Phantom state mismatch or missing.');
        }

        const dappSecretKeyBase58 = localStorage.getItem(PHANTOM_DAPP_SECRET_KEY);
        if (!dappSecretKeyBase58) {
          throw new Error('Missing dapp secret key in localStorage.');
        }

        const sharedKey = deriveSharedKey(phantomEncPubKey, dappSecretKeyBase58);
        const payload   = decryptPayload<PhantomConnectPayload>(data, nonce, sharedKey);

        if (!payload?.public_key || !payload?.session) {
          throw new Error('Invalid Phantom payload (public_key/session missing).');
        }

        const stateObj: PhantomState = {
          publicKey: payload.public_key,
          session: payload.session,
          ts: Date.now(),
        };
        localStorage.setItem(PHANTOM_STATE_KEY, JSON.stringify(stateObj));

        // Limpia efímeros
        localStorage.removeItem(PHANTOM_DAPP_SECRET_KEY);
        localStorage.removeItem(PHANTOM_DAPP_STATE_KEY);

        // Redirige a donde quieras (home, juego, etc.)
        navigate('/', { replace: true });
      } catch (err) {
        console.error('[PhantomCallback] Error:', err);

        // Limpia efímeros para permitir reintentar
        localStorage.removeItem(PHANTOM_DAPP_SECRET_KEY);
        localStorage.removeItem(PHANTOM_DAPP_STATE_KEY);

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
