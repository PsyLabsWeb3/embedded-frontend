import '../../styles/theme.css';
import '../../styles/utilities.css';
import '../../styles/sections/KeyFeatures.css';

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
  </section>
);

export default KeyFeatures;
