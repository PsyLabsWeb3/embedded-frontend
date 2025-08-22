// hooks/usePhantomWC.ts
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SignClient from '@walletconnect/sign-client';
import type { SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import type { Connection, Transaction, VersionedTransaction } from '@solana/web3.js';

type ChainId = 'solana:mainnet' | 'solana:devnet';

type UsePhantomWCOptions = {
  projectId: string;
  chainId?: ChainId;
  walletApp?: 'phantom'; // futuro: agregar otras wallets si las quieres forzar
};

type PhantomWC = {
  address: string | null;
  connected: boolean;
  connecting: boolean;
  chainId: ChainId;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (message: Uint8Array | string) => Promise<string>; // firma base64
  signTransaction: (
    tx: Transaction | VersionedTransaction | Uint8Array | string
  ) => Promise<string>; // tx firmada base64
  signAndSendTransaction: (
    connection: Connection,
    tx: Transaction | VersionedTransaction | Uint8Array | string
  ) => Promise<string>; // signature base58
};

// -------------------- helpers --------------------
const toBase64 = (u8: Uint8Array) =>
  (typeof Buffer !== 'undefined' ? Buffer.from(u8).toString('base64') : btoa(String.fromCharCode(...u8)));

const fromBase64 = (b64: string) =>
  (typeof Buffer !== 'undefined'
    ? new Uint8Array(Buffer.from(b64, 'base64'))
    : new Uint8Array(atob(b64).split('').map(c => c.charCodeAt(0))));

function txToBase64(tx: Transaction | VersionedTransaction | Uint8Array | string): string {
  if (typeof tx === 'string') return tx;
  if (tx instanceof Uint8Array) return toBase64(tx);
  // @ts-ignore: ambos tipos exponen serialize()
  const bytes: Uint8Array = tx.serialize({ requireAllSignatures: false, verifySignatures: false });
  return toBase64(bytes);
}

function getAddressFromSession(session: SessionTypes.Struct | null): string | null {
  const accs: string[] = session?.namespaces?.solana?.accounts || [];
  if (!accs[0]) return null; // formato: "solana:<net>:<pubkey>"
  return accs[0].split(':')[2] || null;
}

// Fuerza apertura en Phantom usando universal link (no usa wc: para que no lo capture MetaMask)
function openWalletWithWCURI(uri: string, walletApp: 'phantom' = 'phantom') {
  if (walletApp === 'phantom') {
    window.location.href = `https://phantom.app/ul/v1/wc?uri=${encodeURIComponent(uri)}`;
  }
}

// -------------------- hook --------------------
export function usePhantomWC(opts: UsePhantomWCOptions): PhantomWC {
  const chainId: ChainId = opts.chainId ?? 'solana:mainnet';
  const walletApp = opts.walletApp ?? 'phantom';

  const clientRef = useRef<SignClient | null>(null);
  const [session, setSession] = useState<SessionTypes.Struct | null>(null);
  const [connecting, setConnecting] = useState(false);

  const address = useMemo(() => getAddressFromSession(session), [session]);
  const connected = !!address;

  // init + rehidratación de sesiones previas
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (clientRef.current) return;
      const client = await SignClient.init({ projectId: opts.projectId });
      if (!mounted) return;

      clientRef.current = client;

      const all = client.session.getAll();
      const existing = all.find(s => s.namespaces?.solana);
      if (existing) setSession(existing);

      client.on('session_delete', () => setSession(null));
      client.on('session_update', ({ topic }) => {
        const fresh = client.session.get(topic);
        if (fresh) setSession(fresh);
      });
    })();
    return () => { mounted = false; };
  }, [opts.projectId]);

  const connect = useCallback(async () => {
    const client = clientRef.current ?? (await SignClient.init({ projectId: opts.projectId }));
    clientRef.current = client;

    setConnecting(true);
    try {
      const { uri, approval } = await client.connect({
        requiredNamespaces: {
          solana: {
            chains: [chainId],
            methods: [
              'solana_signMessage',
              'solana_signTransaction',
              'solana_signAllTransactions',
              'solana_signAndSendTransaction',
            ],
            events: [],
          },
        },
      });

      if (uri) {
        // Abre Phantom para aprobar; la dApp NO navega ni redirige de vuelta
        openWalletWithWCURI(uri, walletApp);
      }

      const sess = await approval(); // se resuelve tras aprobar en Phantom
      setSession(sess);
    } finally {
      setConnecting(false);
    }
  }, [chainId, walletApp, opts.projectId]);

  const disconnect = useCallback(async () => {
    const client = clientRef.current;
    if (client && session) {
      try {
        await client.disconnect({
          topic: session.topic,
          reason: getSdkError('USER_DISCONNECTED'),
        });
      } catch { /* noop */ }
    }
    setSession(null);
  }, [session]);

  const signMessage = useCallback(async (message: Uint8Array | string) => {
    if (!clientRef.current || !session) throw new Error('Not connected');
    const msgBytes = typeof message === 'string' ? new TextEncoder().encode(message) : message;
    const msgBase64 = toBase64(msgBytes);

    const signatureBase64: string = await clientRef.current.request({
      topic: session.topic,
      chainId,
      request: { method: 'solana_signMessage', params: { message: msgBase64 } },
    });
    return signatureBase64;
  }, [chainId, session]);

  const signTransaction = useCallback(async (
    tx: Transaction | VersionedTransaction | Uint8Array | string
  ) => {
    if (!clientRef.current || !session) throw new Error('Not connected');
    const txBase64 = txToBase64(tx);

    const signedBase64: string = await clientRef.current.request({
      topic: session.topic,
      chainId,
      request: { method: 'solana_signTransaction', params: { transaction: txBase64 } },
    });
    return signedBase64;
  }, [chainId, session]);

  const signAndSendTransaction = useCallback(async (
    connection: Connection,
    tx: Transaction | VersionedTransaction | Uint8Array | string
  ) => {
    if (!clientRef.current || !session) throw new Error('Not connected');
    const txBase64 = txToBase64(tx);

    // 1) intenta flujo nativo de la wallet
    try {
      const signature: string = await clientRef.current.request({
        topic: session.topic,
        chainId,
        request: {
          method: 'solana_signAndSendTransaction',
          params: { transaction: txBase64, options: { skipPreflight: false } },
        },
      });
      return signature; // base58
    } catch {
      // 2) fallback: firmar y enviar por RPC
      const signedBase64: string = await clientRef.current.request({
        topic: session.topic,
        chainId,
        request: { method: 'solana_signTransaction', params: { transaction: txBase64 } },
      });
      const signedBytes = fromBase64(signedBase64);
      const sig = await connection.sendRawTransaction(signedBytes, { skipPreflight: false });
      return sig; // base58
    }
  }, [chainId, session]);

  return {
    address,
    connected,
    connecting,
    chainId,
    connect,
    disconnect,
    signMessage,
    signTransaction,
    signAndSendTransaction,
  };
}
