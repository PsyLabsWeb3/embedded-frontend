import Navbar from '../components/sections/Navbar';
import HeroSection from '../components/sections/HeroSection';
import RewardsSection from '../components/sections/RewardsSection';
import PoolRewardsBanner from '../components/sections/PoolRewardsBanner';
import GameListSection from '../components/sections/GameListSection';
import KeyFeatures from '../components/sections/KeyFeatures';
import RewardSystemSection from '../components/sections/RewardSystemSection';

const Home = () => (
  <>
    <Navbar />
    <HeroSection />
  <RewardsSection />
  <PoolRewardsBanner />
    <GameListSection />
    <KeyFeatures />
    <RewardSystemSection />
  </>
);

export default Home;
