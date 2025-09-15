import React, { useEffect, useMemo, useState } from "react";
import { AnchorProvider, Program, setProvider, BN } from "@coral-xyz/anchor";
import type { Idl } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import bs58 from "bs58";
import { encryptPayloadForPhantom } from "../../utils/phantomCrypto";
import idl from "../../constants/embedded.json";
import { LOCAL_STORAGE_CONF } from '../../constants';
import MatchConfirmationModal from '../modals/MatchConfirmationModal';
import './PayEntryModal.css';

// Program constants for devnet
const PROGRAM_ID = new PublicKey("BUQFRUJECRCADvdtStPUgcBgnvcNZhSWbuqBraPWPKf8");
const TREASURY_PDA = new PublicKey("EqderqcKvGtQKmYWuneRAb7xdgBXRNPpv21qBKF4JqdM");

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

type AnchorWallet = {
  publicKey: PublicKey;
  signTransaction: (tx: any) => Promise<any>;
  signAllTransactions: (txs: any[]) => Promise<any[]>;
};

type Props = {
  onSent?: (sig: string) => void;
  onContinue?: (sig: string) => void;
  fixedAmountSol?: number;
};

/**
 * Waits for a transaction signature to reach "finalized" confirmation status.
 * Uses WebSocket subscription with polling fallback for reliability.
 */
async function waitForFinalized(
  connection: ReturnType<typeof useConnection>["connection"],
  signature: string,
  opts: { timeoutMs?: number; pollMs?: number } = {}
): Promise<boolean> {
  const timeoutMs = opts.timeoutMs ?? 120_000;
  const pollMs = opts.pollMs ?? 1500;

  let resolved = false;
  let subId: number | null = null;
  let interval: any = null;
  let tmo: any = null;

  const cleanup = () => {
    if (resolved) return;
    resolved = true;
    if (subId !== null) {
      try { connection.removeSignatureListener(subId); } catch {}
    }
    if (interval) clearInterval(interval);
    if (tmo) clearTimeout(tmo);
  };

  try {
    subId = await connection.onSignature(
      signature,
      (res) => {
        // Transaction confirmed
        void res;
        cleanup();
      },
      "finalized"
    );
  } catch {
    // Fallback to polling if WebSocket subscription fails
  }

  interval = setInterval(async () => {
    try {
      const st = await connection.getSignatureStatuses([signature], { searchTransactionHistory: true });
      const s = st.value[0];
      if (s?.confirmationStatus === "finalized") cleanup();
    } catch {}
  }, pollMs);

  const result = await new Promise<boolean>((resolve) => {
    tmo = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        if (subId !== null) {
          try { connection.removeSignatureListener(subId); } catch {}
        }
        if (interval) clearInterval(interval);
        resolve(false);
      }
    }, timeoutMs);

    const check = setInterval(() => {
      if (resolved) { clearInterval(check); resolve(true); }
    }, 100);
  });

  return result;
}

