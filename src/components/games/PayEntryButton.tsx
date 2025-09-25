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
import './DegenModeModal.css';
import gameboyIcon from '../../assets/gameboy.svg';

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
  onContinue?: (sig: string) => void; // abre Unity / siguiente paso
  onDegenPlay?: (betAmountSol: number, betAmountUsd: number) => void;
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
      try { connection.removeSignatureListener(subId); } catch { }
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
    } catch { }
  }, pollMs);

  const result = await new Promise<boolean>((resolve) => {
    tmo = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        if (subId !== null) {
          try { connection.removeSignatureListener(subId); } catch { }
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

const PayEntryButton: React.FC<Props> = ({ onSent, onContinue, onDegenPlay, fixedAmountSol }) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  // Component state
  const [amountSol, setAmountSol] = useState<number>(fixedAmountSol ?? 0);
  const [sending, setSending] = useState(false);
  const [solPriceUsd, setSolPriceUsd] = useState<number | null>(null);

  // Match confirmation modal state
  const [showMatchConfirmation, setShowMatchConfirmation] = useState(false);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<string | null>(null);

    // Modal
  const [modalOpen, setModalOpen] = useState(false);
  // const [modalPhase, setModalPhase] = useState<"waiting" | "ready">("waiting");
  const [txSig, setTxSig] = useState<string | null>(null);

  // Casual mode modal
  const [casualModalOpen, setCasualModalOpen] = useState(false);

  // Degen mode modal
  const [degenModalOpen, setDegenModalOpen] = useState(false);
  const [degenSelected, setDegenSelected] = useState<number | null>(null);


  const degenOptions = [1, 2, 5, 10];

  const handleDegenOpen = () => {
    setDegenModalOpen(true);
    setDegenSelected(null);
  };

  const handleDegenCancel = () => {
    setDegenModalOpen(false);
    setDegenSelected(null);
  };

  const handleDegenContinue = () => {
    if (!degenSelected) return;
    // Convert selected USD -> SOL using cached price (with fallback)
    (async () => {
      try {
        let price = solPriceUsd;
        if (!price || !(price > 0)) {
          const r = await fetch("https://backend.embedded.games/api/solanaPriceUSD");
          const data = await r.json();
          price = Number(data?.priceUsd);
          if (!price || !isFinite(price) || price <= 0) throw new Error("invalid price");
          setSolPriceUsd(price);
        }

        const solAmount = Number((degenSelected / (price as number)).toFixed(8));
        setDegenModalOpen(false);
        // notify parent that a degen play is about to happen (USD and SOL)
        onDegenPlay?.(solAmount, degenSelected);
        // reuse existing payment flow and logic
        await handlePayEntry(solAmount, degenSelected);
      } catch (e) {
        console.error("Failed to get SOL price for degen flow", e);
        setDegenModalOpen(false);
      }
    })();
  };

  const handleDegenSelect = (val: number) => {
    setDegenSelected(val);
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
    handlePayEntry();
  };

  // Handle Open Casual Modal
  const handleOpenCasualModal = () => {
    setCasualModalOpen(true);
  };

  // Handle Cancel Casual Modal
  const handleCasualCancel = () => {
    localStorage.removeItem(LOCAL_STORAGE_CONF.GAME_MODE);
    localStorage.removeItem(LOCAL_STORAGE_CONF.DEGEN_BET_AMOUNT);
    setCasualModalOpen(false);
  };

  // Handle Confirm Casual Modal
  const handleCasualConfirm = () => {
    // Switch to loading state but keep modal open
    setIsLoadingTransaction(true);
    // Execute payment logic
    handlePayEntry();
  }

  // Prerequisitos
  const [treasuryOk, setTreasuryOk] = useState<boolean | null>(null);

  // Handle price loading and Phantom wallet return flow
  useEffect(() => {
    const last = localStorage.getItem(LOCAL_STORAGE_CONF.PHANTOM_LAST_TRANSACTION);
    if (last) {

      setTxSig(last);
      setModalOpen(true);
      // setModalPhase("waiting");
      localStorage.removeItem(LOCAL_STORAGE_CONF.PHANTOM_LAST_TRANSACTION);
       
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

    // Pre-fetch SOL price once and compute default casual amount (0.5 USD) so both flows reuse it
    (async () => {
      try {
        const r = await fetch("https://backend.embedded.games/api/solanaPriceUSD");
        const data = await r.json();
        const price = Number(data?.priceUsd);
        if (!price || !isFinite(price) || price <= 0) return;
        setSolPriceUsd(price);
        const usdDefault = 0.5;
        setAmountSol(Number((usdDefault / price).toFixed(8)));
      } catch { /* ignore */ }
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
  const phantomWalletPubStr = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_WALLET_PUBKEY) : null;

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
  const preparing = !sending && !prereqsReady; 

  // Helper: log tx details without secrets
const logTx = (tx: any) => {
  try {
    console.groupCollapsed("payEntry: tx");
    console.debug("feePayer:", tx.feePayer?.toBase58?.() ?? tx.feePayer);
    console.debug("recentBlockhash:", tx.recentBlockhash);
    const ixs = tx.instructions ?? [];
    console.debug("#instructions:", ixs.length);
    ixs.forEach((ix: any, i: number) => {
      console.groupCollapsed(`ix[${i}] programId=${ix.programId?.toBase58?.() ?? ix.programId}`);
      const keys = (ix.keys || []).map((k: any) => ({
        pubkey: k.pubkey?.toBase58?.() ?? String(k.pubkey),
        isSigner: !!k.isSigner,
        isWritable: !!k.isWritable,
      }));
      console.table(keys);
      try {
        if (ix.data) console.debug("data(b58):", bs58.encode(ix.data));
      } catch {
        console.debug("data(len):", ix.data?.length ?? 0);
      }
      console.groupEnd();
    });
    console.groupEnd();
  } catch (e) {
    console.warn("payEntry: logTx failed", e);
  }
};

  // now accepts optional overrideSol (useful for degen flow where amountSol may not be the current state)
  const handlePayEntry = async (overrideSol?: number, usdBetAmount?: number) => {
    // check wallet/provider readiness depending on desktop/mobile flow
    const anchorReady = !!anchorWallet && !!program;
    const phantomReady = !!phantomSession && !!phantomEncPub && !!dappKpRaw && !!phantomWalletPubStr;
    const networkReady = treasuryOk === true;

    if (usingDesktop && !anchorReady) return;
    if (!usingDesktop && !phantomReady) return;
    if (!networkReady) return;

    try {
      setSending(true);

      const solToUse = typeof overrideSol === "number" ? overrideSol : amountSol;
      const lamports = new BN(Math.trunc((solToUse || 0) * LAMPORTS_PER_SOL));
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
        setTxSig(sig);
        setModalOpen(true);
        // setModalPhase("waiting");

        // Log before sending
        logTx(sig);

        const ok = await waitForFinalized(connection, sig);
        if (ok) {
          // Transaction confirmed - close modal and continue
          setShowMatchConfirmation(false);
          setIsLoadingTransaction(false);
          setCurrentTransactionId(null);
          // setModalPhase("ready");
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

      // Guardar Campos de Game Mode y Degen Bet Amount
    // Persistir modo para el flujo móvil (pestaña nueva)
        if (!usingDesktop) {
          if (typeof usdBetAmount === "number" && usdBetAmount > 0) {
            // DEGEN (Betting)
            localStorage.setItem(LOCAL_STORAGE_CONF.GAME_MODE, "Betting");
            localStorage.setItem(LOCAL_STORAGE_CONF.DEGEN_BET_AMOUNT, usdBetAmount.toString());
          } else {
            // CASUAL
            localStorage.removeItem(LOCAL_STORAGE_CONF.GAME_MODE);
            localStorage.removeItem(LOCAL_STORAGE_CONF.DEGEN_BET_AMOUNT);
          }
        }

      // Construir deeplink
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

  //   const handleContinue = () => {
  //   if (txSig) onContinue?.(txSig);
  //   setModalOpen(false);
  // };

  const explorerUrl = txSig
    ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
    : "#";

  return (
    <>
      <div className="pay-entry-section">
        <div className="button-group">
          <button
            className="pay-entry-button degen-mode-button"
            onClick={handleDegenOpen}
            disabled={disabled}
            aria-busy={preparing || sending}
          >
          {sending
              ? "PROCESSING"
              : preparing
                ? <div className="pay-entry-spinner small" />
                : "DEGEN MODE"}
          </button>
          <button
            onClick={() => {
              // Solo por claridad extra; no es estrictamente necesario si ya cambiaste handlePayEntry
              if (isMobile()) {
                localStorage.removeItem(LOCAL_STORAGE_CONF.GAME_MODE);
                localStorage.removeItem(LOCAL_STORAGE_CONF.DEGEN_BET_AMOUNT);
              }
              // void handlePayEntry();
              handleOpenCasualModal();
            }}
            disabled={disabled}
            className="pay-entry-button casual-play-button"
            aria-busy={preparing || sending}
          >
            {sending
              ? "PROCESSING"
              : preparing
                ? <div className="pay-entry-spinner small" />
                : "CASUAL PLAY"}
          </button>
        </div>
      </div>

       
        {casualModalOpen && (
          <div className="match-confirmation-backdrop">
          <div className="match-confirmation-modal">
            {/* Header row: Title + Icon */}
            <div className="modal-header-row">
              <div className="modal-title-section">
                <h1 className="modal-title">Match<br />Confirmation</h1>
              </div>
              <div className="modal-icon-section">
                <img src={gameboyIcon} alt="Game Console" className="gameboy-icon" />
              </div>
            </div>

            {/* Main text */}
            <p className="modal-main-text">
              You are about to confirm a match, you will be charged with{' '}
              <span className="sol-amount">{amountSol.toFixed(8)} SOL</span>.
            </p>

            {/* Secondary text */}
            <p className="modal-secondary-text">
              This will push you up in the 500x Leaderboard.
            </p>

            {/* Additional text */}
            <p className="modal-additional-text">
              Please confirm your wallet transaction after.
            </p>

            {/* Action Buttons */}
            <div className="modal-buttons">
              <button
                className="modal-button return-button"
                onClick={handleCasualCancel}
                disabled={isLoadingTransaction}
              >
                RETURN
              </button>
              <button
                className="modal-button confirm-button"
                onClick={handleCasualConfirm}
                disabled={isLoadingTransaction}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                {isLoadingTransaction? <div className="loading-spinner-button" /> : 'CONFIRM MATCH'}
              </button>
            </div>
          </div>
        </div>
        )}

      {/* Degen Mode Modal */}
      {degenModalOpen && (
        <div className="match-confirmation-backdrop">
          <div className="match-confirmation-modal">
          
              {/* Header row: Title + Icon */}
            <div className="modal-header-row">
              <div className="modal-title-section">
                <h1 className="modal-title">Degen Mode<br />Confirmation</h1>
              </div>
              <div className="modal-icon-section">
                <img src={gameboyIcon} alt="Game Console" className="gameboy-icon" />
              </div>
            </div>

            <div className="degen-modal-subtitle">
              Degen Mode selected! If the match goes through, your selected USD amount will be converted to SOL at the current rate and deducted from your wallet.
            </div>
            <div className="degen-modal-description">
              Select your entry amount for Degen Mode:
            </div>
            <div className="degen-options-row">
              {degenOptions.map(opt => (
                <button
                  key={opt}
                  className={`degen-option-button${degenSelected === opt ? " selected" : ""}`}
                  onClick={() => handleDegenSelect(opt)}
                >
                  ${opt}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '4rem' }} className="modal-buttons">
              <button
                onClick={handleDegenCancel}
                className="modal-button return-button"
              >
                Cancel
              </button>
              <button
                onClick={handleDegenContinue}
                className="modal-button confirm-button"
                disabled={degenSelected === null || isLoadingTransaction}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {modalOpen && (
        <div className="match-confirmation-backdrop">
          <div className="match-confirmation-modal">

              {/* Header row: Title + Icon */}
            <div className="modal-header-row">
              <div className="modal-title-section">
                <h1 className="modal-title">Match<br />Confirmation</h1>
              </div>
              <div className="modal-icon-section">
                <img src={gameboyIcon} alt="Game Console" className="gameboy-icon" />
              </div>
            </div>

             {/* Main waiting text */}
           <p className="modal-main-text">
              Please wait while transaction is processing for your game.
            </p>
 
            {/* Secondary text */}
            <p className="modal-secondary-text">
              You can check the status in the link below
            </p>

            <div className="pay-entry-modal-content">
              <p className="pay-entry-transaction-info">
                Tx: {txSig ? (
                  <a href={explorerUrl} target="_blank" rel="noreferrer">
                    {txSig}
                  </a>
                ) : "—"}
              </p>
               {/* Logo and Loading */}
            <div className="loading-section">
              <div className="embedded-logo-container">
                <img src="/logo.svg" alt="Embedded Logo" className="embedded-logo" />
              </div>
              <div className="loading-text">
                <span className="loading-spinner"></span>
                <p className="loading-label">Loading</p>
              </div>
            </div>
          

              {/* {modalPhase === "waiting" ? (
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
              )} */}
            </div>
          </div>
        </div>
      )}

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
