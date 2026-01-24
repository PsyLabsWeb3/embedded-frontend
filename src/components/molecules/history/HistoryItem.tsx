import React from "react";
import styles from "./HistoryItem.module.css";

interface HistoryItemProps {
  opponent: string;
  result: "WIN" | "LOSS" | string;
  dateText?: string;
  mode?: string | null;
  amount?: string | number | null;
  game?: string | null;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({
  opponent,
  result,
  dateText,
  mode,
  amount,
  game,
}) => {
  const upperResult = String(result).toUpperCase();
  const isWin = upperResult === "WIN";
  const isLoss = upperResult === "LOSS";
  const isPvE = mode?.toLowerCase() === "pve";

  // Format amount text differently for PvE vs PvP
  const getAmountText = () => {
    if (amount === null || amount === undefined || amount === "")
      return undefined;
    if (isPvE) {
      // For PvE, show integer (remove decimals)
      const numAmount = parseFloat(String(amount));
      return String(Math.floor(numAmount));
    }
    // For PvP, show as-is
    return String(amount);
  };

  const amountText = getAmountText();

  // Format mode text to match Figma design
  const getModeText = (mode: string | null | undefined): string => {
    if (!mode) return "Match";
    const lowerMode = mode.toLowerCase();
    if (lowerMode === "casual") return "Casual Match";
    if (lowerMode === "pve") return "PVE Match";
    if (lowerMode === "degen") return "Degen Match";
    return `${mode} Match`;
  };

  // Format date to short format like "Dec 19"
  const formatShortDate = (dateText: string | undefined): string => {
    if (!dateText) return "";
    const parsed = new Date(dateText);
    if (isNaN(parsed.getTime())) return dateText;
    const month = parsed.toLocaleString("en-US", { month: "short" });
    const day = parsed.getDate();
    return `${month} ${day}`;
  };

  return (
    <div className={styles.item} role="listitem">
      {/* Header Row: Match Type | Date | Result */}
      <div className={styles.headerRow}>
        <span className={styles.matchType}>{getModeText(mode)}</span>
        <span className={styles.matchDate}>{formatShortDate(dateText)}</span>
        <span
          className={`${styles.matchResult} ${isWin ? styles.resultWin : styles.resultLoss}`}
        >
          {isWin ? "Win" : "Loss"}
        </span>
      </div>

      {/* Content Row: Game Name | vs: Opponent | Amount */}
      <div className={styles.contentRow}>
        <span className={styles.gameName}>{game || "Unknown Game"}</span>
        <span className={styles.opponent}>vs: {opponent}</span>
        <div className={styles.amountWrapper}>
          {isWin && amountText && (
            <img
              src="/trophy_icon.svg"
              alt=""
              className={styles.trophyIcon}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
          {amountText && (
            <span
              className={`${styles.amount} ${isLoss ? styles.amountLoss : ""}`}
            >
              {amountText}
              {isPvE && !isLoss ? "" : "USD"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
