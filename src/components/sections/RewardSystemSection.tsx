import RewardTitle from '../atoms/RewardTitle';
import RewardSeparator from '../atoms/RewardSeparator';
import RewardListItem from '../molecules/RewardListItem';
import '../../styles/sections/RewardSystemSection.css';

const RewardSystemSection = () => (
  <section className="reward-system-section section container mx-container">
    <RewardTitle />
    <div className="reward-system-card">
      <p className="reward-system-desc">Embedded operates on a simple, transparent model.</p>
      <RewardSeparator />
      <ul className="reward-list">
        <RewardListItem>
          Transaction fees and entry fees go to the platform (if gas fee is $X, then the transaction fee is $X + $0.20
          )
        </RewardListItem>
        <RewardListItem>
          No hidden fees, no subscriptions
        </RewardListItem>
        <RewardListItem>
          Revenue is used for platform development, audits, and a rewards system for participants who actively and frequently engage with the platform.
        </RewardListItem>
      </ul>
    </div>
  </section>
);

export default RewardSystemSection;
