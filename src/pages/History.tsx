import MainLayout from '../components/templates/MainLayout';
import PageHeader from '../components/molecules/PageHeader';
import UserStatsSection from '../components/organisms/history/UserStatsSection';
import UserHistorySection from '../components/organisms/history/UserHistorySection';
import { useMatchHistory } from '../hooks/useMatchHistory';
import { useWallet } from '@solana/wallet-adapter-react';

const History = () => {
  const { publicKey, connected } = useWallet();
  const walletAddress = publicKey?.toString();
  const isConnected = connected && Boolean(walletAddress);

  const { loading, error, stats, groups, hasMore, showMore } = useMatchHistory(walletAddress, { pageSize: 20 });

  if (!connected) {
    return (
      <MainLayout>
        <PageHeader 
          title="Game History" 
          description="Track your gaming sessions and progress over time"
        />
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 'var(--spacing-lg)',
          padding: 'var(--spacing-xl)',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontFamily: 'var(--font-body)', 
            fontWeight: 300, 
            color: '#AE43FF' 
          }}>
            Connect your wallet to view your match history
          </h3>
        </div>
      </MainLayout>
    );
  }

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
