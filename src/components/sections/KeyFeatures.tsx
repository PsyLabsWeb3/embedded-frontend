import '../../styles/theme.css';
import '../../styles/utilities.css';
import '../../styles/sections/KeyFeatures.css';
import solanaIcon from "../../assets/solanaicon.png";

const KeyFeatures = () => (
  <section className="section container key-features-section mx-container">
    <div className="key-features-header">
      <div className="key-features-bar" />
      <span className="key-features-label">Key Features</span>
    </div>
    <h2 className="key-features-title">
      A decentralised gaming platform
    </h2>
    <p className="key-features-description">
      Focused on rewarding players that compete in skill-based, PVP and PVE games and tournaments by airdropping a share of the transaction fee revenue with the Solana (SOL) token.
    </p>
    
    <div className="key-features-cards">
      <div className="feature-card">
  <img src="/gameboy.png" alt="Skill-Based Gaming" className="feature-icon" />
        <h3 className="feature-card-title">Skill-Based Gaming</h3>
        <p className="feature-card-description">Compete in games that reward skill and strategy</p>
      </div>
      <div className="feature-card">
  <img src={solanaIcon} alt="Real Rewards" className="feature-icon" />
        <h3 className="feature-card-title">Real Rewards</h3>
        <p className="feature-card-description">Earn $SOL for your gaming performance</p>
      </div>
      <div className="feature-card">
  <img src="/banner-icon.svg" alt="Decentralized" className="feature-icon" />
        <h3 className="feature-card-title">Decentralized</h3>
        <p className="feature-card-description">No user names, no accs, just your wallet.</p>
      </div>
    </div>
  </section>
);

export default KeyFeatures;
