import React, { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { decryptPhantomData } from "../utils/phantomCrypto";
import { LOCAL_STORAGE_CONF } from "../constants";
import bs58 from "bs58";

const PhantomSignCallback: React.FC = () => {
  const { connection } = useConnection();
  const navigate = useNavigate();
  const [debug, setDebug] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const state = params.get("state") || localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_REDIRECT) || "/";
        const errorCode = params.get("errorCode");
        const errorMessage = params.get("errorMessage");
        if (errorCode || errorMessage) {
          console.error("Phantom sign returned error:", errorCode, errorMessage);
          localStorage.removeItem(LOCAL_STORAGE_CONF.LOCAL_REDIRECT);
          window.location.replace(window.location.origin + state);
          return;
        }

        const data = params.get("data");
        const nonce = params.get("nonce");
        const phantomEncPub =
            params.get("phantom_encryption_public_key") ||
            localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_PHANTOM_ENC);

        if (!data || !nonce || !phantomEncPub) {
          console.warn("Missing data/nonce/phantom_encryption_public_key in sign callback.");
          localStorage.removeItem(LOCAL_STORAGE_CONF.LOCAL_REDIRECT);
          window.location.replace(window.location.origin + state);
          return;
        }

        const stored = localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_KEYS);
        if (!stored) {
          throw new Error("Missing dapp keypair in localStorage (phantom_dapp_keypair)");
        }
        const { secretKeyBase58 } = JSON.parse(stored);

        const decrypted = decryptPhantomData(data, nonce, phantomEncPub, secretKeyBase58);
        setDebug(decrypted);
        console.log("Phantom sign decrypted payload:", decrypted);

        if (decrypted.signedTransaction) {
          const signed = bs58.decode(decrypted.signedTransaction);
          const sig = await connection.sendRawTransaction(signed);
          await connection.confirmTransaction(sig, "confirmed");
          localStorage.setItem(LOCAL_STORAGE_CONF.PHANTOM_LAST_TRANSACTION, sig);
        } else if (decrypted.transaction) {
          try {
            const signed = bs58.decode(decrypted.transaction);
            const sig = await connection.sendRawTransaction(signed);
            await connection.confirmTransaction(sig, "confirmed");
            localStorage.setItem(LOCAL_STORAGE_CONF.PHANTOM_LAST_TRANSACTION, sig);
          } catch (err) {
            console.warn("Failed to treat decrypted.transaction as raw signed tx bytes:", err);
            // fallback - if it's a signature string
            if (typeof decrypted.transaction === "string") {
              const maybeSig = decrypted.transaction;
              await connection.confirmTransaction(maybeSig, "confirmed");
              localStorage.setItem(LOCAL_STORAGE_CONF.PHANTOM_LAST_TRANSACTION, maybeSig);
            }
          }
        } else if (decrypted.signature) {
          const sig = decrypted.signature;
          await connection.confirmTransaction(sig, "confirmed");
          localStorage.setItem(LOCAL_STORAGE_CONF.PHANTOM_LAST_TRANSACTION, sig);
        } else {
          throw new Error("Decrypted payload did not contain signedTransaction/transaction/signature");
        }

        localStorage.removeItem(LOCAL_STORAGE_CONF.LOCAL_REDIRECT);
        window.location.replace(window.location.origin + state);
      } catch (err) {
        console.error("Error processing Phantom sign callback:", err);
        const fallback = localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_REDIRECT) || "/";
        localStorage.removeItem(LOCAL_STORAGE_CONF.LOCAL_REDIRECT);
        window.location.replace(window.location.origin + fallback);
      }
    })();
  }, [connection, navigate]);

  return (
    <div style={{ padding: 16 }}>
      <p>Processing Phantom signed transaction…</p>
      {debug && (
        <>
          <h4>Decrypted payload (debug)</h4>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>{JSON.stringify(debug, null, 2)}</pre>
        </>
      )}
    </div>
  );
};

export default PhantomSignCallback;