import React from 'react';
import styles from './UserStatsSection.module.css';
import StatCard from '../../molecules/history/StatCard';

interface UserStatsSectionProps {
  points: number;
  wins: number;
  losses: number;
}

const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n);

export const UserStatsSection: React.FC<UserStatsSectionProps> = ({ points, wins, losses }) => {
  return (
    <section aria-label="User stats">
      <h2 className={styles.title}>User stats</h2>
      <div className={styles.wrapper}>
        <div className={styles.grid}>
          <StatCard label="Points" value={formatNumber(points)} variant="primary" />
          <StatCard label="Wins" value={formatNumber(wins)} />
          <StatCard label="Losses" value={formatNumber(losses)} />
        </div>
      </div>
    </section>
  );
};

export default UserStatsSection;
