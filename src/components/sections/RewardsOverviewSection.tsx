import React, { useEffect, useState } from "react";
import "../../styles/theme.css";
import "../../styles/utilities.css";
import "../../styles/sections/RewardsOverviewSection.css";
import { Connection, PublicKey } from "@solana/web3.js";
import iconArrow from "../../assets/icons/trendigUpIcon.svg";
import iconCoins from "../../assets/icons/coinsIcon.svg";
import peopleIcon from "../../assets/icons/peopleIcon.svg";

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
    <section
      className="rewards-overview__section container mx-container"
      aria-labelledby="rewards-overview-heading"
    >
      <div
        className="rewards-overview__card"
        role="group"
        aria-label="Rewards overview card"
      >
        <h2 id="rewards-overview-heading" className="rewards-overview__title">
          <span>Real Rewards in </span>
          <span className="rewards-overview__title-accent">SOL</span>
        </h2>
        <p className="rewards-overview__desc">
          Play games, climb the leaderboard, and earn SOL for it. Your skills
          translate directly into rewards, airdropped at the end of each month.
        </p>

        <div
          className="rewards-overview__cards"
          role="list"
          aria-label="Rewards overview"
        >
          {/* Card 1: SOL Pool */}
          <div className="rewards-card" role="listitem">
            <div className="rewards-card__icon" aria-hidden="true">
              <img src={iconCoins} alt="SOL pool icon" />
            </div>
            <div className="rewards-card__value">{poolAmount} SOL</div>
            <div className="rewards-card__label">Total Distributed</div>
            <div className="rewards-card__sub">
              Real SOL rewards to be distributed at the end of the month
            </div>
          </div>

          {/* Card 2: Total distributed value */}
          <div className="rewards-card" role="listitem">
            <div className="rewards-card__icon" aria-hidden="true">
              <img src={iconArrow} alt="Total distributed icon" />
            </div>
            <div className="rewards-card__value">$735.52</div>
            <div className="rewards-card__label">Total Distributed</div>
            <div className="rewards-card__sub">
              Real SOL rewards paid to players so far
            </div>
          </div>

          {/* Card 3: Top players */}
          <div className="rewards-card" role="listitem">
            <div className="rewards-card__icon" aria-hidden="true">
              <img src={peopleIcon} alt="Top players icon" />
            </div>
            <div className="rewards-card__value">500</div>
            <div className="rewards-card__label">Top players</div>
            <div className="rewards-card__sub">
              Top 500 performers earn at the end of each month
            </div>
          </div>
        </div>

        {/* How Rewards Works box */}
        <div className="rewards-how">
          <h3 className="rewards-how__title">How Rewards Works</h3>
          <ul className="rewards-how__list">
            <li>
              Players pay small entry fees in SOL to join PVE and PVP to
              accumulate points.
            </li>
            <li>
              Prize pools accumulate from the entry fees and platform
              contributions.
            </li>
            <li>
              Top 500 players on monthly leaderboards receive SOL rewards.
            </li>
            <li>Instant payouts directly to your connected wallet.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RewardsOverviewSection;
