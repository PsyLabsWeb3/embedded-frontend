import React, { useState } from 'react';
import MainLayout from '../components/templates/MainLayout';
import LeaderboardTable from '../components/LeaderboardTable';
import { RewardsBanner } from '../components/molecules/RewardsBanner';
import './Leaderboard.css';

// Fecha objetivo ejemplo
// const TARGET_DATE = new Date('2025-11-30T00:00:00Z');

// Fecha objetivo desde env (exposed by Vite)
const RAW_TARGET = import.meta.env.VITE_SEASON_TARGET_DATE as string;
const TARGET_DATE = new Date(RAW_TARGET);

function calcDaysLeft(target: Date): string {
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return '0 days';
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return days === 1 ? '1 day' : `${days} days`;
}

const LeaderboardPage: React.FC = () => {
    const [daysLeft] = useState<string>(() => calcDaysLeft(TARGET_DATE));
  return (
    <MainLayout>
      <div className="page-content">
        <h1 className="page-title">
          Leaderboard
        </h1>
        
        <RewardsBanner
          mainMessage="Climb up our leaderboard whether you win or lose."
          subMessage="Time left for reward distribution"
          daysLeft={daysLeft}
        />
        
        <LeaderboardTable title="" />
      </div>
    </MainLayout>
  );
};

export default LeaderboardPage;
