import React, { useEffect, useState } from 'react';
import '../../styles/theme.css';
import '../../styles/utilities.css';
import '../../styles/sections/RewardsOverviewSection.css';
import { Connection, PublicKey } from '@solana/web3.js';

const POOL_ADDRESS = "EqderqcKvGtQKmYWuneRAb7xdgBXRNPpv21qBKF4JqdM";
const RPC = import.meta.env.VITE_SOLANA_RPC;

function formatSol(amount: number) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const RewardsOverviewSection: React.FC = () => {
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
    <section className="rewards-overview section container mx-container" aria-labelledby="rewards-overview-heading">
      <h2 id="rewards-overview-heading" className="rewards-overview__title gradient-title">Real Rewards in SOL</h2>
      <p className="rewards-overview__desc">Play games, climb the leaderboard, and earn SOL for it. Your skills translate directly into rewards, airdropped at the end of each month.</p>
      <div className="rewards-overview__cards">
        <div className="rewards-card">
          <div className="rewards-card__icon" aria-hidden="true"></div>
          <div className="rewards-card__value">SOL Pool</div>
          <div className="rewards-card__detail">{poolAmount} $SOL</div>
          <div className="rewards-card__sub">Real SOL rewards to be distributed at the end of the month</div>
        </div>
        <div className="rewards-card">
          <div className="rewards-card__icon" aria-hidden="true"></div>
          <div className="rewards-card__value">$735.52</div>
          <div className="rewards-card__sub">Real SOL rewards paid to players so far</div>
        </div>
        <div className="rewards-card">
          <div className="rewards-card__icon" aria-hidden="true"></div>
          <div className="rewards-card__value">500</div>
          <div className="rewards-card__sub">Top players</div>
          <div className="rewards-card__sub">Top 500 performers earn at the end of each month</div>
        </div>
      </div>
    </section>
  );
};

export default RewardsOverviewSection;
