import "../../styles/theme.css";
import "../../styles/utilities.css";
import "../../styles/sections/KeyFeatures.css";
import walletRectIcon from "../../assets/icons/walleRectIcon.svg";
import trophyIcon from "../../assets/icons/trophyIcon.svg";
import lightningIcon from "../../assets/icons/lightningIcon.svg";
const KeyFeatures = () => (
  <section
    className="section container key-features-section mx-container"
    aria-labelledby="key-features-heading"
  >
    <div
      className="key-features-card"
      role="group"
      aria-label="How it works features"
    >
      <h2 id="key-features-heading" className="key-features-title">
        How It Works
      </h2>
      <p className="key-features-description">
        The Embedded Universe puts players first with a simple, transparent
        gaming ecosystem.
      </p>

      <div className="key-features-cards" role="list">
        <div className="feature-card" role="listitem">
          <div className="feature-icon-wrap" aria-hidden="true">
            <img className="feature-icon-bg" src={walletRectIcon} alt="" />
          </div>
          <h3 className="feature-card-title">Wallet First</h3>
          <p className="feature-card-description">
            No sign-ups. No accounts. Just connect your wallet and start playing
            instantly. Your crypto wallet is your identity.
          </p>
        </div>

        <div className="feature-card" role="listitem">
          <div className="feature-icon-wrap" aria-hidden="true">
            <img className="feature-icon-bg" src={trophyIcon} alt="" />
          </div>
          <h3 className="feature-card-title">Seasonal Tournaments</h3>
          <p className="feature-card-description">
            Compete in ranked seasons with real SOL prizes. Top 500 players get
            paid monthly based on their performance.
          </p>
        </div>

        <div className="feature-card" role="listitem">
          <div className="feature-icon-wrap" aria-hidden="true">
            <img className="feature-icon-bg" src={lightningIcon} alt="" />
          </div>
          <h3 className="feature-card-title">Skill Beats Luck</h3>
          <p className="feature-card-description">
            Pure skill-based gameplay. No pay-to-win mechanics. Victory depends
            entirely on your ability to outplay opponents.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default KeyFeatures;
