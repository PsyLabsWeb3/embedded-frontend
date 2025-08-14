import MainLayout from '../components/templates/MainLayout';
import PageHeader from '../components/molecules/PageHeader';
import UserStatsSection from '../components/organisms/history/UserStatsSection';
import UserHistorySection from '../components/organisms/history/UserHistorySection';
import { useMatchHistory } from '../hooks/useMatchHistory';

const getWalletAddress = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  const qs = new URLSearchParams(window.location.search);
  const fromQS = qs.get('walletAddress') || qs.get('wallet') || undefined;
  const fromLS = window.localStorage.getItem('walletAddress') || undefined;
  return fromQS || fromLS;
};

const History = () => {
  const walletAddress = getWalletAddress();
  const isConnected = Boolean(walletAddress);

  const { loading, error, stats, groups, hasMore, showMore } = useMatchHistory(walletAddress, { pageSize: 20 });

  return (
    <MainLayout>
      <PageHeader 
        title="Game History" 
        description="Track your gaming sessions and progress over time"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
        <UserStatsSection 
          points={isConnected ? stats.points : 0}
          wins={isConnected ? stats.wins : 0}
          losses={isConnected ? stats.losses : 0}
        />

        <UserHistorySection 
          groups={groups}
          loading={loading}
          error={error}
          hasMore={hasMore}
          onViewMore={showMore}
          isConnected={isConnected}
        />
      </div>
    </MainLayout>
  );
};

export default History;
