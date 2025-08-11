import React from 'react';
import styles from './BannerText.module.css';

interface BannerTextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'highlight';
  className?: string;
}

export const BannerText: React.FC<BannerTextProps> = ({ 
  children, 
  variant = 'primary',
  className = "" 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'highlight':
        return styles.highlight;
      default:
        return styles.primary;
    }
  };

  return (
    <span className={`${styles.text} ${getVariantClass()} ${className}`}>
      {children}
    </span>
  );
};
