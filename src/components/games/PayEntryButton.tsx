import React, { useEffect, useMemo, useState } from "react";
import { AnchorProvider, Program, setProvider, BN } from "@coral-xyz/anchor";
import type { Idl } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  ComputeBudgetProgram,
  TransactionMessage,
  VersionedTransaction,
  SendTransactionError, 
} from "@solana/web3.js";
import bs58 from "bs58";
import { encryptPayloadForPhantom } from "../../utils/phantomCrypto";
import idl from "../../constants/embedded.json";
import { LOCAL_STORAGE_CONF } from "../../constants";
import "./PayEntryModal.css";
import "./DegenModeModal.css";
import gameboyIcon from "../../assets/gameboy.svg";

// Program constants for mainet
const PROGRAM_ID = new PublicKey(
  "BUQFRUJECRCADvdtStPUgcBgnvcNZhSWbuqBraPWPKf8"
);
const TREASURY_PDA = new PublicKey(
  "EqderqcKvGtQKmYWuneRAb7xdgBXRNPpv21qBKF4JqdM"
);

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
      try {
        connection.removeSignatureListener(subId);
      } catch {}
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
      const st = await connection.getSignatureStatuses([signature], {
        searchTransactionHistory: true,
      });
      const s = st.value[0];
      if (s?.confirmationStatus === "finalized") cleanup();
    } catch {}
  }, pollMs);

  const result = await new Promise<boolean>((resolve) => {
    tmo = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        if (subId !== null) {
          try {
            connection.removeSignatureListener(subId);
          } catch {}
        }
        if (interval) clearInterval(interval);
        resolve(false);
      }
    }, timeoutMs);

    const check = setInterval(() => {
      if (resolved) {
        clearInterval(check);
        resolve(true);
      }
    }, 100);
  });

  return result;
}

// Helper: build a v0 tx with compute budget and your program ix
// Helper: build a v0 tx with compute budget and your program ix
async function buildPayEntryV0Tx(
  connection: ReturnType<typeof useConnection>["connection"],
  payer: PublicKey,
  lamports: BN,
  program: Program
): Promise<VersionedTransaction> {
  const computeIxs = [
    ComputeBudgetProgram.setComputeUnitLimit({ units: 350_000 }),
    ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000 }),
  ];

  const ix = await program.methods
    .payEntry(lamports)
    .accounts({
      treasury: TREASURY_PDA,
      payer,
      systemProgram: SystemProgram.programId,
    })
    .instruction();

  // Mejor usar "finalized" para mayor estabilidad del blockhash
  const { blockhash } = await connection.getLatestBlockhash("finalized");

  const msgV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions: [...computeIxs, ix],
  }).compileToV0Message();

  return new VersionedTransaction(msgV0);
}


