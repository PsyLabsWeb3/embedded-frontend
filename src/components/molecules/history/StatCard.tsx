import React from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: number | string;
  className?: string;
  variant?: 'primary';
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, className, variant }) => (
  <div className={`${styles.card} ${variant ? styles[variant] : ''} ${className ?? ''}`.trim()}>
    <div className={styles.value}>{value}</div>
    <div className={styles.label}>{label}</div>
  </div>
);

export default StatCard;
