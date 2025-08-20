import React, { useEffect, useMemo, useState } from "react";
import { AnchorProvider, Program, setProvider, BN } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js";
import type { Idl } from "@coral-xyz/anchor";
import idl from "../../constants/embedded.json";

// Define AnchorWallet
type AnchorWallet = {
  publicKey: PublicKey;
  signTransaction: (tx: any) => Promise<any>;
  signAllTransactions: (txs: any[]) => Promise<any[]>;
};

type Props = {
  defaultAmountSol?: number;
  onSent?: (sig: string) => void;
  // Si ya sabes la treasury (p.ej., la "Right:" del log), pásala aquí
  treasuryOverride?: string;
};

const DEFAULT_PROGRAM_ID = "BUQFRUJECRCADvdtStPUgcBgnvcNZhSWbuqBraPWPKf8";

const TREASURY = "E2NJcSfbwwrH4f2j5mEYfAKbPYR3kera5mKT5JZQpVx5";

const PayEntryButton: React.FC<Props> = ({ defaultAmountSol, onSent, treasuryOverride }) => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [amountSol, setAmountSol] = useState(0);
  const [sending, setSending] = useState(false);
  const [treasury, setTreasury] = useState<PublicKey | null>(null);
  const [resolving, setResolving] = useState(false);



  // ProgramId (IDL o fallback)
  const PROGRAM_ID = useMemo(
    () => new PublicKey(((idl as any)?.address ?? (idl as any)?.metadata?.address ?? DEFAULT_PROGRAM_ID) as string),
    []
  );


  useEffect(() => {
    const checkTreasury = async () => {
      try {
        const info = await connection.getAccountInfo(new PublicKey(TREASURY));
        console.log("treasury info:", info);
      } catch (err) {
        console.error("Error al obtener treasury:", err);
      }
    };
    checkTreasury();
  }, [connection]);

  //TO-DO: Implement fetch SOL price and calculate setAmount
// ...existing code...
  //TO-DO: Implement fetch SOL price and calculate setAmount
  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch("https://backend.embedded.games/api/solanaPriceUSD");
        const data = await response.json();
        const solPrice = data?.priceUsd;
        if (!solPrice || isNaN(solPrice)|| solPrice <= 0) {
          throw new Error("SOL price not found in response");
        }
        console.log("SOL price:", solPrice);

        // Queremos calcular cuántos SOL equivalen a 0.5 USD
        const amountInUsd = 0.5;
        const amountInSol = parseFloat((amountInUsd / solPrice).toFixed(8)); // precisión adecuada
        setAmountSol(amountInSol);

        // Loggear el valor calculado directamente (no dependa del state inmediatamente)
        console.log("Amount in SOL (calculated):", amountInSol, "Default:", defaultAmountSol);
      } catch (error) {
        console.error("Error fetching SOL price:", error);
      }
    };
    fetchSolPrice();
  }, [defaultAmountSol, connection]);


  // Adapter -> AnchorWallet compatible
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

  // Program (toma address del IDL)
  const program = useMemo(() => {
    if (!provider) return null;
    return new Program(idl as Idl, provider);
  }, [provider]);

  // Deriva config PDA (muchos diseños lo usan para derivar otras PDAs)
  const configPda = useMemo(
    () => PublicKey.findProgramAddressSync([Buffer.from("config")], PROGRAM_ID)[0],
    [PROGRAM_ID]
  );

  // Deriva la treasury con el mismo programId del cliente Anchor
