import styles from './RewardValue.module.css';

interface RewardValueProps {
  value: number;
  currency?: string;
}

export const RewardValue: React.FC<RewardValueProps> = ({ 
  value, 
  currency = "points" 
}) => {
  return (
    <div className={styles.rewardValue}>
      {Math.floor(value)} {currency}
    </div>
  );
};
