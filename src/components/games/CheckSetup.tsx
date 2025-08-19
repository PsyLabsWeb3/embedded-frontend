// CheckSetup.tsx
import  { useEffect, useMemo, useState } from "react";
import { PublicKey, Connection } from "@solana/web3.js";
import { AnchorProvider, Program, setProvider } from "@coral-xyz/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { Idl } from "@coral-xyz/anchor";
import idl from "../../constants/embedded.json";

const DEFAULT_PROGRAM_ID = "BUQFRUJECRCADvdtStPUgcBgnvcNZhSWbuqBraPWPKf8";

export default function CheckSetup() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const PROGRAM_ID = useMemo(
    () => new PublicKey(((idl as any)?.address ?? (idl as any)?.metadata?.address ?? DEFAULT_PROGRAM_ID) as string),
    []
  );

  const [program, setProgram] = useState<Program<Idl> | null>(null);
  const [configPda, setConfigPda] = useState<PublicKey | null>(null);
  const [cfg, setCfg] = useState<any>(null);
  const [treasuryExpected, setTreasuryExpected] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // provider “read-only” si no hay firmador
      const readOnlyWallet = wallet.publicKey
        ? {
            publicKey: wallet.publicKey,
            signTransaction: wallet.signTransaction!,
            signAllTransactions: wallet.signAllTransactions ?? (async (txs: any[]) => txs),
          }
        : {
            publicKey: PublicKey.default,
            signTransaction: async (tx: any) => tx,
            signAllTransactions: async (txs: any[]) => txs,
          };
      const provider = new AnchorProvider(connection as Connection, readOnlyWallet as any, {
        commitment: "confirmed",
      });
      setProvider(provider);
      const prog = new Program(idl as Idl, provider);
      setProgram(prog);

      console.log("[PROGRAM]:", program);

      const cfgPda = PublicKey.findProgramAddressSync([Buffer.from("config")], prog.programId)[0];
      setConfigPda(cfgPda);

      // intenta leer la cuenta config (si no existe, lanzará error)
      try {
        // @ts-ignore – acceso dinámico
        const configAccount = await (prog.account as any).config.fetch(cfgPda);
        setCfg(configAccount);

        // candidatos típicos de treasury:
        const candA = PublicKey.findProgramAddressSync([Buffer.from("treasury")], prog.programId)[0];
        const candB =
          configAccount?.authority
            ? PublicKey.findProgramAddressSync(
                [Buffer.from("treasury"), new PublicKey(configAccount.authority).toBuffer()],
                prog.programId
              )[0]
            : null;
        const candC = PublicKey.findProgramAddressSync(
          [Buffer.from("treasury"), cfgPda.toBuffer()],
          prog.programId
        )[0];

        const candidates = [candA, candB, candC].filter(Boolean) as PublicKey[];

        // busca el que exista y cuyo owner sea tu programa
        for (const c of candidates) {
          const info = await connection.getAccountInfo(c);
          if (info && info.owner.equals(prog.programId) && info.data.length > 0) {
            setTreasuryExpected(c.toBase58());
            console.log("[FOUND treasury initialized]", c.toBase58());
            return;
          }
        }

        // si no hay ninguna inicializada, igual muestra el candidato “más probable”
        // (tú viste en logs que la Right era E2NJ..., compárala aquí si quieres)
        setTreasuryExpected(candC.toBase58()); // candC suele ser común: ["treasury", configPda]
        console.warn("[treasury not initialized yet] candidate:", candC.toBase58());
      } catch (e) {
        console.warn("config fetch failed – probablemente no está inicializada:", e);
        setCfg(null);
        // cuando config no existe, la treasury TAMPOCO existirá
      }
    })();
  }, [connection, wallet.publicKey]);

  return (
    <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8, marginBottom: 12 }}>
      <div><b>Program:</b> {PROGRAM_ID.toBase58()}</div>
      <div><b>Config PDA:</b> {configPda?.toBase58() ?? "—"}</div>
      <div><b>Config exists?</b> {cfg ? "YES" : "NO"}</div>
      <div><b>Treasury expected:</b> {treasuryExpected ?? "—"}</div>
      {treasuryExpected && (
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          (Tip: compara este valor con el “Right:” de tus logs)
        </div>
      )}
    </div>
  );
}
