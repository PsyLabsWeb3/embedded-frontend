import nacl from 'tweetnacl';
import bs58 from 'bs58';

export const bs58ToU8 = (s: string) => bs58.decode(s);
export const u8ToBs58 = (u: Uint8Array) => bs58.encode(Buffer.from(u));

// Generate an ephemeral dapp keypair (x25519 / NaCl box keypair)
export function generateDappKeypair() {
  const kp = nacl.box.keyPair(); // returns { publicKey, secretKey } (Uint8Arrays)
  return {
    publicKeyBase58: u8ToBs58(kp.publicKey),
    secretKeyBase58: u8ToBs58(kp.secretKey),
  };
}

/**
 * Decrypt Phantom's 'data' value returned in the deeplink response.
 *
 * @param dataBase58  - `data` query param (base58)
 * @param nonceBase58 - `nonce` query param (base58)
 * @param phantomPubKeyBase58 - `phantom_encryption_public_key` (base58)
 * @param dappSecretKeyBase58 - your dapp private key (base58) used in the original connect link
 *
 * Returns the JSON object inside data on success, or throws.
 */
export function decryptPhantomData(
  dataBase58: string,
  nonceBase58: string,
  phantomPubKeyBase58: string,
  dappSecretKeyBase58: string
) {
  const data = bs58ToU8(dataBase58);
  const nonce = bs58ToU8(nonceBase58);
  const phantomPub = bs58ToU8(phantomPubKeyBase58);
  const dappSecret = bs58ToU8(dappSecretKeyBase58);

  // Derive shared secret using X25519 (nacl.box.before)
  // (this returns a 32-byte shared key)
  const sharedKey = nacl.box.before(phantomPub, dappSecret);

  // Decrypt symmetricaly with secretbox (XSalsa20-Poly1305)
  const decrypted = nacl.secretbox.open(data, nonce, sharedKey);
  if (!decrypted) throw new Error('Failed to decrypt Phantom payload (authentication failed)');

  const jsonStr = new TextDecoder().decode(decrypted);
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error('Decrypted JSON malformed: ' + e);
  }
}

/**
 * Encrypt a payload (object) for a subsequent deeplink (Sign/SignTransaction).
 * You will send the encrypted blob as `payload` (base58) plus the `dapp_encryption_public_key`.
 */
export function encryptPayloadForPhantom(
  payloadObj: Record<string, any>,
  phantomPubKeyBase58: string,
  dappSecretKeyBase58: string
) {
  const plain = new TextEncoder().encode(JSON.stringify(payloadObj));
  const phantomPub = bs58ToU8(phantomPubKeyBase58);
  const dappSecret = bs58ToU8(dappSecretKeyBase58);

  const sharedKey = nacl.box.before(phantomPub, dappSecret);
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const cipher = nacl.secretbox(plain, nonce, sharedKey);

  return {
    payloadBase58: u8ToBs58(cipher),
    nonceBase58: u8ToBs58(nonce),
  };
}