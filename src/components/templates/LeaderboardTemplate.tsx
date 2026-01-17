import React from "react";
import { LeaderboardList } from "../organisms/LeaderboardList";
import type { LeaderboardItem } from "../../types/leaderboard";
import styles from "./LeaderboardTemplate.module.css";

interface LeaderboardTemplateProps {
  data: LeaderboardItem[];
  isLoading: boolean;
  error: string | null;
  title?: string;
}

export const LeaderboardTemplate: React.FC<LeaderboardTemplateProps> = ({
  data,
  isLoading,
  error,
  title = "Leaderboard",
}) => {
  return (
    <div className={styles.leaderboardContainer}>
      <div className={styles.leaderboardList}>
        {title && <h1>{title}</h1>}

        {/* Table Header */}
        <div className={styles.tableHeader}>
          <span className={styles.headerRank}>RANK</span>
          <span className={styles.headerPlayer}>PLAYER</span>
          <span className={styles.headerScore}>SCORE</span>
        </div>

        {isLoading && (
          <div className={styles.loadingState}>Loading leaderboard...</div>
        )}

        {error && <div className={styles.errorState}>Error: {error}</div>}

        {!isLoading && !error && (
          <LeaderboardList data={data} isLoading={isLoading} error={error} />
        )}
      </div>
    </div>
  );
};
