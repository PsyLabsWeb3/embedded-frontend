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

// Program constants for mainnet
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
  onContinue?: (sig: string) => void;
};

// Helper function to wait for transaction finalization - simplified polling approach
async function waitForFinalized(
  connection: ReturnType<typeof useConnection>["connection"],
  signature: string,
  opts: { timeoutMs?: number; pollMs?: number } = {}
): Promise<boolean> {
  const timeoutMs = opts.timeoutMs ?? 120_000;
  const pollMs = opts.pollMs ?? 2000;

  const startTime = Date.now();

  return new Promise<boolean>((resolve) => {
    const checkStatus = async () => {
      try {
        // Check if we've timed out
        if (Date.now() - startTime > timeoutMs) {
          console.log("Transaction confirmation timeout");
          resolve(false);
          return;
        }

        // Get transaction status
        const statuses = await connection.getSignatureStatuses([signature], {
          searchTransactionHistory: true,
        });
        
        const status = statuses.value[0];
        
        if (status?.confirmationStatus === "finalized") {
          console.log("Transaction finalized successfully");
          resolve(true);
          return;
        }
        
        if (status?.err) {
          console.error("Transaction failed:", status.err);
          resolve(false);
          return;
        }

        // Continue polling
        setTimeout(checkStatus, pollMs);
      } catch (error) {
        console.error("Error checking transaction status:", error);
        setTimeout(checkStatus, pollMs);
      }
    };

    // Start checking immediately
    checkStatus();
  });
}

// Helper to build PvE transaction
async function buildPvEPayEntryTx(
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

  const { blockhash } = await connection.getLatestBlockhash("finalized");

  const msgV0 = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions: [...computeIxs, ix],
  }).compileToV0Message();

  return new VersionedTransaction(msgV0);
}

