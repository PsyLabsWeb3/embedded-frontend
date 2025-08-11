import styles from './WalletAddress.module.css';

interface WalletAddressProps {
  address: string;
}

const formatWalletAddress = (address: string): string => {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

export const WalletAddress: React.FC<WalletAddressProps> = ({ address }) => {
  return (
    <>
      {/* Full address on desktop/tablet */}
      <div className={`${styles.walletAddress} ${styles.desktopAddress}`}>
        {address}
      </div>
      {/* Truncated address on mobile */}
      <div className={`${styles.walletAddress} ${styles.mobileAddress}`}>
        {formatWalletAddress(address)}
      </div>
    </>
  );
};
