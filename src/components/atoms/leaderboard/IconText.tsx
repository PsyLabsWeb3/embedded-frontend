import styles from './IconText.module.css';

interface IconTextProps {
  icon: string;
  value: string;
  iconColor?: string;
  textColor?: string;
}

export const IconText: React.FC<IconTextProps> = ({ 
  icon, 
  value, 
  iconColor,
  textColor
}) => {
  return (
    <div className={styles.container}>
      <span className={iconColor || styles.icon}>{icon}</span>
      <span className={textColor || styles.text}>{value}</span>
    </div>
  );
};
