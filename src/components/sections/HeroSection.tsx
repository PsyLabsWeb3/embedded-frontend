import "../../styles/theme.css";
import "../../styles/utilities.css";
import "../../styles/sections/HeroSection.css";
import HeroStatCard from "./HeroStatCard";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartPlaying = () => {
    navigate("/embedded");
  };

  return (
    <section className="hero-section section container mx-container">
      <h1 className="hero-title gradient-title">Play, Compete, Earn.</h1>
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
          <button className="hero-section__cta hero-section__cta--secondary">
            WHITEPAPER
          </button>
        </div>
      </div>
      {/* Mobile Layout */}
      <div className="hero-section__mobile">
        <HeroStatCard />
      </div>
    </section>
  );
};

export default HeroSection;
