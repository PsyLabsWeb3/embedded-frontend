// PayEntryButton.tsx
import React, { useEffect, useMemo, useState } from "react";
import { AnchorProvider, Program, setProvider, BN } from "@coral-xyz/anchor";
import type { Idl } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import bs58 from "bs58";
import { encryptPayloadForPhantom } from "../../utils/phantomCrypto";
import idl from "../../constants/embedded.json";
import { LOCAL_STORAGE_CONF } from '../../constants';
import './PayEntryModal.css';

// ==== CONSTANTES (devnet) ====
const PROGRAM_ID = new PublicKey("BUQFRUJECRCADvdtStPUgcBgnvcNZhSWbuqBraPWPKf8");
const TREASURY_PDA = new PublicKey("EqderqcKvGtQKmYWuneRAb7xdgBXRNPpv21qBKF4JqdM");
// =================================

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

type AnchorWallet = {
  publicKey: PublicKey;
  signTransaction: (tx: any) => Promise<any>;
  signAllTransactions: (txs: any[]) => Promise<any[]>;
};

type Props = {
  onSent?: (sig: string) => void;
  onContinue?: (sig: string) => void; // abre Unity / siguiente paso
  fixedAmountSol?: number;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const PayEntryButton: React.FC<Props> = ({ onSent, onContinue, fixedAmountSol }) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [amountSol, setAmountSol] = useState<number>(fixedAmountSol ?? 0);
  const [sending, setSending] = useState(false);

  // Modal de confirmación
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPhase, setModalPhase] = useState<"waiting" | "ready">("waiting");
  const [txSig, setTxSig] = useState<string | null>(null);

  // Carga precio y calcula 0.5 USD en SOL, a menos que fijes el monto
  useEffect(() => {
    const last = localStorage.getItem("phantom_last_tx");
    if (last) {
      setTxSig(last);
      setModalOpen(true);
      setModalPhase("ready");
      localStorage.removeItem("phantom_last_tx");
    } else {
      if (typeof fixedAmountSol === "number") {
        setAmountSol(fixedAmountSol);
        return;
      }
      (async () => {
        try {
          const r = await fetch("https://backend.embedded.games/api/solanaPriceUSD");
          const data = await r.json();
          const price = Number(data?.priceUsd);
          if (!price || !isFinite(price) || price <= 0) return;
          console.log("SOL price:", price);
          const usd = 0.5;
          setAmountSol(Number((usd / price).toFixed(8)));
        } catch { }
      })();
    }
  }, [fixedAmountSol]);

  // Adapter -> AnchorWallet
  const anchorWallet = useMemo<AnchorWallet | null>(() => {
    if (wallet.publicKey && wallet.signTransaction) {
      return {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions:
          wallet.signAllTransactions ??
          (async (txs: any[]) => Promise.all(txs.map(wallet.signTransaction!))),
      };
    }
    return null;
  }, [wallet]);

  // Provider
  const provider = useMemo(() => {
    if (!anchorWallet) return null;
    const p = new AnchorProvider(connection, anchorWallet, { commitment: "confirmed" });
    setProvider(p);
    return p;
  }, [connection, anchorWallet]);

  // Program
  const program = useMemo(() => {
    if (!provider) return null;
    return new Program(idl as Idl, provider);
  }, [provider]);

  const phantomSession = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_SESSION) : null;
  const mobileCanSign = isMobile() && !!phantomSession;

  const disabled = sending || (!wallet.publicKey && !mobileCanSign);

  const handlePayEntry = async () => {
    console.log("PayEntryButton: pay entry", { amountSol });

    if (!program && !isMobile()) {
      console.warn("Program not ready for desktop flow");
      return;
    }

    try {
      setSending(true);

      const lamports = new BN(Math.trunc((amountSol || 0) * LAMPORTS_PER_SOL));
      if (lamports.lte(new BN(0))) {
        console.warn("Zero lamports, abort");
        setSending(false);
        return;
      }

      // Verify treasury
      const info = await connection.getAccountInfo(TREASURY_PDA);
      if (!info || !info.owner.equals(PROGRAM_ID) || info.data.length === 0) {
        console.warn("Treasury not initialized in this cluster.");
        setSending(false);
        return;
      }

      // Determine payer pubkey: adapter wallet or Phantom mobile saved pubkey
      const adapterPub = wallet.publicKey ?? null;
      const phantomWalletPubStr = typeof window !== "undefined" ? localStorage.getItem("phantom_wallet_pubkey") : null;
      const payerPubkey = adapterPub ?? (phantomWalletPubStr ? new PublicKey(phantomWalletPubStr) : null);

      if (!payerPubkey) {
        console.warn("No payer public key available (adapter or phantom mobile).");
        setSending(false);
        return;
      }

      // Desktop / adapter flow
      if (!isMobile() || (isMobile() && !localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_SESSION))) {
        if (!program || !anchorWallet) {
          throw new Error("Program or anchorWallet not ready for desktop flow");
        }

        // Desktop anchor rpc
        const sig = await program.methods
          .payEntry(lamports)
          .accounts({
            treasury: TREASURY_PDA,
            payer: anchorWallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc({ commitment: "confirmed" });

        onSent?.(sig);
        setTxSig(sig);
        setModalOpen(true);
        setModalPhase("waiting");

        const CONFIRM_TIMEOUT_MS = 10_000;
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
        const confirmPromise = connection.confirmTransaction(
          { signature: sig, blockhash, lastValidBlockHeight },
          "confirmed"
        );

        await Promise.race([confirmPromise, sleep(CONFIRM_TIMEOUT_MS)]);
        await sleep(10_000);
        setModalPhase("ready");
        setSending(false);
        return;
      }

      // Mobile flow with Phantom deep-link
      // Ensure we have required values saved at connect time
      const phantomSession = localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_SESSION);
      const phantomEncPub = localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_PHANTOM_ENC);
      const dappKpRaw = localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_KEYS);

      if (!phantomSession || !phantomEncPub || !dappKpRaw) {
        console.warn("Missing phantom session/encryption key/dapp keypair for mobile signing");
        setSending(false);
        return;
      }

      // Create a temporary Anchor Program that uses the Phantom wallet publicKey (no signer)
      const tempWallet: any = { publicKey: new PublicKey(phantomWalletPubStr!) };
      const tempProvider = new AnchorProvider(connection, tempWallet, { commitment: "confirmed" });
      const tempProgram = new Program(idl as Idl, tempProvider);

      // Build unsigned transaction
      const tx = await tempProgram.methods
        .payEntry(lamports)
        .accounts({
          treasury: TREASURY_PDA,
          payer: tempWallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      // Set fee payer and recent blockhash (wallet will expect these)
      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      tx.feePayer = tempWallet.publicKey;
      tx.recentBlockhash = blockhash;

      // Serialize message (what wallet signs)
      let unsignedBytes: Uint8Array;
      try {
        // VersionedTransaction (newer) has .version; use its serialize()
        if ((tx as any).version !== undefined && typeof (tx as any).serialize === "function") {
          // VersionedTransaction: serialize() returns wire-format bytes
          unsignedBytes = (tx as any).serialize();
        } else {
          // Legacy Transaction: serialize without requiring signatures or verifying them
          unsignedBytes = (tx as any).serialize({ requireAllSignatures: false, verifySignatures: false });
        }
      } catch (err) {
        console.warn("Falling back to serializeMessage() due to serialize() error:", err);
        unsignedBytes = tx.serializeMessage();
      }
      const unsignedBase58 = bs58.encode(Buffer.from(unsignedBytes));

      // Build the payload JSON as the Phantom expects:
      const payloadObj = {
        transaction: unsignedBase58,
        session: phantomSession,
      };

      const dappKp = JSON.parse(dappKpRaw);

      // Encrypt the JSON payload
      const { payloadBase58, nonceBase58 } = encryptPayloadForPhantom(payloadObj, phantomEncPub, dappKp.secretKeyBase58);

      // Save redirect and build deeplink
      const currentPath = window.location.pathname + window.location.search;
      localStorage.setItem(LOCAL_STORAGE_CONF.LOCAL_REDIRECT, currentPath);

      const redirectLink = encodeURIComponent(
        `${window.location.origin}/phantom-sign-callback?state=${encodeURIComponent(currentPath)}`
      );
      const appUrl = encodeURIComponent(window.location.origin);
      const dappPubEnc = encodeURIComponent(dappKp.publicKeyBase58);

      const deeplink =
        `https://phantom.app/ul/v1/signTransaction?` +
        `app_url=${appUrl}` +
        `&redirect_link=${redirectLink}` +
        `&dapp_encryption_public_key=${dappPubEnc}` +
        `&payload=${encodeURIComponent(payloadBase58)}` +
        `&nonce=${encodeURIComponent(nonceBase58)}`;

      // Redirect to Phantom
      window.location.href = deeplink;
    } catch (e) {
      console.error("pay_entry error:", e);
    } finally {
      setSending(false);
    }
  };

  const handleContinue = () => {
    if (txSig) onContinue?.(txSig);
    setModalOpen(false);
  };

  const explorerUrl = txSig
    ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
    : "#";

  return (
    <>
      <div className="pay-entry-section">
        <button
          onClick={handlePayEntry}
          disabled={disabled}
          className="pay-entry-button"
        >
          {sending ? "PROCESSING" : "START PLAYING"}
        </button>
      </div>

      {/* Modal de confirmación */}
      {modalOpen && (
        <div className="pay-entry-modal-backdrop">
          <div className="pay-entry-modal">
            <h3>Transaction Sent</h3>
            <div className="pay-entry-modal-content">
              <p className="pay-entry-transaction-info">
                Tx: {txSig ? (
                  <a href={explorerUrl} target="_blank" rel="noreferrer">
                    {txSig}
                  </a>
                ) : "—"}
              </p>

              {modalPhase === "waiting" ? (
                <div className="pay-entry-waiting">
                  <div className="pay-entry-spinner" />
                  <div className="pay-entry-waiting-text">
                    Waiting for confirmation (~10s)…
                  </div>
                </div>
              ) : (
                <button onClick={handleContinue} className="pay-entry-continue-button">
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PayEntryButton;
