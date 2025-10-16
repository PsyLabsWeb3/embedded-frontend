import { useEffect, useState } from "react";
import "../../styles/sections/PoolRewardsBanner.css";
import solanaIcon from "../../assets/solanaicon.png";

// Solana web3.js imports
import { Connection, PublicKey } from "@solana/web3.js";

const POOL_ADDRESS = "EqderqcKvGtQKmYWuneRAb7xdgBXRNPpv21qBKF4JqdM";

const RPC = import.meta.env.VITE_SOLANA_RPC;

function formatSol(amount: number) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const PoolRewardsBanner = () => {
  const [poolAmount, setPoolAmount] = useState<string>("-");

  useEffect(() => {
    async function fetchPoolAmount() {
      try {
        const connection = new Connection(RPC);
        const pubkey = new PublicKey(POOL_ADDRESS);
        const lamports = await connection.getBalance(pubkey);
        const sol = lamports / 1e9;
        const pool = sol * 0.2;
        setPoolAmount(formatSol(pool));
      } catch (e) {
        setPoolAmount("-");
      }
    }
    fetchPoolAmount();
  }, []);

  return (
    <section className="pool-rewards-section section container mx-container">
      <div className="pool-rewards-banner">
        <div className="rewards-section__icon-wrapper">
          <img
            src={solanaIcon}
            alt="Solana Logo"
            className="rewards-section__icon"
          />
        </div>
        <div className="rewards-section__content">
          <span className="rewards-section__amount">{poolAmount} $SOL</span>
          <span className="rewards-section__label">REWARDS TO DISTRIBUTE</span>
        </div>
      </div>
    </section>
  );
};

export default PoolRewardsBanner;