const PayEntryPvEButton: React.FC<Props> = ({ onSent, onContinue }) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  // Component state
  const [amountSol, setAmountSol] = useState<number>(0);
  const [sending, setSending] = useState(false);
  const [solPriceUsd, setSolPriceUsd] = useState<number | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);

  // Treasury verification
  const [treasuryOk, setTreasuryOk] = useState<boolean | null>(null);

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

  const disabled = sending || !prereqsReady;

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

  // Set PvE amount (0.10 USD) on component mount
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

    // Pre-fetch SOL price and set PvE amount (0.10 USD)
    (async () => {
      try {
        const r = await fetch(
          "https://backend.embedded.games/api/solanaPriceUSD"
        );
        const data = await r.json();
        const price = Number(data?.priceUsd);
        if (!price || !isFinite(price) || price <= 0) return;
        setSolPriceUsd(price);
        const pveUsdAmount = 0.10; // PvE fixed amount
        setAmountSol(Number((pveUsdAmount / price).toFixed(8)));
      } catch {
        /* ignore */
      }
    })();
  }, [connection]);

  const formatTxError = (msg?: string, logs?: string[] | null) => {
    const base = msg || "Transaction failed.";
    if (!logs || logs.length === 0) return base;
    const tail = logs.slice(-6).join("\n");
    return `${base}\n\nLogs:\n${tail}`;
  };

  const handlePvEPayEntry = async () => {
    // Check prerequisites
    if (usingDesktop && !anchorReady) return;
    if (!usingDesktop && !phantomReady) return;
    if (!networkReady) return;

    try {
      setSending(true);
      setIsLoadingTransaction(true);

      const lamports = new BN(Math.trunc(amountSol * LAMPORTS_PER_SOL));
      if (lamports.lte(new BN(0))) {
        setSending(false);
        setIsLoadingTransaction(false);
        return;
      }

      // Desktop adapter flow
      if (usingDesktop) {
        if (!program || !anchorWallet)
          throw new Error("Program or anchorWallet not ready");

        const vtx = await buildPvEPayEntryTx(
          connection,
          anchorWallet.publicKey,
          lamports,
          program
        );

        // Pre-simulation
        const sim = await connection.simulateTransaction(vtx, {
          sigVerify: false,
          replaceRecentBlockhash: true,
        });

        if (sim.value.err) {
          console.error("Pre-sim failed (desktop):", sim.value.err, sim.value.logs);
          setIsLoadingTransaction(false);
          setSending(false);
          setModalError(formatTxError("Pre-simulation failed.", sim.value.logs));
          setModalOpen(true);
          return;
        }

        // Sign and send
        const signed = await wallet.signTransaction!(vtx as any);
        
        // Try to derive computed signature
        let computedSig: string | null = null;
        try {
          const maybe = signed.signatures?.[0];
          if (maybe) {
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
          setTxSig(sig);
          setModalError(null);
          setModalOpen(true);

          console.log("PvE payEntry desktop sig:", sig);

          const ok = await waitForFinalized(connection, sig);
          if (ok) {
            setIsLoadingTransaction(false);
            onContinue?.(sig);
          }
          setSending(false);
          return;
        } catch (err: any) {
          console.error("sendRawTransaction error:", err);

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

            // If already processed, use computed signature
            if (/already been processed/i.test(msg) && computedSig) {
              onSent?.(computedSig);
              setTxSig(computedSig);
              setModalError(null);
              setModalOpen(true);

              const ok = await waitForFinalized(connection, computedSig);
              if (ok) {
                setIsLoadingTransaction(false);
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
          setSending(false);
          return;
        }
      }

      // Mobile Phantom deep-link flow
      if (!phantomSession || !phantomEncPub || !dappKpRaw || !phantomWalletPubStr) {
        console.warn("Missing Phantom mobile prerequisites");
        setSending(false);
        setIsLoadingTransaction(false);
        return;
      }

      // Create temporary program for mobile
      const tempWalletPub = new PublicKey(phantomWalletPubStr);
      const tempProvider = new AnchorProvider(
        connection,
        { publicKey: tempWalletPub } as any,
        { commitment: "confirmed" }
      );
      const tempProgram = new Program(idl as Idl, tempProvider);

      const vtx = await buildPvEPayEntryTx(
        connection,
        tempWalletPub,
        lamports,
        tempProgram
      );

      // Pre-simulation
      const sim = await connection.simulateTransaction(vtx, {
        sigVerify: false,
        replaceRecentBlockhash: true,
      });

      if (sim.value.err) {
        console.error("Pre-sim failed (mobile):", sim.value.err, sim.value.logs);
        setIsLoadingTransaction(false);
        setSending(false);
        setModalError(formatTxError("Pre-simulation failed.", sim.value.logs));
        setModalOpen(true);
        return;
      }

      // Mark as PvE mode in localStorage
      localStorage.setItem(LOCAL_STORAGE_CONF.GAME_MODE, "PvE");
      localStorage.removeItem(LOCAL_STORAGE_CONF.DEGEN_BET_AMOUNT);

      // Serialize transaction for Phantom
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
      console.error("PvE pay_entry error:", e);
      setModalError((e as Error)?.message ?? "Transaction failed. Try again.");
      setModalOpen(true);
      setIsLoadingTransaction(false);
      setSending(false);
    }
  };

  const explorerUrl = txSig
    ? `https://explorer.solana.com/tx/${txSig}?cluster=mainnet-beta`
    : "#";

  return (
    <>
      <div className="pay-entry-section">
        <div className="button-group">
          <button
            className="pay-entry-button casual-play-button"
            onClick={handlePvEPayEntry}
            disabled={disabled}
            aria-busy={sending}
            style={{ width: '100%' }}
          >
            {sending ? (
              "PROCESSING"
            ) : (
              "PLAY PvE"
            )}
          </button>
        </div>
        {solPriceUsd && (
          <p className="pay-entry-amount-display">
            Entry fee: {amountSol.toFixed(6)} SOL (~$0.10 USD)
          </p>
        )}
      </div>

      {/* Transaction Status Modal */}
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

export default PayEntryPvEButton;