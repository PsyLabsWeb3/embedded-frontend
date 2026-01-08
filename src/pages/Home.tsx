import Navbar from "../components/sections/Navbar";
import HeroSection from "../components/sections/HeroSection";
import KeyFeatures from "../components/sections/KeyFeatures";
import RewardSystemSection from "../components/sections/RewardSystemSection";
// import FreeToPlaySection from "../components/sections/FreeToPlaySection";
// import PvPSection from "../components/sections/PvPSection";
// import PvESection from "../components/sections/PvESection";
import RewardsOverviewSection from "../components/sections/RewardsOverviewSection";
import MobileGameSections from "../components/sections/MobileGameSections";
import CursorGlow from "../components/ui/CursorGlow";

import { useState, useEffect } from "react";
import { Footer } from "../components/sections";

const Home = () => {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log("isMobileView:", isMobileView);

  return (
    <>
      <CursorGlow />
      <Navbar />
      <HeroSection />

      {/* <>
          <PoolRewardsBanner />
          <RewardsSection />
        </> */}

      {/* <RewardsBannerSection /> */}

      <MobileGameSections />

      {/* <FreeToPlaySection />
      <PvPSection />
      <PvESection /> */}
      <RewardsOverviewSection />
      <KeyFeatures />
      {/* <RewardSystemSection /> */}
      <Footer />
    </>
  );
};

export default Home;