const PayEntryButton: React.FC<Props> = ({
  onSent,
  onContinue,
  onDegenPlay,
  fixedAmountSol,
}) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  // Component state
  const [amountSol, setAmountSol] = useState<number>(fixedAmountSol ?? 0);
  const [sending, setSending] = useState(false);
  const [solPriceUsd, setSolPriceUsd] = useState<number | null>(null);

  // Match confirmation modal state
  const [showMatchConfirmation, setShowMatchConfirmation] = useState(false);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [currentTransactionId, setCurrentTransactionId] = useState<
    string | null
  >(null);

  //log showMatchConfirmation and currentTransactionId
  console.log("showMatchConfirmation:", showMatchConfirmation);
  console.log("currentTransactionId:", currentTransactionId);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null); 
  const [txSig, setTxSig] = useState<string | null>(null);

  // Casual mode modal
  const [casualModalOpen, setCasualModalOpen] = useState(false);

  // Degen mode modal
  const [degenModalOpen, setDegenModalOpen] = useState(false);
  const [degenSelected, setDegenSelected] = useState<number | null>(null);

  const degenOptions = [5];

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
          const r = await fetch(
            "https://backend.embedded.games/api/solanaPriceUSD"
          );
          const data = await r.json();
          price = Number(data?.priceUsd);
          if (!price || !isFinite(price) || price <= 0)
            throw new Error("invalid price");
          setSolPriceUsd(price);
        }

        const solAmount = Number(
          (degenSelected / (price as number)).toFixed(8)
        );
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
  // const handleMatchReturn = () => {
  //   setShowMatchConfirmation(false);
  //   setIsLoadingTransaction(false);
  //   setCurrentTransactionId(null);
  // };

  // Handle modal confirm button click
  // const handleMatchConfirm = () => {
  //   // Switch to loading state but keep modal open
  //   setIsLoadingTransaction(true);
  //   // Execute payment logic
  //   handlePayEntry();
  // };

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
  };

  // Prerequisitos
  const [treasuryOk, setTreasuryOk] = useState<boolean | null>(null);

  // Handle price loading and Phantom wallet return flow
  useEffect(() => {
    const last = localStorage.getItem(
      LOCAL_STORAGE_CONF.PHANTOM_LAST_TRANSACTION
    );
    if (last) {
      setTxSig(last);
      setModalOpen(true);
      setModalError(null);
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
        const r = await fetch(
          "https://backend.embedded.games/api/solanaPriceUSD"
        );
        const data = await r.json();
        const price = Number(data?.priceUsd);
        if (!price || !isFinite(price) || price <= 0) return;
        setSolPriceUsd(price);
        const usdDefault = 0.5;
        setAmountSol(Number((usdDefault / price).toFixed(8)));
      } catch {
        /* ignore */
      }
    })();
  }, [fixedAmountSol, connection]);

  // small helper to format error + logs
  const formatTxError = (msg?: string, logs?: string[] | null) => {
    const base = msg || "Transaction failed.";
    if (!logs || logs.length === 0) return base;
    const tail = logs.slice(-6).join("\n");
    return `${base}\n\nLogs:\n${tail}`;
  };

  // Verify treasury account once on component mount
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const info = await connection.getAccountInfo(TREASURY_PDA);
        const ok =
          !!info && info.owner.equals(PROGRAM_ID) && info.data.length > 0;
        if (alive) setTreasuryOk(ok);
      } catch {
        if (alive) setTreasuryOk(false);
      }
    })();
    return () => {
      alive = false;
    };
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
    const p = new AnchorProvider(connection, anchorWallet, {
      commitment: "confirmed",
    });
    setProvider(p);
    return p;
  }, [connection, anchorWallet]);

  // Create Anchor program instance
  const program = useMemo(() => {
    if (!provider) return null;
    return new Program(idl as Idl, provider);
  }, [provider]);

  // Mobile Phantom wallet session data
  const phantomSession =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_SESSION)
      : null;
  const phantomEncPub =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_PHANTOM_ENC)
      : null;
  const dappKpRaw =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_KEYS)
      : null;
  const phantomWalletPubStr =
    typeof window !== "undefined"
      ? localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_WALLET_PUBKEY)
      : null;

  // Determine whether to use desktop adapter or mobile Phantom flow
  const usingDesktop = !isMobile() || (isMobile() && !phantomSession);

  // Check if all prerequisites are ready
  const anchorReady = !!anchorWallet && !!program;
  const phantomReady =
    !!phantomSession && !!phantomEncPub && !!dappKpRaw && !!phantomWalletPubStr;
  const amountReady = amountSol > 0;
  const networkReady = treasuryOk === true;

  const prereqsReady = usingDesktop
    ? anchorReady && amountReady && networkReady
    : phantomReady && amountReady && networkReady;

  // Disable button while processing or prerequisites not met
  const disabled = sending || !prereqsReady;
  const preparing = !sending && !prereqsReady;


  // Debug: log de prerequisites y señales relacionadas
  useEffect(() => {
    console.table({
      usingDesktop,
      anchorReady,
      phantomReady,
      amountReady,
      networkReady,
      prereqsReady,
      treasuryOk,
      hasWallet: !!wallet.publicKey,
      hasProgram: !!program,
      hasAnchorWallet: !!anchorWallet,
      amountSol,
    });
  }, [
    usingDesktop,
    anchorReady,
    phantomReady,
    amountReady,
    networkReady,
    prereqsReady,
    treasuryOk,
    wallet.publicKey,
    program,
    anchorWallet,
    amountSol,
  ]);



  // now accepts optional overrideSol (useful for degen flow where amountSol may not be the current state)
  const handlePayEntry = async (
    overrideSol?: number,
    usdBetAmount?: number
  ) => {
    // check wallet/provider readiness depending on desktop/mobile flow
    const anchorReady = !!anchorWallet && !!program;
    const phantomReady =
      !!phantomSession &&
      !!phantomEncPub &&
      !!dappKpRaw &&
      !!phantomWalletPubStr;
    const networkReady = treasuryOk === true;

    if (usingDesktop && !anchorReady) return;
    if (!usingDesktop && !phantomReady) return;
    if (!networkReady) return;

    try {
      setSending(true);

      const solToUse =
        typeof overrideSol === "number" ? overrideSol : amountSol;
      const lamports = new BN(Math.trunc((solToUse || 0) * LAMPORTS_PER_SOL));
      if (lamports.lte(new BN(0))) {
        setSending(false);
        return;
      }
     // Desktop adapter flow
if (usingDesktop) {
  if (!program || !anchorWallet)
    throw new Error("Program or anchorWallet not ready");

  // Construye VT v0
  const vtx = await buildPayEntryV0Tx(
    connection,
    anchorWallet.publicKey,
    lamports,
    program
  );

  // Pre-simulación (sin verificación de firma y pudiendo reemplazar blockhash)
  const sim = await connection.simulateTransaction(vtx, {
    sigVerify: false,
    replaceRecentBlockhash: true,
  });

  if (sim.value.err) {
    console.error("Pre-sim failed (desktop):", sim.value.err, sim.value.logs);
    setIsLoadingTransaction(false);
    setShowMatchConfirmation(false);
    setCurrentTransactionId(null);
    setSending(false);
    setModalError(formatTxError("Pre-simulation failed.", sim.value.logs));
    setModalOpen(true);
    return;
  }

  // Firmar y enviar
  const signed = await wallet.signTransaction!(vtx as any);
  // Try to derive a computed signature (useful if send fails with "already been processed")
  let computedSig: string | null = null;
  try {
    const maybe = signed.signatures?.[0];
    if (maybe) {
      // signatures item may be a Uint8Array or object depending on env - coerce
      computedSig = bs58.encode((maybe as unknown) as Uint8Array);
    }
  } catch {
    computedSig = null;
  }

  try {
    const sig = await connection.sendRawTransaction(signed.serialize(), {
      skipPreflight: false,
    });

    onSent?.(sig);
    setCurrentTransactionId(sig);
    setTxSig(sig);
    setModalError(null);
    setModalOpen(true);

    console.log("payEntry desktop sig:", sig);

    const ok = await waitForFinalized(connection, sig);
    if (ok) {
      setShowMatchConfirmation(false);
      setIsLoadingTransaction(false);
      setCurrentTransactionId(null);
      onContinue?.(sig);
    }
    setSending(false);
    return;
  } catch (err: any) {
    console.error("sendRawTransaction error:", err);

    // Handle SendTransactionError specifically and try to surface logs
    const isSendTxErr = err instanceof SendTransactionError || err?.name === "SendTransactionError";
    if (isSendTxErr) {
      let logs: string[] | null = null;
      try {
        if (typeof err.getLogs === "function") {
          logs = (await err.getLogs(connection)) ?? err.logs ?? null;
        } else {
          logs = err.logs ?? null;
        }
      } catch (le) {
        console.warn("Failed to get logs from SendTransactionError", le);
        logs = err.logs ?? null;
      }

      const msg = err.message ?? "Transaction failed.";

      // If the node says the tx was already processed, treat as success using the computed signature
      if (/already been processed/i.test(msg) && computedSig) {
        onSent?.(computedSig);
        setCurrentTransactionId(computedSig);
        setTxSig(computedSig);
        setModalError(null);
        setModalOpen(true);

        const ok = await waitForFinalized(connection, computedSig);
        if (ok) {
          setShowMatchConfirmation(false);
          setIsLoadingTransaction(false);
          setCurrentTransactionId(null);
          onContinue?.(computedSig);
        }
        setSending(false);
        return;
      }

      setModalError(formatTxError(msg, logs));
      setModalOpen(true);
    } else {
      setModalError(err?.message ?? "Transaction failed. Try again.");
      setModalOpen(true);
    }

    setIsLoadingTransaction(false);
    setShowMatchConfirmation(false);
    setCurrentTransactionId(null);
    setSending(false);
    return;
  }
}

      // Mobile Phantom deep-link flow
// Mobile Phantom deep-link flow
if (!phantomSession || !phantomEncPub || !dappKpRaw || !phantomWalletPubStr) {
  console.warn("Missing Phantom mobile prerequisites");
  setSending(false);
  return;
}

// Program temporal sin signer (solo pubkey)
const tempWalletPub = new PublicKey(phantomWalletPubStr);
const tempProvider = new AnchorProvider(
  connection,
  { publicKey: tempWalletPub } as any,
  { commitment: "confirmed" }
);
const tempProgram = new Program(idl as Idl, tempProvider);

// Construye VT v0
const vtx = await buildPayEntryV0Tx(
  connection,
  tempWalletPub,
  lamports,
  tempProgram
);

// Pre-simulación
const sim = await connection.simulateTransaction(vtx, {
  sigVerify: false,
  replaceRecentBlockhash: true,
});

if (sim.value.err) {
  console.error("Pre-sim failed (mobile):", sim.value.err, sim.value.logs);
  setIsLoadingTransaction(false);
  setShowMatchConfirmation(false);
  setCurrentTransactionId(null);
  setSending(false);
  setModalError(formatTxError("Pre-simulation failed.", sim.value.logs));
  setModalOpen(true);
  return;
}

// Persistir modo (nueva pestaña)
if (typeof usdBetAmount === "number" && usdBetAmount > 0) {
  localStorage.setItem(LOCAL_STORAGE_CONF.GAME_MODE, "Betting");
  localStorage.setItem(
    LOCAL_STORAGE_CONF.DEGEN_BET_AMOUNT,
    usdBetAmount.toString()
  );
} else {
  localStorage.removeItem(LOCAL_STORAGE_CONF.GAME_MODE);
  localStorage.removeItem(LOCAL_STORAGE_CONF.DEGEN_BET_AMOUNT);
}

// 🚫 No reasignes recentBlockhash. Si necesitas refrescar, recompila el mensaje.
// const { blockhash } = await connection.getLatestBlockhash("finalized");
// vtx.message.recentBlockhash = blockhash; // <- no

// Serializar VT para Phantom
const unsignedBase58 = bs58.encode(Buffer.from(vtx.serialize()));

const payloadObj = {
  transaction: unsignedBase58,
  session: phantomSession,
};
const dappKp = JSON.parse(dappKpRaw);
const { payloadBase58, nonceBase58 } = encryptPayloadForPhantom(
  payloadObj,
  phantomEncPub,
  dappKp.secretKeyBase58
);

const currentPath = window.location.pathname + window.location.search;
localStorage.setItem(LOCAL_STORAGE_CONF.LOCAL_REDIRECT, currentPath);

const redirectLink = encodeURIComponent(
  `${window.location.origin}/phantom-sign-callback?state=${encodeURIComponent(
    currentPath
  )}`
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
    } catch (e: any) {
      console.error("pay_entry error:", e);
      // Surface SendTransactionError logs when possible
      const isSendTxErr = e instanceof SendTransactionError || e?.name === "SendTransactionError";
      if (isSendTxErr) {
        let logs: string[] | null = null;
        try {
          if (typeof e.getLogs === "function") logs = (await e.getLogs(connection)) ?? e.logs ?? null;
          else logs = e.logs ?? null;
        } catch {
          logs = e.logs ?? null;
        }
        setModalError(formatTxError(e.message || "Transaction failed.", logs));
        setModalOpen(true);
      } else {
        setModalError((e as Error)?.message ?? "Transaction failed. Try again.");
        setModalOpen(true);
      }

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
    ? `https://explorer.solana.com/tx/${txSig}?cluster=mainnet-beta`
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
            {sending ? (
              "PROCESSING"
            ) : preparing ? (
              <div className="pay-entry-spinner small" />
            ) : (
              "DEGEN MODE"
            )}
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
            {sending ? (
              "PROCESSING"
            ) : preparing ? (
              <div className="pay-entry-spinner small" />
            ) : (
              "CASUAL PLAY"
            )}
          </button>
        </div>
      </div>

      {casualModalOpen && (
        <div className="match-confirmation-backdrop">
          <div className="match-confirmation-modal">
            {/* Header row: Title + Icon */}
            <div className="modal-header-row">
              <div className="modal-title-section">
                <h1 className="modal-title">
                  Match
                  <br />
                  Confirmation
                </h1>
              </div>
              <div className="modal-icon-section">
                <img
                  src={gameboyIcon}
                  alt="Game Console"
                  className="gameboy-icon"
                />
              </div>
            </div>

            {/* Main text */}
            <p className="modal-main-text">
              You are about to confirm a match, you will be charged with{" "}
              <span className="sol-amount">{amountSol.toFixed(8)} SOL</span>.
            </p>

            {/* Secondary text */}
            <p className="modal-secondary-text">
              This will push you up in the 500x Leaderboard.
            </p>
            {/* Error Text */}
            {modalError && (
              <p className="modal-error-text">{modalError}</p>
            )}

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
                style={{ display: "flex", justifyContent: "center" }}
              >
                {isLoadingTransaction ? (
                  <div className="loading-spinner-button" />
                ) : (
                  "CONFIRM MATCH"
                )}
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
                <h1 className="modal-title">
                  Degen Mode
                  <br />
                  Confirmation
                </h1>
              </div>
              <div className="modal-icon-section">
                <img
                  src={gameboyIcon}
                  alt="Game Console"
                  className="gameboy-icon"
                />
              </div>
            </div>

            <div className="degen-modal-subtitle">
              Degen Mode selected! If the match goes through, your selected USD
              amount will be converted to SOL at the current rate and deducted
              from your wallet.
            </div>
            <div className="degen-modal-description">
              Select your entry amount for Degen Mode:
            </div>
            <div className="degen-options-row">
              {degenOptions.map((opt) => (
                <button
                  key={opt}
                  className={`degen-option-button${
                    degenSelected === opt ? " selected" : ""
                  }`}
                  onClick={() => handleDegenSelect(opt)}
                >
                  ${opt}
                </button>
              ))}
            </div>
               {/* Error Text */}
            {modalError && (
              <p className="modal-error-text">{modalError}</p>
            )}
            <div style={{ marginTop: "4rem" }} className="modal-buttons">
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
        <div className="pay-entry-modal-backdrop">
          <div className="pay-entry-modal">
            <h3>
              {modalError ? "Transaction Error" : isLoadingTransaction ? "Processing..." : "Transaction Complete"}
            </h3>

            {modalError ? (
              <>
                <p className="modal-error-text">{modalError}</p>
                <div className="modal-buttons">
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      setModalError(null);
                    }}
                    className="modal-button return-button"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : isLoadingTransaction ? (
              <>
                <p className="modal-disclaimer-text">
                  Do not refresh or disconnect once the transaction has been processed or you could lose your entry fee.
                </p>
                <p className="modal-secondary-text">
                  You can check the status in the link below
                </p>
                <div className="pay-entry-modal-content">
                  <p className="pay-entry-transaction-info">
                    Tx:{" "}
                    {txSig ? (
                      <a href={explorerUrl} target="_blank" rel="noreferrer">
                        {txSig}
                      </a>
                    ) : (
                      "Transaction Error, close and try again."
                    )}
                  </p>
                  <div className="loading-section">
                    <div className="embedded-logo-container">
                      <img
                        src="/logo.svg"
                        alt="Embedded Logo"
                        className="embedded-logo"
                      />
                    </div>
                    <div className="loading-text">
                      <span className="loading-spinner"></span>
                      <p className="loading-label">Loading</p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="modal-buttons">
                <button
                  onClick={() => setModalOpen(false)}
                  className="modal-button return-button"
                >
                  Continue to Game
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      
    </>
  );
};

export default PayEntryButton;
