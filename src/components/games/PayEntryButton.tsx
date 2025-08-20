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

  useEffect(() => {
    if (typeof fixedAmountSol === "number") return;
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

  const provider = useMemo(() => {
    if (!anchorWallet) return null;
    const p = new AnchorProvider(connection, anchorWallet, { commitment: "confirmed" });
    setProvider(p);
    return p;
  }, [connection, anchorWallet]);

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

      const bal = await connection.getBalance(anchorWallet.publicKey, "processed");
      if (bal < lamports.toNumber() + 200_000) {
        console.warn("Saldo insuficiente.");
        setSending(false);
        return;
      }

      // 🔸 Obtén un blockhash reciente para confirmación moderna
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

      const sig = await program.methods
        .payEntry(lamports)
        .accounts({
          treasury: TREASURY_PDA,
          payer: anchorWallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc({ commitment: "confirmed" });

      onSent?.(sig);

      // 🛎️ Mostrar tx y luego ESPERAR confirmación (máx 10s)
      alert(`✅ Transacción enviada:\n${sig}\n\nEsperando confirmación (~10s)…`);

      const CONFIRM_TIMEOUT_MS = 10_000;
      // confirmación moderna con estrategia (blockhash + lastValidBlockHeight)
      const confirmPromise = connection.confirmTransaction(
        { signature: sig, blockhash, lastValidBlockHeight },
        "confirmed"
      );
      await Promise.race([confirmPromise, sleep(CONFIRM_TIMEOUT_MS)]);

      onContinue?.(sig);
    } catch (e) {
      console.error("pay_entry error:", e);
    } finally {
      setSending(false);
    }
  };

  const disabled = sending || !anchorWallet || !program;

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 380 }}>
      <button
        onClick={handlePayEntry}
        disabled={disabled}
        style={{ padding: 10, cursor: disabled ? "not-allowed" : "pointer", borderRadius: 8 }}
      >
        {sending ? "Enviando..." : `Casual Mode (${amountSol || 0} SOL)`}
      </button>
      <small style={{ opacity: 0.7 }}>
        Program: {PROGRAM_ID.toBase58()} • Treasury: {TREASURY_PDA.toBase58()}
      </small>
    </div>
  );
};

export default PayEntryButton;
