import { IconText } from '../atoms/leaderboard/IconText';
import { RewardValue } from '../atoms/leaderboard/RewardValue';
import styles from './EmbeddedRewards.module.css';

interface EmbeddedRewardsProps {
  points: number;
}

export const EmbeddedRewards: React.FC<EmbeddedRewardsProps> = ({ points }) => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>Embedded Rewards</div>
      <RewardValue value={points} currency="$SOL" />
      <div className={styles.statsContainer}>
        <IconText icon="🎯" value="12,780" />
        <IconText icon="🎵" value="5,780" />
      </div>
    </div>
  );
};
