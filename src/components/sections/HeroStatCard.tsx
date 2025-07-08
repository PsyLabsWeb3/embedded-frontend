import '../../styles/sections/HeroStatCard.css';

const HeroStatCard = () => (
  <div className="hero-stat-card">
    <h2 className="hero-stat-card__title">Play. Compete. Earn.</h2>
    <p className="hero-stat-card__desc">
      A decentralized gaming platform rewarding players with real crypto—no accounts, no tokens, just your wallet.</p>
    <button className="hero-stat-card__button">START PLAYING!</button>
    <div className="hero-stat-card__stat">
      <div className="hero-stat-card__stat-main" id="hero-stat-gradient">
        +250K
      </div>
      <span className="hero-stat-card__players">PLAYERS</span>
    </div>
  </div>
);

export default HeroStatCard;
