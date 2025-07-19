import { PositionNumber } from '../atoms/leaderboard/PositionNumber';
import { WalletIcon } from '../atoms/leaderboard/WalletIcon';
import { WalletAddress } from '../atoms/leaderboard/WalletAddress';
import { EmbeddedRewards } from '../molecules/EmbeddedRewards';
import type { LeaderboardItem } from '../../types/leaderboard';
import styles from './LeaderboardCard.module.css';

interface LeaderboardCardProps {
  item: LeaderboardItem;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ item }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.leftSection}>
          <PositionNumber position={item.position} />
          <div className={styles.walletSection}>
            <WalletIcon />
            <WalletAddress address={item.walletAddress} />
          </div>
        </div>
        
        <div className={styles.rightSection}>
          <EmbeddedRewards points={item.points} />
        </div>
      </div>
    </div>
  );
};
