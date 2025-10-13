import Navbar from '../components/sections/Navbar';
import HeroSection from '../components/sections/HeroSection';
import RewardsSection from '../components/sections/RewardsSection';
import PoolRewardsBanner from '../components/sections/PoolRewardsBanner';
import GameListSection from '../components/sections/GameListSection';
import KeyFeatures from '../components/sections/KeyFeatures';
import RewardSystemSection from '../components/sections/RewardSystemSection';
import RewardsBannerSection from '../components/sections/RewardsBannerSection';

import { useState, useEffect } from 'react';
import { Footer } from '../components/sections';

const Home = () => {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  console.log("isMobileView:", isMobileView);

  return (
    <>
      <Navbar />
      <HeroSection />
      {isMobileView ? (
        <>
          <PoolRewardsBanner />
          <RewardsSection />
        </>
      ) : (
        <RewardsBannerSection />
      )}

      <GameListSection />
      <KeyFeatures />
      <RewardSystemSection />
      <Footer />
    </>
  );
};

export default Home;
