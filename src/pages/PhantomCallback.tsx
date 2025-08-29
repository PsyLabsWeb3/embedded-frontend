import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { decryptPhantomData } from "../utils/phantomCrypto";
import { LOCAL_STORAGE_CONF } from '../constants';

const PhantomCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const handledRaw = localStorage.getItem(LOCAL_STORAGE_CONF.HANDLED_KEY);
      if (handledRaw) {
        try {
          const ts = Number(handledRaw);
          if (!Number.isNaN(ts) && Date.now() - ts < LOCAL_STORAGE_CONF.HANDLED_TTL_MS) {
            console.log("Phantom callback: already handled recently — skipping");
            return;
          }
        } catch {}
      }
      localStorage.setItem(LOCAL_STORAGE_CONF.HANDLED_KEY, String(Date.now()));

      try {
        const params = new URLSearchParams(window.location.search);
        const stateParam = params.get("state");
        const state = stateParam || "/";

        console.log("Phantom callback state:", state);

        const errorCode = params.get("errorCode");
        const errorMessage = params.get("errorMessage");

        if (errorCode || errorMessage) {
          console.error("Phantom returned error:", errorCode, errorMessage);
          localStorage.removeItem(LOCAL_STORAGE_CONF.LOCAL_REDIRECT);
          window.location.replace(window.location.origin + state);
          return;
        }

        const data = params.get("data");
        const nonce = params.get("nonce");
        const phantomEncPub = params.get("phantom_encryption_public_key");

        if (!data || !nonce || !phantomEncPub) {
          console.warn("Missing phantom response fields — falling back to saved redirect");
          localStorage.removeItem(LOCAL_STORAGE_CONF.LOCAL_REDIRECT);
          window.location.replace(window.location.origin + state);
          return;
        }

        const stored = localStorage.getItem(LOCAL_STORAGE_CONF.LOCAL_KEYS);
        if (!stored) throw new Error("Missing local dapp keypair. Cannot decrypt Phantom response.");

        const { secretKeyBase58 } = JSON.parse(stored);

        const decrypted = decryptPhantomData(
          data,
          nonce,
          phantomEncPub,
          secretKeyBase58
        );

        console.log("Phantom decrypted payload:", decrypted);

        // Save session + wallet pubkey
        if (decrypted.session) {
          localStorage.setItem(LOCAL_STORAGE_CONF.LOCAL_SESSION, decrypted.session);
        }
        if (decrypted.public_key) {
          localStorage.setItem(LOCAL_STORAGE_CONF.LOCAL_WALLET_PUBKEY, decrypted.public_key);
        }

        // Save phantom encryption public key to encrypt payloads for signing later
        if (phantomEncPub) {
          localStorage.setItem(LOCAL_STORAGE_CONF.LOCAL_PHANTOM_ENC, phantomEncPub);
        }

        localStorage.removeItem(LOCAL_STORAGE_CONF.LOCAL_REDIRECT);
        setTimeout(() => localStorage.removeItem(LOCAL_STORAGE_CONF.HANDLED_KEY), 2000);

        window.location.replace(window.location.origin + state);
      } catch (err) {
        console.error("Failed to handle Phantom callback:", err);
        localStorage.removeItem(LOCAL_STORAGE_CONF.LOCAL_REDIRECT);
        setTimeout(() => localStorage.removeItem(LOCAL_STORAGE_CONF.HANDLED_KEY), 2000);
        window.location.replace(window.location.origin);
      }
    })();
  }, [navigate]);

  return (
    <div style={{ padding: 16 }}>
      <p>Processing Phantom connection…</p>
    </div>
  );
};

export default PhantomCallback;