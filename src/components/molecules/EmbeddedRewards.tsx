import { RewardValue } from '../atoms/leaderboard/RewardValue';
import styles from './EmbeddedRewards.module.css';

interface EmbeddedRewardsProps {
  points: number;
}

export const EmbeddedRewards: React.FC<EmbeddedRewardsProps> = ({ points }) => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>Embedded Rewards</div>
      <RewardValue value={points} currency="Points" />
    </div>
  );
};
