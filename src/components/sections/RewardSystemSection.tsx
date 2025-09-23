

// Reward System Section displays the reward model for the platform.
// Desktop and mobile layouts differ: desktop uses individual cards with gradients and green shadow, mobile uses a single card.

import RewardListItem from '../molecules/RewardListItem';
import '../../styles/sections/RewardSystemSection.css';


// List of reward system points to display as cards
const rewardItems: string[] = [
  'Transaction fees and entry fees go to the platform (if gas fee is $X, then the transaction fee is $X + $0.20)',
  'No hidden fees, no subscriptions',
  'Revenue is used for platform development, audits, and a rewards system for participants who actively and frequently engage with the platform.'
];


/**
 * RewardSystemSection
 * Renders the reward system section with a custom title, description, and a list of reward points.
 * - On desktop: Each reward point is shown as a card with a gradient background and green shadow.
 * - On mobile: The section is wrapped in a single card, and the description is hidden.
 */
const RewardSystemSection = () => (
  <section className="reward-system-section section container mx-container">
    {/* Section title styled with Alumni Sans Regular */}
    <h2 className="reward-title-custom">REWARD SYSTEM</h2>
    <div className="reward-system-card">
      {/* Description is centered, styled with Nunito Medium, and only visible on desktop */}
      <p className="reward-system-desc-custom">Embedded operates on a simple, transparent model.</p>
      <ul className="reward-list">
        {rewardItems.map((text, idx) => {
          // Alternate gradient: even indices use gradient-a, odd use gradient-b
          const cardClass = idx % 2 === 0 ? 'reward-card--gradient-a' : 'reward-card--gradient-b';
          return (
            <li key={idx} className="reward-list-item-wrapper">
              {/* Each reward item is wrapped in a card with gradient and green shadow (desktop only) */}
              <div className={`reward-card-desktop ${cardClass}`}>
                <RewardListItem>{text}</RewardListItem>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);

export default RewardSystemSection;
