import React from 'react';
import MainLayout from '../components/templates/MainLayout';
import LeaderboardTable from '../components/LeaderboardTable';
import { RewardsBanner } from '../components/molecules/RewardsBanner';
import './Leaderboard.css';

const LeaderboardPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="page-content">
        <h1 className="page-title">
          Leaderboard
        </h1>
        
        <RewardsBanner
          mainMessage="Climb up our leaderboard whether you win or lose."
          subMessage="Time left for reward distribution"
          daysLeft="10 days"
        />
        
        <LeaderboardTable title="" />
      </div>
    </MainLayout>
  );
};

export default LeaderboardPage;
