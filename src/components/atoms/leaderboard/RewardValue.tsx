import styles from './RewardValue.module.css';

interface RewardValueProps {
  value: number;
  currency?: string;
}

export const RewardValue: React.FC<RewardValueProps> = ({ 
  value, 
  currency = "$SOL" 
}) => {
  return (
    <div className={styles.rewardValue}>
      {value.toFixed(2)} {currency}
    </div>
  );
};
