// PayEntryButton.tsx
import React, { useEffect, useMemo, useState } from "react";
import { AnchorProvider, Program, setProvider, BN } from "@coral-xyz/anchor";
import type { Idl } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "../../constants/embedded.json";

// ==== CONSTANTES (devnet) ====
const PROGRAM_ID = new PublicKey("BUQFRUJECRCADvdtStPUgcBgnvcNZhSWbuqBraPWPKf8");
const TREASURY_PDA = new PublicKey("EqderqcKvGtQKmYWuneRAb7xdgBXRNPpv21qBKF4JqdM");
// =================================

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
      } catch {}
    })();
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

  const handlePayEntry = async () => {
    if (!program || !anchorWallet?.publicKey) return;

    const lamports = new BN(Math.trunc((amountSol || 0) * LAMPORTS_PER_SOL));
    if (lamports.lte(new BN(0))) return;

    try {
      setSending(true);

      // sanity treasury
      const info = await connection.getAccountInfo(TREASURY_PDA);
      if (!info || !info.owner.equals(PROGRAM_ID) || info.data.length === 0) {
        console.warn("Treasury no inicializada en este cluster.");
        setSending(false);
        return;
      }

      // balance mínimo (aprox fee)
      const bal = await connection.getBalance(anchorWallet.publicKey, "processed");
      if (bal < lamports.toNumber() + 200_000) {
        console.warn("Saldo insuficiente.");
        setSending(false);
        return;
      }

      // Blockhash para confirmación moderna
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

      // Enviar tx
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

      // Abrimos modal con loading mientras confirmamos (o timeout)
      setModalOpen(true);
      setModalPhase("waiting");

      const CONFIRM_TIMEOUT_MS = 10_000;
      const confirmPromise = connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        "confirmed"
      );

      await Promise.race([confirmPromise, sleep(CONFIRM_TIMEOUT_MS)]);

      //Await 10 seconds more
      await sleep(10_000);

      // Listo para continuar
      setModalPhase("ready");
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

  const disabled = sending || !anchorWallet || !program;

  const explorerUrl = txSig
    ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
    : "#";

  return (
    <>
      <div style={{ display: "grid", gap: 8, maxWidth: 380 }}>
        <button
          onClick={handlePayEntry}
          disabled={disabled}
          style={{ padding: 10, cursor: disabled ? "not-allowed" : "pointer", borderRadius: 8 }}
        >
          {sending ? "Sending..." : `Casual Mode (${amountSol || 0} SOL)`}
        </button>
        <small style={{ opacity: 0.7 }}>
          Program: {PROGRAM_ID.toBase58()} • Treasury: {TREASURY_PDA.toBase58()}
        </small>
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
                <div style={{ fontSize: 12, opacity: 0.8 }}>
                  Waiting for confirmation (~10s)…
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
};

// inyecta @keyframes para el spinner
const ensureSpinnerKeyframes = () => {
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
