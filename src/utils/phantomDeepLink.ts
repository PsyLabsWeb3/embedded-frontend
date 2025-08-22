import nacl from 'tweetnacl';
import bs58 from 'bs58';

export type PhantomConnectPayload = {
  public_key: string;
  session: string;
  scope?: string[];
  // Phantom también devuelve el mismo 'state' que enviaste
  // pero va en la query, no dentro del payload desencriptado.
};

export function parseQuery(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const out: Record<string, string> = {};
  params.forEach((v, k) => (out[k] = v));
  return out;
}

export function deriveSharedKey(
  phantomEncryptionPubKeyBase58: string,
  dappSecretKeyBase58: string
): Uint8Array {
  const phantomPubKey = bs58.decode(phantomEncryptionPubKeyBase58);
  const dappSecretKey = bs58.decode(dappSecretKeyBase58);
  return nacl.box.before(phantomPubKey, dappSecretKey);
}

export function decryptPayload<T = any>(
  dataBase58: string,
  nonceBase58: string,
  sharedKey: Uint8Array
): T {
  const data = bs58.decode(dataBase58);
  const nonce = bs58.decode(nonceBase58);
  const opened = nacl.box.open.after(data, nonce, sharedKey);
  if (!opened) throw new Error('Unable to decrypt Phantom payload.');
  const json = new TextDecoder().decode(opened);
  return JSON.parse(json) as T;
}
