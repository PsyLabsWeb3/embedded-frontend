import "../../styles/theme.css";
import "../../styles/utilities.css";
import "../../styles/sections/HeroSection.css";
import HeroStatCard from "./HeroStatCard";
import { useNavigate } from "react-router-dom";
import type HeroSection from "./HeroSection";


const RewardsBannerSection = () => {
  const navigate = useNavigate();

  const handleStartPlaying = () => {
    navigate("/games");
  } 

  return (
    <section className="hero-section section container mx-container">
      <h1 className="hero-title gradient-title">Play, Compete, Earn</h1>
      {/* Desktop/Tablet Layout */}
      <div className="hero-section__row">
        <p className="hero-section__subtitle">
          A decentralized gaming platform that rewards players with real crypto.
          No accounts needed—just your wallet.{" "}
        </p>
        <div className="hero-section__buttons">
          <button
            className="hero-section__cta hero-section__cta--primary"
            onClick={handleStartPlaying}
          >
            PLAY NOW
          </button>
          <a
            className="hero-section__cta hero-section__cta--secondary"
            href="https://embedded.games/wp-content/uploads/2025/06/Embedded-Whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            WHITEPAPER
          </a>
        </div>
      </div>
      {/* Mobile Layout */}
      <div className="hero-section__mobile">
        <HeroStatCard />
      </div>
    </section>
  );
};

export default RewardsBannerSection;
