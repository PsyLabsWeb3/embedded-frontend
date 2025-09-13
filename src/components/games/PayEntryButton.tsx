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
import './DegenModeModal.css'; 

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

// Espera a que una firma llegue a "finalized" (WS + polling backup)
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
      (res /* SignatureResult */) => {
        // Marcar como "leído" para evitar TS6133 y mantener compatibilidad:
        void res;
        cleanup();
      },
      "finalized"
    );
  } catch {
    // fallback a polling
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

  // ===== Estados =====
  const [amountSol, setAmountSol] = useState<number>(fixedAmountSol ?? 0);
  const [sending, setSending] = useState(false);
  const [solPriceUsd, setSolPriceUsd] = useState<number | null>(null);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPhase, setModalPhase] = useState<"waiting" | "ready">("waiting");
  const [txSig, setTxSig] = useState<string | null>(null);

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
        // reuse existing payment flow and logic
        await handlePayEntry(solAmount);
      } catch (e) {
        console.error("Failed to get SOL price for degen flow", e);
        setDegenModalOpen(false);
      }
    })();
  };

  const handleDegenSelect = (val: number) => {
    setDegenSelected(val);
  };

  // Prerequisitos
  const [treasuryOk, setTreasuryOk] = useState<boolean | null>(null);

  // ===== Carga de precio o retorno de Phantom =====
  useEffect(() => {
    const last = localStorage.getItem("phantom_last_tx");
    if (last) {
      setTxSig(last);
      setModalOpen(true);
      setModalPhase("waiting");
      localStorage.removeItem("phantom_last_tx");

      let cancelled = false;
      (async () => {
        const ok = await waitForFinalized(connection, last);
        if (!cancelled && ok) setModalPhase("ready");
      })();

      return () => { /* cleanup phantom flow */ };
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

  // Verificación de treasury una vez
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

  // Mobile Phantom session / claves
  const phantomSession = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_SESSION) : null;
  const phantomEncPub = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_PHANTOM_ENC) : null;
  const dappKpRaw = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_KEYS) : null;
  const phantomWalletPubStr = typeof window !== 'undefined' ? localStorage.getItem("phantom_wallet_pubkey") : null;

  // Ruta que usaremos (desktop adapter vs mobile Phantom)
  const usingDesktop = !isMobile() || (isMobile() && !phantomSession);

  // Prerequisitos listos?
  const anchorReady = !!anchorWallet && !!program;
  const phantomReady = !!phantomSession && !!phantomEncPub && !!dappKpRaw && !!phantomWalletPubStr;
  const amountReady = amountSol > 0;
  const networkReady = treasuryOk === true;

  const prereqsReady = usingDesktop
    ? (anchorReady && amountReady && networkReady)
    : (phantomReady && amountReady && networkReady);

  // Botón deshabilitado mientras enviamos o no hay prereqs
  const disabled = sending || !prereqsReady;

  // now accepts optional overrideSol (useful for degen flow where amountSol may not be the current state)
  const handlePayEntry = async (overrideSol?: number) => {
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

      // Desktop / adapter flow
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
        setTxSig(sig);
        setModalOpen(true);
        setModalPhase("waiting");

        const ok = await waitForFinalized(connection, sig);
        if (ok) setModalPhase("ready");
        setSending(false);
        return;
      }

      // ===== Mobile Phantom deep-link flow =====
      if (!phantomSession || !phantomEncPub || !dappKpRaw || !phantomWalletPubStr) {
        console.warn("Missing Phantom mobile prerequisites");
        setSending(false);
        return;
      }

      // Program temporal sin signer (solo pubkey)
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

      // Serialize
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

  // Removed unused buttonLabel variable

 return (
  <>
    <div className="pay-entry-section">
      <div className="button-group">
        <button
          className="pay-entry-button degen-mode-button"
          onClick={handleDegenOpen}
          disabled={sending}
        >
          DEGEN MODE
        </button>
        <button
          onClick={() => void handlePayEntry()}
          disabled={disabled}
          className="pay-entry-button casual-play-button"
        >
          {sending ? "PROCESSING" : "CASUAL PLAY"}
        </button>
      </div>
    </div>

    {/* Degen Mode Modal */}
    {degenModalOpen && (
      <div className="degen-modal-backdrop">
        <div className="degen-modal">
          <h3 className="degen-modal-title">Degen Mode Entry</h3>
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
          <div className="degen-modal-actions">
            <button
              onClick={handleDegenCancel}
              className="degen-cancel-button"
            >
              Cancel
            </button>
            <button
              onClick={handleDegenContinue}
              className="degen-continue-button"
              disabled={degenSelected === null}
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
