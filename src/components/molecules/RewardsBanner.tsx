import React from 'react';
import { BannerIcon } from '../atoms/common/BannerIcon';
import { BannerText } from '../atoms/common/BannerText';
import styles from './RewardsBanner.module.css';

interface RewardsBannerProps {
  mainMessage: string;
  subMessage: string;
  daysLeft: string;
}

export const RewardsBanner: React.FC<RewardsBannerProps> = ({
  mainMessage,
  subMessage,
  daysLeft
}) => {
  return (
    <div className={styles.banner} role="banner" aria-label="Rewards information">
      <div className={styles.content}>
        <BannerIcon />
        <div className={styles.textSection}>
          <BannerText variant="primary">
            {mainMessage}
          </BannerText>
          <div className={styles.subSection}>
            <BannerText variant="secondary">
              {subMessage}
            </BannerText>
            <BannerText variant="highlight">
              {daysLeft}
            </BannerText>
          </div>
        </div>
      </div>
    </div>
  );
};
