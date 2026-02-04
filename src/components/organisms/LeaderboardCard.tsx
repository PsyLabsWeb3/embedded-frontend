import { PositionNumber } from "../atoms/leaderboard/PositionNumber";
import { WalletAddress } from "../atoms/leaderboard/WalletAddress";
import type { LeaderboardItem } from "../../types/leaderboard";
import styles from "./LeaderboardCard.module.css";

interface LeaderboardCardProps {
  item: LeaderboardItem;
  isEven?: boolean;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  item,
  isEven = false,
}) => {
  return (
    <div className={`${styles.row} ${isEven ? styles.rowEven : ""}`}>
      <div className={styles.rankCell}>
        <PositionNumber position={item.position} />
      </div>
      <div className={styles.playerCell}>
        <WalletAddress address={item.walletAddress} />
      </div>
      <div className={styles.scoreCell}>{item.points}</div>
    </div>
  );
};
