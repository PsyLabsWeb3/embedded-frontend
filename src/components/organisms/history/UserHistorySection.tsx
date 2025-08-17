import React from 'react';
import styles from './UserHistorySection.module.css';
import HistoryItem from '../../molecules/history/HistoryItem';

interface DayGroupItem { opponent: string; result: 'WIN' | 'LOSS' | string; matchDate?: string; mode?: string | null; amount?: string | number | null; game?: string | null }
interface DayGroup {
  dayText: string; // e.g., July 29, 2025
  items: Array<DayGroupItem>;
}

interface UserHistorySectionProps {
  groups: DayGroup[];
  loading?: boolean;
  error?: string | null;
  hasMore?: boolean;
  onViewMore?: () => void;
  isConnected?: boolean;
}

export const UserHistorySection: React.FC<UserHistorySectionProps> = ({
  groups,
  loading,
  error,
  hasMore,
  onViewMore,
  isConnected,
}) => {
  const toMonthText_DD_YY = (dayText: string): string => {
    const parsed = new Date(dayText);
    if (isNaN(parsed.getTime())) return dayText;
    const month = parsed.toLocaleString('en-US', { month: 'long' });
    const day = parsed.getDate();
    const yy = String(parsed.getFullYear()).slice(-2);
    return `${month} ${day}, ${yy}`;
  };

  return (
    <section aria-label="User match history">
      <h2 className={styles.title}>Match History</h2>
      <div className={styles.wrapper}>
  {error && <div className={styles.error} role="alert">{error}</div>}
        {loading && <div className={styles.loading}>Loading…</div>}

        {!loading && !error && groups.length === 0 && (
          <div className={styles.empty} role="status" aria-live="polite">
            {isConnected ? 'No matches found.' : 'No matches found. Connect your wallet to view your history.'}
          </div>
        )}

        {!loading && !error && groups.length > 0 && (
          <div className={styles.list} role="list">
            {groups.map((g) => (
              <div key={g.dayText} className={styles.group}>
                <div className={styles.groupItems}>
                  {g.items.map((it, idx) => (
                    <HistoryItem
                      key={idx}
                      opponent={it.opponent}
                      result={it.result}
                      dateText={toMonthText_DD_YY(g.dayText)}
                      mode={it.mode ?? undefined}
                      amount={it.amount ?? undefined}
                      game={it.game}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {hasMore && !loading && (
          <div className={styles.moreWrapper}>
            <button className={styles.moreBtn} type="button" onClick={onViewMore}>View more</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default UserHistorySection;
