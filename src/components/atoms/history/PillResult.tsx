import React from 'react';
import styles from './PillResult.module.css';

export type PillVariant = 'win' | 'loss';

interface PillResultProps {
  variant: PillVariant;
  children: React.ReactNode;
  className?: string;
}

export const PillResult: React.FC<PillResultProps> = ({ variant, children, className }) => {
  return (
    <span className={`${styles.pill} ${styles[variant]} ${className ?? ''}`.trim()}>
      {children}
    </span>
  );
};

export default PillResult;
