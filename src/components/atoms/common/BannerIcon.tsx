import React from 'react';
import bannerIconSvg from '../../../assets/banner-icon.svg';
import styles from './BannerIcon.module.css';

interface BannerIconProps {
  className?: string;
}

export const BannerIcon: React.FC<BannerIconProps> = ({ className = "" }) => {
  return (
    <div className={`${styles.iconContainer} ${className}`}>
      <img 
        src={bannerIconSvg} 
        alt="Rewards banner icon" 
        className={styles.icon}
      />
    </div>
  );
};
