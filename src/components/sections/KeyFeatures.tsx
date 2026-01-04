import '../../styles/theme.css';
import '../../styles/utilities.css';
import '../../styles/sections/KeyFeatures.css';
import solanaIcon from "../../assets/solanaicon.png";

const KeyFeatures = () => (
  <section className="section container key-features-section mx-container">
    <div className="key-features-header">
      <div className="key-features-bar" />
      <span className="key-features-label">How It Works</span>
    </div>
    <h2 className="key-features-title">
      The Embedded Universe puts players first
    </h2>
    <p className="key-features-description">
      Simple, transparent gaming ecosystem built around real rewards and pure skill.
    </p>
    
    <div className="key-features-cards">
      <div className="feature-card">
        <img src="/gameboy.png" alt="Wallet First" className="feature-icon" />
        <h3 className="feature-card-title">Wallet First</h3>
        <p className="feature-card-description">No sign-ups. Connect your wallet and play.</p>
      </div>
      <div className="feature-card">
        <img src={solanaIcon} alt="Seasonal Tournaments" className="feature-icon" />
        <h3 className="feature-card-title">Seasonal Tournaments</h3>
        <p className="feature-card-description">Compete for real SOL prizes each season.</p>
      </div>
      <div className="feature-card">
        <img src="/banner-icon.svg" alt="Skill Beats Luck" className="feature-icon" />
        <h3 className="feature-card-title">Skill Beats Luck</h3>
        <p className="feature-card-description">Pure skill-based gameplay. No pay-to-win.</p>
      </div>
    </div>
  </section>
);

export default KeyFeatures;
