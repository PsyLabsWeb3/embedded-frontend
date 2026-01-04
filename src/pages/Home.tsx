import Navbar from '../components/sections/Navbar';
import HeroSection from '../components/sections/HeroSection';
import RewardsSection from '../components/sections/RewardsSection';
import PoolRewardsBanner from '../components/sections/PoolRewardsBanner';
// import GameListSection from '../components/sections/GameListSection';
// import CategoryListSection from '../components/sections/CategoryListSection';
import KeyFeatures from '../components/sections/KeyFeatures';
import RewardSystemSection from '../components/sections/RewardSystemSection';
import RewardsBannerSection from '../components/sections/RewardsBannerSection';
import FreeToPlaySection from '../components/sections/FreeToPlaySection';
import PvPSection from '../components/sections/PvPSection';
import PvESection from '../components/sections/PvESection';
import RewardsOverviewSection from '../components/sections/RewardsOverviewSection';
import MobileGameSections from '../components/sections/MobileGameSections';

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
      {!isMobileView && <HeroSection />}
      {isMobileView && <h1 className="hero-title gradient-title">Play. Win. Level up.</h1>}
      {isMobileView && <MobileGameSections />}
      {isMobileView ? (
        <>
          <PoolRewardsBanner />
          <RewardsSection />
        </>
      ) : (
        <RewardsBannerSection />
      )}
      {!isMobileView && <FreeToPlaySection />}
      {!isMobileView && <PvPSection />}
      {!isMobileView && <PvESection />}
      {!isMobileView && <RewardsOverviewSection />}
      <KeyFeatures />
      <RewardSystemSection />
      <Footer />
    </>
  );
};

export default Home;
