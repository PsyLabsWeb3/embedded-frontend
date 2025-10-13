import "../../styles/theme.css";
import "../../styles/utilities.css";
import "../../styles/sections/RewardBannersSection.css";



import PoolRewardsBanner from "./PoolRewardsBanner";
import RewardsSection from "./RewardsSection";

const RewardsBannerSection = () => {


  return (
    <section className="rewards-banner-section section container mx-container">
      <PoolRewardsBanner />
      <RewardsSection />
    </section>
  );
};

export default RewardsBannerSection;
