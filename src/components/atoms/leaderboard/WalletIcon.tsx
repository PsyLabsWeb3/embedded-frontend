import userIconSvg from '../../../assets/user-icon.svg';
import styles from './WalletIcon.module.css';

interface WalletIconProps {
  className?: string;
}

export const WalletIcon: React.FC<WalletIconProps> = ({ className = "" }) => {
  return (
    <div className={`${styles.walletIcon} ${className}`}>
      <img 
        src={userIconSvg} 
        alt="User icon" 
        className={styles.iconSvg}
      />
    </div>
  );
};
