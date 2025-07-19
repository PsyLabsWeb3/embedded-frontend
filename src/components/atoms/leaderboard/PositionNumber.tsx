import styles from './PositionNumber.module.css';

interface PositionNumberProps {
  position: number;
}

const getPositionClass = (position: number): string => {
  switch (position) {
    case 1:
      return styles.position1;
    case 2:
      return styles.position2;
    case 3:
      return styles.position3;
    default:
      return styles.positionDefault;
  }
};

export const PositionNumber: React.FC<PositionNumberProps> = ({ position }) => {
  return (
    <div className={`${styles.positionNumber} ${getPositionClass(position)}`}>
      {position}
    </div>
  );
};
