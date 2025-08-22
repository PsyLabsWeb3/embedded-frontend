// utils/phantomDeepLink.ts
// deps:
//   npm i tweetnacl bs58
//   npm i --save-dev @types/tweetnacl
import nacl from 'tweetnacl';
import bs58 from 'bs58';

export type PhantomConnectPayload = {
  public_key: string; // base58
  session: string;    // UUID
  scope?: string[];   // opcional
};

export function parseQuery(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const out: Record<string, string> = {};
  params.forEach((v, k) => (out[k] = v));
  return out;
}

/**
 * Obtiene el shared key (X25519) entre Phantom y tu dApp.
 * - phantomEncryptionPubKeyBase58: 'phantom_encryption_public_key' (query)
 * - dappSecretKeyBase58: guardada en sessionStorage como 'phantom_dapp_secret_key'
 */
export function deriveSharedKey(
  phantomEncryptionPubKeyBase58: string,
  dappSecretKeyBase58: string
): Uint8Array {
  const phantomPubKey = bs58.decode(phantomEncryptionPubKeyBase58);
  const dappSecretKey = bs58.decode(dappSecretKeyBase58);
  // shared: 32 bytes
  return nacl.box.before(phantomPubKey, dappSecretKey);
}

/**
 * Desencripta el 'data' de Phantom usando XSalsa20-Poly1305 con sharedKey.
 * - dataBase58: 'data' (query)
 * - nonceBase58: 'nonce' (query)
 */
export function decryptPayload<T = any>(
  dataBase58: string,
  nonceBase58: string,
  sharedKey: Uint8Array
): T {
  const data = bs58.decode(dataBase58);
  const nonce = bs58.decode(nonceBase58);

  const opened = nacl.box.open.after(data, nonce, sharedKey);
  if (!opened) {
    throw new Error('Unable to decrypt Phantom payload.');
  }
  const json = new TextDecoder().decode(opened);
  return JSON.parse(json) as T;
}

/**
 * Recupera la secret key efímera que guardaste antes de abrir el deep link.
 */
export function getDappSecretKeyFromSession(): string | null {
  return sessionStorage.getItem('phantom_dapp_secret_key');
}

/**
 * Limpia la secret key efímera (recomendado tras completar el handshake).
 */
export function clearDappSecretKeyFromSession(): void {
  sessionStorage.removeItem('phantom_dapp_secret_key');
}
