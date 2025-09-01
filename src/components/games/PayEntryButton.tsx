import React, { useEffect, useMemo, useState } from "react";
import { AnchorProvider, Program, setProvider, BN } from "@coral-xyz/anchor";
import type { Idl } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import bs58 from "bs58";
import { encryptPayloadForPhantom } from "../../utils/phantomCrypto";
import idl from "../../constants/embedded.json";
import { LOCAL_STORAGE_CONF } from '../../constants';

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
      (res) => { cleanup(); },
      "finalized"
    );
  } catch { /* fallback a polling */ }

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

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPhase, setModalPhase] = useState<"waiting" | "ready">("waiting");
  const [txSig, setTxSig] = useState<string | null>(null);

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

    (async () => {
      try {
        const r = await fetch("https://backend.embedded.games/api/solanaPriceUSD");
        const data = await r.json();
        const price = Number(data?.priceUsd);
        if (!price || !isFinite(price) || price <= 0) return;
        const usd = 0.5;
        setAmountSol(Number((usd / price).toFixed(8)));
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
  const mobileCanSign = isMobile() && !!phantomSession;

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

  // ====== Pagar entrada ======
  const handlePayEntry = async () => {
    if (!prereqsReady) return;

    try {
      setSending(true);

      const lamports = new BN(Math.trunc((amountSol || 0) * LAMPORTS_PER_SOL));
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

  const buttonLabel = sending
    ? "Sending..."
    : (!prereqsReady ? "Preparing…" : `Casual Mode (${amountSol || 0} SOL)`);

  return (
    <>
      <div style={{ display: "grid", gap: 8, maxWidth: 380 }}>
        <button
          onClick={handlePayEntry}
          disabled={disabled}
          style={{
            padding: 10,
            cursor: disabled ? "not-allowed" : "pointer",
            borderRadius: 8,
            opacity: disabled ? 0.8 : 1,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            justifyContent: "center",
            minHeight: 40,
          }}
        >
          {(sending || !prereqsReady) && <span style={styles.spinnerInline} aria-hidden />}
          <span>{buttonLabel}</span>
        </button>

        {/* (Opcional) mensajes de estado de prereqs para debug rápido */}
        {/* <div style={{fontSize:12,opacity:.7}}>
          amountReady:{String(amountReady)} • treasuryOk:{String(treasuryOk)} •
          {usingDesktop ? ` anchorReady:${String(anchorReady)}` : ` phantomReady:${String(phantomReady)}`}
        </div> */}
      </div>

      {/* Modal de confirmación */}
      {modalOpen && (
        <div style={styles.backdrop}>
          <div style={styles.modal}>
            <h3 style={{ margin: 0 }}>Transaction Sent</h3>
            <p style={{ marginTop: 6, marginBottom: 10, wordBreak: "break-all" }}>
              Tx: {txSig ? (
                <a href={explorerUrl} target="_blank" rel="noreferrer">
                  {txSig}
                </a>
              ) : "—"}
            </p>

            {modalPhase === "waiting" ? (
              <div style={{ display: "grid", gap: 10, placeItems: "center" }}>
                <div style={styles.spinner} />
                <div style={{ fontSize: 12, opacity: 0.85, textAlign: "center" }}>
                  Waiting for <b>finalization</b> on Solana…
                  <br />
                  You can watch the status in the Explorer link above.
                </div>
              </div>
            ) : (
              <button onClick={handleContinue} style={{ padding: 10, borderRadius: 8 }}>
                Continue
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// estilos inline simples
const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "grid",
    placeItems: "center",
    zIndex: 9999,
  },
  modal: {
    width: "min(92vw, 520px)",
    background: "#111",
    color: "#fff",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    border: "1px solid #333",
  },
  spinner: {
    width: 28,
    height: 28,
    border: "3px solid #444",
    borderTop: "3px solid #fff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  spinnerInline: {
    width: 16,
    height: 16,
    border: "2px solid rgba(255,255,255,.35)",
    borderTop: "2px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
};

// inyecta @keyframes para el spinner
const ensureSpinnerKeyframes = () => {
  if (typeof document === "undefined") return;
  const id = "payentry-spinner";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.innerHTML = `
    @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
  `;
  document.head.appendChild(style);
};
ensureSpinnerKeyframes();

export default PayEntryButton;
