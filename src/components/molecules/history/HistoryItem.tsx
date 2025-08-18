import React from 'react';
import styles from './HistoryItem.module.css';
import PillResult from '../../atoms/history/PillResult';

interface HistoryItemProps {
  opponent: string;
  result: 'WIN' | 'LOSS' | string;
  dateText?: string;
  mode?: string | null;
  amount?: string | number | null;
  game?: string | null;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ opponent, result, dateText, mode, amount, game }) => {
  const upperResult = String(result).toUpperCase();
  const variant = upperResult === 'WIN' ? 'win' : 'loss';
  const amountText = amount === null || amount === undefined || amount === '' ? undefined : String(amount);
  const isLoss = upperResult === 'LOSS';
  
  const truncateOpponent = (text: string): string => {
    if (text.length <= 8) return text;
    return `${text.slice(0, 4)}...${text.slice(-4)}`;
  };
  
  return (
    <div className={styles.item} role="listitem">
      <div className={styles.row}>
        <div className={styles.leftMeta}>
          {mode && (
            <span className={`${styles.modePill} ${mode.toLowerCase() === 'casual' ? styles.modeCasual : ''}`.trim()}>
              {mode}
            </span>
          )}
          {dateText && <div className={styles.date}>{dateText}</div>}
          <div className={styles.vsRow}>
            <span className={styles.metaLabel}>vs:</span>
            <span className={styles.metaValue}>{truncateOpponent(opponent)}</span>
          </div>
          <div className={styles.gameRow}>
            <span className={styles.metaLabel}>Game:</span>
            <span className={styles.metaValue}>{game === null ? 'null' : game}</span>
          </div>
        </div>
        <div className={styles.rightCol}>
          <div className={styles.resultSlot}>
            <PillResult variant={variant}>{String(result).toUpperCase()}</PillResult>
          </div>
          {amountText && (
            <div className={styles.amountRow}>
              <span className={`${styles.amountValue} ${isLoss ? styles.amountLoss : ''}`.trim()}>
                {amountText}
                <span className={styles.amountCurrency}> USD</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
