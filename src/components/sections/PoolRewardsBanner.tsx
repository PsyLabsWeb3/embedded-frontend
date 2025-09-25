import { useEffect, useState } from "react";
import "../../styles/sections/PoolRewardsBanner.css";

// Solana web3.js imports
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

const POOL_ADDRESS = "EqderqcKvGtQKmYWuneRAb7xdgBXRNPpv21qBKF4JqdM";
const CLUSTER = "devnet";

function formatSol(amount: number) {
  return amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const PoolRewardsBanner = () => {
  const [poolAmount, setPoolAmount] = useState<string>("-");

  useEffect(() => {
    async function fetchPoolAmount() {
      try {
        const connection = new Connection(clusterApiUrl(CLUSTER));
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
        <div className="pool-rewards-content">
          <span className="pool-rewards-amount">{poolAmount} $SOL</span>
          <span className="pool-rewards-label">AVAILABLE POOL REWARDS</span>
        </div>
      </div>
    </section>
  );
};

export default PoolRewardsBanner;