// const treasuryPda = useMemo(() => {
//   if (!program) return null;
//   const [pda] = PublicKey.findProgramAddressSync(
//     [Buffer.from("treasury")],
//     program.programId
//   );
//   console.log("treasuryPda (correcta):", pda.toBase58()); // debería imprimir Eqder...
//   return pda;
// }, [program]);

  const treasuryPda = "EqderqcKvGtQKmYWuneRAb7xdgBXRNPpv21qBKF4JqdM";

  // === Resolución dinámica de TREASURY ===
  // useEffect(() => {
  //   if (!program) return;
  //   (async () => {
  //     try {
  //       setResolving(true);

  //       // 0) Si te pasaron un override, úsalo directo
  //       if (treasuryOverride) {
  //         const key = new PublicKey(treasuryOverride);
  //         setTreasury(key);
  //         console.log("[treasury] override =", key.toBase58());
  //         return;
  //       }

  //       // 1) Candidato A: ["treasury"]
  //       const candA = PublicKey.findProgramAddressSync([Buffer.from("treasury")], program.programId)[0];

  //       // 2) Intenta leer config para obtener authority (si existe)
  //       let authorityFromConfig: PublicKey | null = null;
  //       try {
  //         // Si el IDL define la cuenta "config", Anchor puede decodificarla:
  //         // @ts-ignore
  //         const cfg = await (program.account as any).config.fetch(configPda);
  //         if (cfg?.authority) {
  //           authorityFromConfig = new PublicKey(cfg.authority);
  //         }
  //       } catch (_) {
  //         // si falla, solo seguimos con candidates sin authority
  //       }

  //       // 2) Candidato B: ["treasury", authority] (si logramos leer authority)
  //       const candB =
  //         authorityFromConfig &&
  //         PublicKey.findProgramAddressSync([Buffer.from("treasury"), authorityFromConfig.toBuffer()], program.programId)[0];

  //       // 3) Candidato C: ["treasury", configPda]
  //       const candC = PublicKey.findProgramAddressSync(
  //         [Buffer.from("treasury"), configPda.toBuffer()],
  //         program.programId
  //       )[0];

  //       const candidates = [candA, candB, candC].filter(Boolean) as PublicKey[];

  //       // Elige el que EXISTA on-chain
  //       for (const c of candidates) {
  //         const acc = await connection.getAccountInfo(c);
  //         if (acc && acc.owner.equals(program.programId)) {
  //           setTreasury(c);
  //           console.log("[treasury] resolved =", c.toBase58(), "(owner ok)");
  //           return;
  //         }
  //       }

  //       // Si ninguno existe con owner = program, como fallback toma candA
  //       // (pero te aviso que puede no pasar el constraint)
  //       setTreasury(candA);
  //       console.warn(
  //         "[treasury] WARNING: no existing account found; using simple derivation:",
  //         candA.toBase58()
  //       );
  //     } finally {
  //       setResolving(false);
  //     }
  //   })();
  // }, [program, connection, configPda, treasuryOverride]);

  const handlePayEntry = async () => {
    if (!program || !anchorWallet?.publicKey) {
      alert("Connect a compatible signing wallet to continue.");
      return;
    }
    // if (!treasury) {
    //   alert("Resolving treasury… please try again shortly.");
    //   return;
    // }

    const amountLamports = new BN(Math.trunc(amountSol * LAMPORTS_PER_SOL));
    if (amountLamports.lte(new BN(0))) {
      alert("Enter an amount greater than 0.");
      return;
    }

    try {
      setSending(true);

      // (Opcional) balance check
      const bal = await connection.getBalance(anchorWallet.publicKey);
      if (bal < amountLamports.toNumber() + 200_000) {
        alert("Insufficient balance to cover entry and fees.");
        setSending(false);
        return;
      }

      const sig = await program.methods
        .payEntry(amountLamports)
        .accounts({
          treasury: treasuryPda!,
          payer: anchorWallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc({ commitment: "confirmed" });

      onSent?.(sig);

      console.log("✅ Tx:", sig);
      //TODO: Implement MODAL Await 5 seconds
      alert(`✅ Transaction Sent: ${sig}`);
    } catch (e: any) {
      console.error("❌ pay_entry error:", e);
      const logs =
        e?.logs ??
        e?.error?.logs ??
        e?.props?.logs ??
        e?.transactionMessage ??
        null;
      if (logs) {
        console.group("Anchor logs");
        console.log(logs);
        console.groupEnd();
      }
      alert(`❌ Transaction Error.`);
    } finally {
      setSending(false);
    }
  };

  const disabled = sending || !anchorWallet || !program || resolving;
  // const programIdDisplay = PROGRAM_ID.toBase58();

  return (
    <div style={{ display: "grid", gap: 8, maxWidth: 380 }}>
      {/* <div style={{ fontSize: 12, opacity: 0.8 }}>
        Programa: {programIdDisplay}
        <br />
        Treasury: {treasury ? treasury.toBase58() : resolving ? "resolviendo..." : "—"}
      </div> */}

      {/* <label style={{ display: "grid", gap: 6 }}>
        Monto (SOL):
        <input
          type="number"
          step="0.0001"
          min="0"
          value={amountSol}
          onChange={(e) => setAmountSol(Number(e.target.value))}
          style={{ width: "100%", padding: 8 }}
        />
      </label> */}

      <button
        onClick={handlePayEntry}
        disabled={disabled}
        style={{ padding: 10, cursor: disabled ? "not-allowed" : "pointer", borderRadius: 8 }}
      >
        {sending ? "Sending..." : "Casual Mode"}
      </button>
    </div>
  );
};

export default PayEntryButton;