const PayEntryButton: React.FC<Props> = ({ onSent, onContinue, fixedAmountSol }) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  // Component state
  const [amountSol, setAmountSol] = useState<number>(fixedAmountSol ?? 0);
  const [sending, setSending] = useState(false);

  // Match confirmation modal state
  const [showMatchConfirmation, setShowMatchConfirmation] = useState(false);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);

  // Network prerequisites
  const [treasuryOk, setTreasuryOk] = useState<boolean | null>(null);

  // Handle price loading and Phantom wallet return flow
  useEffect(() => {
    const last = localStorage.getItem("phantom_last_tx");
    if (last) {
      localStorage.removeItem("phantom_last_tx");

      // Verify transaction and continue to game
      (async () => {
        const ok = await waitForFinalized(connection, last);
        if (ok) {
          onContinue?.(last);
        }
      })();
    }

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
        const usd = 0.5;
        setAmountSol(Number((usd / price).toFixed(8)));
      } catch { 
        // Ignore fetch errors for price calculation
      }
    })();
  }, [fixedAmountSol, connection]);

  // Verify treasury account once on component mount
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const info = await connection.getAccountInfo(TREASURY_PDA);
        const ok = !!info && info.owner.equals(PROGRAM_ID) && info.data.length > 0;
        if (alive) setTreasuryOk(ok);
      } catch {
        if (alive) setTreasuryOk(false);
      }
    })();
    return () => { alive = false; };
  }, [connection]);

  // Convert wallet adapter to Anchor wallet interface
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

  // Create Anchor provider instance
  const provider = useMemo(() => {
    if (!anchorWallet) return null;
    const p = new AnchorProvider(connection, anchorWallet, { commitment: "confirmed" });
    setProvider(p);
    return p;
  }, [connection, anchorWallet]);

  // Create Anchor program instance
  const program = useMemo(() => {
    if (!provider) return null;
    return new Program(idl as Idl, provider);
  }, [provider]);

  // Mobile Phantom wallet session data
  const phantomSession = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_SESSION) : null;
  const phantomEncPub = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_PHANTOM_ENC) : null;
  const dappKpRaw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_KEYS) : null;
  const phantomWalletPubStr = typeof window !== 'undefined' ? localStorage.getItem("phantom_wallet_pubkey") : null;

  // Determine whether to use desktop adapter or mobile Phantom flow
  const usingDesktop = !isMobile() || (isMobile() && !phantomSession);

  // Check if all prerequisites are ready
  const anchorReady = !!anchorWallet && !!program;
  const phantomReady = !!phantomSession && !!phantomEncPub && !!dappKpRaw && !!phantomWalletPubStr;
  const amountReady = amountSol > 0;
  const networkReady = treasuryOk === true;

  const prereqsReady = usingDesktop
    ? (anchorReady && amountReady && networkReady)
    : (phantomReady && amountReady && networkReady);

  // Disable button while processing or prerequisites not met
  const disabled = sending || !prereqsReady;

  // Event handlers for match confirmation modal
  const handleCasualClick = () => {
    if (!prereqsReady) return;
    setShowMatchConfirmation(true);
  };

  // Handle modal return button click
  const handleMatchReturn = () => {
    setShowMatchConfirmation(false);
    setIsLoadingTransaction(false);
    setCurrentTransactionId(null);
  };

  // Handle modal confirm button click
  const handleMatchConfirm = () => {
    // Switch to loading state but keep modal open
    setIsLoadingTransaction(true);
    // Execute payment logic
    handlePayEntryInternal();
  };

  // Internal payment processing function
  const handlePayEntryInternal = async () => {
    if (!prereqsReady) return;

    try {
      setSending(true);

      const lamports = new BN(Math.trunc((amountSol || 0) * LAMPORTS_PER_SOL));
      if (lamports.lte(new BN(0))) {
        setSending(false);
        return;
      }

      // Desktop adapter flow
      if (usingDesktop) {
        if (!program || !anchorWallet) throw new Error("Program or anchorWallet not ready");

        const sig = await program.methods
          .payEntry(lamports)
          .accounts({
            treasury: TREASURY_PDA,
            payer: anchorWallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc({ commitment: "confirmed" });

        onSent?.(sig);
        setCurrentTransactionId(sig);

        const ok = await waitForFinalized(connection, sig);
        if (ok) {
          // Transaction confirmed - close modal and continue
          setShowMatchConfirmation(false);
          setIsLoadingTransaction(false);
          setCurrentTransactionId(null);
          onContinue?.(sig);
        }
        setSending(false);
        return;
      }

      // Mobile Phantom deep-link flow
      if (!phantomSession || !phantomEncPub || !dappKpRaw || !phantomWalletPubStr) {
        console.warn("Missing Phantom mobile prerequisites");
        setSending(false);
        return;
      }

      // Create temporary program instance without signer (pubkey only)
      const tempWallet: any = { publicKey: new PublicKey(phantomWalletPubStr) };
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

      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      tx.feePayer = tempWallet.publicKey;
      tx.recentBlockhash = blockhash;

      // Serialize transaction
      let unsignedBytes: Uint8Array;
      try {
        if ((tx as any).version !== undefined && typeof (tx as any).serialize === "function") {
          unsignedBytes = (tx as any).serialize();
        } else {
          unsignedBytes = (tx as any).serialize({ requireAllSignatures: false, verifySignatures: false });
        }
      } catch {
        unsignedBytes = tx.serializeMessage();
      }
      const unsignedBase58 = bs58.encode(Buffer.from(unsignedBytes));

      const payloadObj = { transaction: unsignedBase58, session: phantomSession };
      const dappKp = JSON.parse(dappKpRaw);
      const { payloadBase58, nonceBase58 } = encryptPayloadForPhantom(payloadObj, phantomEncPub, dappKp.secretKeyBase58);

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

      window.location.href = deeplink;
    } catch (e) {
      console.error("pay_entry error:", e);
      // Reset modal state on error
      setIsLoadingTransaction(false);
      setShowMatchConfirmation(false);
      setCurrentTransactionId(null);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="pay-entry-section">
        <div className="button-group">
          <button
            className="pay-entry-button degen-mode-button"
            disabled
          >
            DEGEN MODE
          </button>
          <button
            onClick={handleCasualClick}
            disabled={disabled}
            className="pay-entry-button casual-play-button"
          >
            {sending ? "PROCESSING" : "CASUAL PLAY"}
          </button>
        </div>
      </div>

      {/* Match confirmation modal */}
      <MatchConfirmationModal
        isOpen={showMatchConfirmation}
        amountSol={amountSol}
        onReturn={handleMatchReturn}
        onConfirm={handleMatchConfirm}
        isProcessing={sending}
        isLoadingTransaction={isLoadingTransaction}
        transactionId={currentTransactionId || undefined}
      />
    </>
  );
};

export default PayEntryButton;
