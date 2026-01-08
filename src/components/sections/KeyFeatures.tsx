import "../../styles/theme.css";
import "../../styles/utilities.css";
import "../../styles/sections/KeyFeatures.css";

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
            <img
              className="feature-icon-bg"
              src="https://www.figma.com/api/mcp/asset/38245700-0685-4bee-a7fb-76837c5f36e1"
              alt=""
            />
          </div>
          <h3 className="feature-card-title">Wallet First</h3>
          <p className="feature-card-description">
            No sign-ups. No accounts. Just connect your wallet and start playing
            instantly. Your crypto wallet is your identity.
          </p>
        </div>

        <div className="feature-card" role="listitem">
          <div className="feature-icon-wrap" aria-hidden="true">
            <img
              className="feature-icon-bg"
              src="https://www.figma.com/api/mcp/asset/5df814bd-de12-4c47-bfc2-7bfafeac5424"
              alt=""
            />
            <img
              className="feature-icon-fg"
              src="https://www.figma.com/api/mcp/asset/11f86341-c435-4125-bf6c-a260f6dee5da"
              alt=""
            />
          </div>
          <h3 className="feature-card-title">Seasonal Tournaments</h3>
          <p className="feature-card-description">
            Compete in ranked seasons with real SOL prizes. Top 500 players get
            paid monthly based on their performance.
          </p>
        </div>

        <div className="feature-card" role="listitem">
          <div className="feature-icon-wrap" aria-hidden="true">
            <img
              className="feature-icon-bg"
              src="https://www.figma.com/api/mcp/asset/3bd9b6ee-1f49-4841-a79b-273d75442145"
              alt=""
            />
            <img
              className="feature-icon-fg"
              src="https://www.figma.com/api/mcp/asset/0614fd92-92f1-4bd7-91ac-60022748f8ea"
              alt=""
            />
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
