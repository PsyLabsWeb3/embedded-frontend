// import solanaIcon from "../../assets/solanaicon.png";
import "../../styles/theme.css";
import "../../styles/utilities.css";
import "../../styles/sections/RewardsBanner.css";

const RewardsSection = () => (
  <section className="pool-rewards-section section container mx-container">
    <div className="pool-rewards-banner">
      {/* <div className="rewards-section__icon-wrapper">
        <img
          src={solanaIcon}
          alt="Solana Logo"
          className="rewards-section__icon"
        />
      </div> */}
      <div className="pool-rewards-content">
        <span className="rewards-section__amount">
          $735.52
        </span>
        <span className="rewards-section__label">
          DISTRIBUTED IN REWARDS!
        </span>
      </div>
    </div>
  </section>
);

export default RewardsSection;
